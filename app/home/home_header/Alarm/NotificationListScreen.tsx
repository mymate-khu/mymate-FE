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
import { acceptInvitation } from "@/components/apis/invitations";

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
  relatedEntityId?: number; // 초대 ID를 저장
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

const toUIItem = (n: ApiNotification): NotificationItem => {
  const uiType = mapApiTypeToUIType(n.type);
  console.log(`🔍 알림 매핑: ${n.type} → ${uiType}, relatedEntityId: ${n.relatedEntityId}`);
  
  return {
    id: String(n.id),
    type: uiType,
    title: n.title ?? "",
    message: n.content ?? "",
    createdAt: n.createdAt ?? new Date().toISOString(),
    unread: n.status === "UNREAD",
    relatedEntityId: n.relatedEntityId, // 초대 ID 저장
  };
};

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

  /* ---- 서버에서 목록 조회 ---- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 실제 목록 엔드포인트로 변경 필요 시 여기 수정
        const res = await TokenReq.get("/api/notifications");
        console.log("🔍 알림 API 응답:", res.data);
        const list = res.data?.data?.content ?? [];
        console.log("🔍 알림 목록:", list);
        
        const mapped = list.map(toUIItem).sort(byCreatedDesc);
        console.log("🔍 매핑된 알림 목록:", mapped);
        
        if (mounted) setItems(mapped);
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

  /* ---- 그룹 초대: 수락 → 읽음 처리 → 메이트 추가 ---- */
  const handleAccept = useCallback(async (id: string) => {
    try {
      // 알림 데이터에서 실제 초대 ID 찾기
      const notification = items.find(n => n.id === id);
      if (!notification) {
        Alert.alert("오류", "알림을 찾을 수 없습니다.");
        return;
      }

      if (!notification.relatedEntityId) {
        Alert.alert("오류", "초대 정보를 찾을 수 없습니다.");
        return;
      }

      // 알림을 읽음 처리
      optimisticRead(id);
      await markAsRead(id);

      // 초대 수락 API 호출 (relatedEntityId를 invitationId로 사용)
      await acceptInvitation(notification.relatedEntityId);

      // 성공 메시지 표시
      Alert.alert("초대 수락", "초대를 수락했습니다! 메이트 목록에서 확인할 수 있습니다.", [
        { text: "확인" }
      ]);

      // 알림 목록에서 해당 항목 제거 (수락된 초대는 더 이상 표시하지 않음)
      setItems(prev => prev.filter(item => item.id !== id));

    } catch (e) {
      console.error("초대 수락 실패:", e);
      Alert.alert("오류", "초대 수락에 실패했습니다. 다시 시도해주세요.");
      
      // 실패 시 읽음 상태 롤백
      setItems(prev => prev.map(n => n.id === id ? { ...n, unread: true } : n));
    }
  }, [optimisticRead, items]);

  /* ---- 그룹 초대: 거절 ---- */
  const handleDecline = useCallback(async (id: string) => {
    try {
      // 알림을 읽음 처리
      optimisticRead(id);
      await markAsRead(id);

      // TODO: 실제 초대 거절 API가 있다면 호출 추가
      // await TokenReq.post(`/api/group-invites/${inviteId}/decline`);

      // 성공 메시지 표시
      Alert.alert("초대 거절", "초대를 거절했습니다.", [
        { text: "확인" }
      ]);

      // 알림 목록에서 해당 항목 제거 (거절된 초대는 더 이상 표시하지 않음)
      setItems(prev => prev.filter(item => item.id !== id));

    } catch (e) {
      console.error("초대 거절 실패:", e);
      Alert.alert("오류", "거절 처리 중 문제가 발생했습니다.");
      
      // 실패 시 읽음 상태 롤백
      setItems(prev => prev.map(n => n.id === id ? { ...n, unread: true } : n));
    }
  }, [optimisticRead]);

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
  const renderItem: ListRenderItem<NotificationItem> = ({ item }) => {
    const props: NotificationRowProps = {
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      unread: item.unread,
      onPress: handleOpen,
    };

    if (item.type === "mate_invite") {
      props.onAccept = handleAccept;
      props.onDecline = handleDecline;
    }

    return <NotificationRow {...props} />;
  };

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
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  listContent: { paddingBottom: 24 },
  separator: { height: 1, backgroundColor: "#F3F3F3", marginLeft: 72 },
});
