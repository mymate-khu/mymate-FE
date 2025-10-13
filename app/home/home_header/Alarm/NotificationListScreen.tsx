// app/notification/NotificationListScreen.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet, SectionList, ListRenderItem } from "react-native";

import BackHeader from "@/components/BackHeader";
import SectionHeader from "@/app/home/home_mate_overview/MateManage/SectionHeader";
import NotificationRow, {
  NotificationType,
  NotificationRowProps,
} from "./NotificationRow";

/* ===== 타입 ===== */
type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;      // ISO
  // mate_invite 전용 액션 (선택)
  onAccept?: () => void;
  onDecline?: () => void;
};

/* ===== 더미 데이터 ===== */
const NOW = Date.now();
const D = (min: number) => new Date(NOW - min * 60 * 1000).toISOString();

const DUMMY: NotificationItem[] = [
  {
    id: "n1",
    type: "schedule",
    title: "일정 추가",
    message: "손민수님이 캘린더에 일정을 추가하셨습니다.",
    createdAt: D(4),
  },
  {
    id: "n2",
    type: "mate_invite",
    title: "메이트 요청",
    message: "박민지님이 메이트 요청을 보냈습니다.",
    createdAt: D(9),
  },
  {
    id: "n3",
    type: "settlement",
    title: "정산 요청",
    message: "김희영님이 새로운 정산을 등록하셨습니다.",
    createdAt: D(120), // 2시간 전
  },
  {
    id: "n4",
    type: "comment",
    title: "새 댓글",
    message: "손민수님이 댓글을 남기셨습니다.",
    createdAt: D(60 * 24), // 1일 전
  },
  {
    id: "n5",
    type: "comment",
    title: "새 댓글",
    message: "손민수님이 댓글을 남기셨습니다.",
    createdAt: D(60 * 36), // 1.5일 전
  },
];

/* ===== 분류 기준: 시간만 사용 ===== */
const NEW_THRESHOLD_HOURS = 24;

const isWithinHours = (d: string | number | Date, hours = NEW_THRESHOLD_HOURS) =>
  (Date.now() - new Date(d).getTime()) / 36e5 <= hours;

// 최신순 정렬
const byCreatedDesc = (a: NotificationItem, b: NotificationItem) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export default function NotificationListScreen() {
  const [items] = useState<NotificationItem[]>(DUMMY);

  // 액션 예시(필요 시 API 연동)
  const handleAccept = useCallback((id: string) => {
    console.log("[invite ACCEPT]", id);
  }, []);

  const handleDecline = useCallback((id: string) => {
    console.log("[invite DECLINE]", id);
  }, []);

  const handleOpen = useCallback((id: string) => {
    console.log("[row PRESS] open:", id);
  }, []);

  // 섹션 데이터 (시간 기준만)
  const sections = useMemo(() => {
    const newList = items.filter(n => isWithinHours(n.createdAt)).sort(byCreatedDesc);
    const oldList = items.filter(n => !isWithinHours(n.createdAt)).sort(byCreatedDesc);

    return [
      ...(newList.length ? [{ key: "new", title: "새 알림", data: newList }] : []),
      ...(oldList.length ? [{ key: "old", title: "이전 알림", data: oldList }] : []),
    ];
  }, [items]);

  const renderItem: ListRenderItem<NotificationItem> = ({ item }) => {
    const rowProps: NotificationRowProps = {
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      onPress: () => handleOpen(item.id),
    };

    if (item.type === "mate_invite") {
      rowProps.onAccept = () => handleAccept(item.id);
      rowProps.onDecline = () => handleDecline(item.id);
    }

    return <NotificationRow {...rowProps} />;
  };

  return (
    <View style={s.container}>
      <BackHeader title="알림" />
      <SectionList
        sections={sections}
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