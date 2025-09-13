import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DayTab from "./DayTab";

import SegmentedMM from "./SegmentedMM";
import type { Mode } from "./SegmentedMM";

import TodayPuzzleStack from "./TodayPuzzleStack";
import type { StackItem } from "./TodayPuzzleStack";

import StatusBadge from "./StatusBadge";
import type { MateStatus } from "./StatusBadge";

// ── 데모 데이터 ───────────────────────────────────────────────
type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ME용 데이터 (노랑)
const ME_DATA: Record<Day, StackItem[]> = {
  0: [{ title: "일요일 정리", desc: "침구 세탁" }],
  1: [
    { title: "청소 용품 구매", desc: "락스, 빨래비누 주문" },
    { title: "공과금 내기", desc: "7월 전기세 !!!!!!!!" },
    { title: "빨래하기", desc: "검은색 옷 빨래하는 날" },
  ],
  2: [{ title: "장보기", desc: "과일/우유" }],
  3: [],
  4: [{ title: "운동하기", desc: "하체 루틴" }],
  5: [{ title: "데이트", desc: "영화 보기" }],
  6: [{ title: "주간 회고", desc: "한 주 정리" }],
};

// MATE용 데이터 (보라)
type MateItem = StackItem & { status: MateStatus };
const MATE_DATA: Record<Day, MateItem[]> = {
  0: [{ title: "세탁기 청소", desc: "필터 교체", status: "inprogress" }],
  1: [
    { title: "욕실 청소", desc: "세면대/거울", status: "inprogress" },
    { title: "쓰레기 버리기", desc: "음쓰버리는 날", status: "done" },
  ],
  2: [{ title: "우편함 확인", desc: "청구서", status: "done" }],
  3: [],
  4: [{ title: "강아지 산책", desc: "저녁 7시", status: "inprogress" }],
  5: [{ title: "장보러 가기", desc: "계란/우유", status: "inprogress" }],
  6: [{ title: "공용구역 정리", desc: "거실/주방", status: "done" }],
};
// ─────────────────────────────────────────────────────────────

export default function TodayPuzzleComponent() {
  const [mode, setMode] = useState<Mode>("me"); // "me" | "mate"
  const [day, setDay] = useState<Day>(1);       // 기본: 월요일

  // 현재 모드/요일에 맞는 아이템
  const items = useMemo<StackItem[]>(() => {
    return mode === "me" ? (ME_DATA[day] ?? []) : (MATE_DATA[day] ?? []);
  }, [mode, day]);

  // MATE 모드일 때 우상단 배지
  const rightSlot = (index: number) => {
    if (mode !== "mate") return null;
    const list = MATE_DATA[day] ?? [];
    const status = list[index]?.status ?? "inprogress";
    return <StatusBadge status={status} />;
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      {/* 헤더: 타이틀 + 세그먼트 */}
      <View style={styles.headerRow }>
        <Text style={styles.headerTitle}>TODAY’s PUZZLE</Text>
        <SegmentedMM value={mode} onChange={setMode} />
      </View>

      {/* 요일 탭 */}
      <DayTab value={day} onChange={setDay} style={{ marginTop: 8, marginBottom: 8 }} />

      {/* 퍼즐 스택 */}
      <TodayPuzzleStack
        items={items}
        palette={mode === "me" ? "yellow" : "purple"} // 색 전환
        rightSlot={rightSlot}                         // (ME는 null)
        showPlus={mode === "me"}                      // ME만 + 버튼 표시
        onAdd={() => console.log("새 퍼즐 추가")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    //backgroundColor: "blue"
  },
  headerTitle: {
    fontSize: 18,
    color: "#111",
  },
});