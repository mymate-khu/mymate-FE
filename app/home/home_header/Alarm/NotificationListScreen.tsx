import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, SectionList, ListRenderItem, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import BackHeader from "@/components/BackHeader";
import SectionHeader from "@/app/home/home_mate_overview/MateManage/SectionHeader";
import NotificationRow, {
  NotificationType,
  NotificationRowProps,
} from "./NotificationRow";
import { TokenReq } from "@/components/apis/axiosInstance";

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
};

/* ===== 서버 타입 → UI 타입 매핑 ===== */
const mapApiTypeToUIType = (t: string): NotificationType => {
  switch (t) {
    case "MATE_INVITE":
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
  const [loading, setLoading] = useState(true);

  /* ---- 서버에서 목록 조회 ---- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 실제 목록 엔드포인트로 변경 필요 시 여기 수정
        const res = await TokenReq.get("/api/notifications");
        console.log(res)
        const list = res.data?.data?.content ?? [];
        const mapped = list.map(toUIItem).sort(byCreatedDesc);
        if (mounted) setItems(mapped);
      } catch (e: any) {
        console.error("[notifications] fetch error:", e?.response?.data ?? e);
        Alert.alert("알림", "알림을 불러오는 중 문제가 발생했습니다.");
      } finally {
        if (mounted) setLoading(false);
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

  /* ---- 그룹 초대: 수락 → 읽음 처리 → 로그인 이동 ---- */
  const handleAccept = useCallback(async (id: string) => {
    try {
      optimisticRead(id);
      await markAsRead(id);

      // TODO: 실제 초대 수락 API가 있다면 여기에 호출 추가
      // await TokenReq.post(`/api/group-invites/${inviteId}/accept`);

      router.replace("/login/loginpage" as any); // 뒤로가기 방지
    } catch (e) {
      Alert.alert("오류", "수락 처리 중 문제가 발생했습니다.");
    }
  }, [optimisticRead]);

  /* ---- 그룹 초대: 거절 ---- */
  const handleDecline = useCallback(async (id: string) => {
    try {
      optimisticRead(id);
      await markAsRead(id);

      // TODO: 실제 초대 거절 API가 있다면 호출 추가
      // await TokenReq.post(`/api/group-invites/${inviteId}/decline`);

      Alert.alert("알림", "초대가 거절되었습니다.");
    } catch (e) {
      Alert.alert("오류", "거절 처리 중 문제가 발생했습니다.");
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
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
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
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  listContent: { paddingBottom: 24 },
  separator: { height: 1, backgroundColor: "#F3F3F3", marginLeft: 72 },
});
