import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, SectionList, ListRenderItem, Alert } from "react-native";
import { router } from "expo-router";

import BackHeader from "@/components/BackHeader";
import SectionHeader from "@/app/home/home_mate_overview/MateManage/SectionHeader";
import NotificationRow, {
  NotificationType,
  NotificationRowProps,
} from "./NotificationRow";
import { TokenReq } from "@/components/apis/axiosInstance";
import { acceptInvitation, rejectInvitation, fetchMyInvitations, ReceivedInvitation } from "@/components/apis/invitations";

/* ===== 서버 응답 타입 ===== */
type ApiAction = {
  type: string;
  label: string;
  style: string;
  apiUrl: string;
  method: string; // "GET" | "POST" | "PATCH" ...
};

type ApiNotification = {
  id: number;
  title: string;
  content: string;
  type: string; // e.g. "PUZZLE_CREATED", "MATE_INVITE", ...
  status: "UNREAD" | "READ";
  priority: "LOW" | "MEDIUM" | "HIGH";
  senderId: number;
  senderName: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  actions?: ApiAction[];
  navigationUrl?: string;
  readAt?: string;
  navigatedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
};

type ApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    content: ApiNotification[];
  };
  success: boolean;
};

/* ===== UI 타입 ===== */
type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  unread?: boolean;
  isProcessing?: boolean; // 수락/거절 처리 중인지 여부
};

/* ===== 서버 타입 → UI 타입 매핑 ===== */
const mapApiTypeToUIType = (t: string): NotificationType => {
  switch (t) {
    case "GROUP_INVITATION_RECEIVED":
    case "INVITE_RECEIVED":
      return "mate_invite";
    case "SETTLEMENT_CREATED":
    case "SETTLEMENT_REQUEST":
      return "settlement";
    case "COMMENT_CREATED":
    case "REPLY_CREATED":
      return "comment";
    case "PUZZLE_CREATED":
    case "SCHEDULE_CREATED":
    case "EVENT_CREATED":
    default:
      return "schedule";
  }
};

const toUIItem = (n: ApiNotification): NotificationItem => ({
  id: String(n.id),
  type: mapApiTypeToUIType(n.type),
  title: n.title ?? "",
  message: n.content ?? "",
  createdAt: n.createdAt ?? new Date().toISOString(),
  unread: n.status === "UNREAD",
});

/* ===== 분류/정렬 ===== */
const NEW_THRESHOLD_HOURS = 24;
const isWithinHours = (d: string | number | Date, hours = NEW_THRESHOLD_HOURS) =>
  (Date.now() - new Date(d).getTime()) / 36e5 <= hours;

const byCreatedDesc = (a: NotificationItem, b: NotificationItem) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/* ===== 읽음 처리 API ===== */
const READ_ENDPOINT = (id: string) => `/api/notifications/${id}/read`;
const markAsRead = async (id: string) => {
  try {
    await TokenReq.post(READ_ENDPOINT(id));
  } catch (e) {
    console.error("[read API] failed:", e);
  }
};

export default function NotificationListScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [invitations, setInvitations] = useState<ReceivedInvitation[]>([]);

  /* ---- 서버에서 목록 조회 ---- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 알림 목록과 초대 목록을 병렬로 가져오기
        const [notificationsRes, invitationsData] = await Promise.all([
          TokenReq.get("/api/notifications"),
          fetchMyInvitations()
        ]);
        
        console.log("🔔 [알림 응답]", notificationsRes.data);
        console.log("📨 [초대 목록]", invitationsData);
        
        const list = notificationsRes.data?.data?.content ?? [];
        console.log("🔔 [알림 목록]", list);
        const mapped = list.map(toUIItem).sort(byCreatedDesc);
        console.log("🔔 [매핑된 알림]", mapped);
        
        if (mounted) {
          setItems(mapped);
          setInvitations(invitationsData);
        }
      } catch (e: any) {
        console.error("[notifications] fetch error:", e?.response?.data ?? e);
        Alert.alert("알림", "알림을 불러오는 중 문제가 발생했습니다.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---- 공통: 낙관적 읽음 반영 ---- */
  const optimisticRead = useCallback((id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  /* ---- 탭: 읽음 처리 → 라우팅 ----
     규칙: mate_invite 제외 전부 "/(tabs)/home"
           settlement만 "(tabs)/adjustment"로 별도 처리(네가 이미 넣은 규칙 유지) */
  const handleOpen = useCallback(async (id: string) => {
    const target = items.find(n => n.id === id);
    if (!target) return;

    optimisticRead(id);
    await markAsRead(id);

    if (target.type === "mate_invite") {
      // 그룹 초대는 CTA(수락/거절)로 처리. 탭 시 이동 없음.
      return;
    }
    if (target.type === "settlement") {
      router.replace("(tabs)/adjustment");
      return;
    }
    router.push("/(tabs)/home" as any);
  }, [items, optimisticRead]);

  /* ---- 그룹 초대: 수락 → 읽음 처리 → 홈으로 이동 ---- */
  const handleAccept = useCallback(async (id: string) => {
    console.log("✅ [수락하기 클릭]", id);
    console.log("✅ [현재 items]", items);
    console.log("✅ [현재 초대 목록]", invitations);
    
    try {
      const target = items.find(n => n.id === id);
      console.log("✅ [찾은 target]", target);
      
      if (!target) {
        Alert.alert("오류", "알림 정보를 찾을 수 없습니다.");
        return;
      }

      // 초대 목록에서 PENDING 상태인 첫 번째 초대 찾기
      // (실제로는 알림의 senderId나 groupId로 매칭하는 것이 더 정확함)
      const pendingInvitation = invitations.find(inv => inv.status === 'PENDING');
      
      console.log("✅ [찾은 PENDING 초대]", pendingInvitation);
      
      if (!pendingInvitation) {
        Alert.alert("오류", "수락 가능한 초대를 찾을 수 없습니다.");
        return;
      }

      console.log("✅ [초대 ID]", pendingInvitation.id);

      // 처리 중 상태로 변경
      console.log("⏳ [처리 중 상태로 변경]", id);
      setItems(prev => {
        const updated = prev.map(n => (n.id === id ? { ...n, isProcessing: true } : n));
        console.log("⏳ [업데이트된 items]", updated);
        return updated;
      });

      // 초대 수락 API 호출
      console.log("✅ [초대 수락 API 호출 시작]", pendingInvitation.id);
      await acceptInvitation(pendingInvitation.id);
      console.log("✅ [초대 수락 API 완료]");
      
      // 읽음 처리
      optimisticRead(id);
      await markAsRead(id);
      
      // 초대 목록에서 상태 업데이트 (ACCEPTED로 변경)
      setInvitations(prev => prev.map(inv => 
        inv.id === pendingInvitation.id 
          ? { ...inv, status: 'ACCEPTED' as const }
          : inv
      ));

      Alert.alert("알림", "그룹 초대를 수락했습니다!", [
        {
          text: "확인",
          onPress: () => {
            // 홈 화면으로 이동 (메이트 목록이 자동으로 갱신됨)
            router.replace("/(tabs)/home" as any);
          }
        }
      ]);
    } catch (e: any) {
      console.error("❌ [초대 수락 실패]", e);
      console.error("❌ [에러 상세]", e?.response?.data ?? e);
      // 처리 실패 시 처리 중 상태 해제
      setItems(prev => prev.map(n => (n.id === id ? { ...n, isProcessing: false } : n)));
      Alert.alert("오류", "초대 수락 중 문제가 발생했습니다.");
    }
  }, [items, invitations, optimisticRead]);

  /* ---- 그룹 초대: 거절 ---- */
  const handleDecline = useCallback(async (id: string) => {
    console.log("🚫 [거절하기 클릭]", id);
    
    try {
      const target = items.find(n => n.id === id);
      if (!target) {
        Alert.alert("오류", "알림 정보를 찾을 수 없습니다.");
        return;
      }

      // 초대 목록에서 PENDING 상태인 첫 번째 초대 찾기
      const pendingInvitation = invitations.find(inv => inv.status === 'PENDING');
      
      if (!pendingInvitation) {
        Alert.alert("오류", "거절 가능한 초대를 찾을 수 없습니다.");
        return;
      }

      console.log("🚫 [거절할 초대 ID]", pendingInvitation.id);

      // 처리 중 상태로 변경
      setItems(prev => prev.map(n => (n.id === id ? { ...n, isProcessing: true } : n)));

      // 초대 거절 API 호출
      await rejectInvitation(pendingInvitation.id);
      console.log("🚫 [초대 거절 API 완료]");
      
      // 읽음 처리
      optimisticRead(id);
      await markAsRead(id);
      
      // 초대 목록에서 상태 업데이트 (REJECTED로 변경)
      setInvitations(prev => prev.map(inv => 
        inv.id === pendingInvitation.id 
          ? { ...inv, status: 'REJECTED' as const }
          : inv
      ));

      Alert.alert("알림", "초대를 거절했습니다.");
    } catch (e: any) {
      console.error("❌ [초대 거절 실패]", e);
      console.error("❌ [에러 상세]", e?.response?.data ?? e);
      // 처리 실패 시 처리 중 상태 해제
      setItems(prev => prev.map(n => (n.id === id ? { ...n, isProcessing: false } : n)));
      Alert.alert("오류", "거절 처리 중 문제가 발생했습니다.");
    }
  }, [items, invitations, optimisticRead]);

  /* ---- 섹션 구성 ---- */
  const sections = useMemo(() => {
    const newList = items.filter(n => isWithinHours(n.createdAt));
    const oldList = items.filter(n => !isWithinHours(n.createdAt));
    return [
      ...(newList.length ? [{ key: "new", title: "새 알림", data: newList }] : []),
      ...(oldList.length ? [{ key: "old", title: "이전 알림", data: oldList }] : []),
    ];
  }, [items]);

  /* ---- 렌더러 ---- */
  const renderItem: ListRenderItem<NotificationItem> = useCallback(({ item }) => {
    // 초대 관련 알림인 경우, 초대 목록에서 PENDING 상태가 아니면 버튼 비활성화
    const hasPendingInvitation = item.type === "mate_invite" && 
      invitations.some(inv => inv.status === 'PENDING');
    
    const props: NotificationRowProps = {
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      unread: item.unread,
      isProcessing: item.isProcessing || (item.type === "mate_invite" && !hasPendingInvitation),
      onPress: handleOpen,
    };

    if (item.type === "mate_invite") {
      console.log("📋 [renderItem] mate_invite 감지", item);
      console.log("📋 [renderItem] hasPendingInvitation:", hasPendingInvitation);
      props.onAccept = handleAccept;
      props.onDecline = handleDecline;
      console.log("📋 [renderItem] props 설정 완료", { 
        hasOnAccept: !!props.onAccept, 
        hasOnDecline: !!props.onDecline,
        isProcessing: props.isProcessing
      });
    }

    return <NotificationRow {...props} />;
  }, [invitations, handleOpen, handleAccept, handleDecline]);

  return (
    <View style={s.container}>
      <BackHeader title="알림" />
      <SectionList
        sections={sections as any}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} style={{ backgroundColor: "#fff" }} />
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={s.listContent}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        extraData={[items, invitations]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  listContent: { paddingBottom: 24 },
  separator: { height: 1, backgroundColor: "#F3F3F3", marginLeft: 72 },
});
