// TodayDualPuzzles.tsx
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import SegmentedMM from "./SegmentedMM";
import DayTab from "./DayTab";
import TodayPuzzleStack, { StackItem } from "./TodayPuzzleStack";
import StatusBadge from "./StatusBadge";

type Mode = "me" | "mate";
type Day = 0|1|2|3|4|5|6;

// 데모 데이터
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

type MateItem = StackItem & { status: "inprogress" | "done" };
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

export default function TodayDualPuzzles() {
  const [mode, setMode] = useState<Mode>("me");
  const [day, setDay] = useState<Day>(1);

  const items = useMemo<StackItem[]>(() => {
    return mode === "me" ? (ME_DATA[day] ?? []) : (MATE_DATA[day] ?? []);
  }, [mode, day]);

  // mate일 때 우상단 배지 렌더
  const rightSlot = (i: number) => {
    if (mode !== "mate") return null;
    const list = MATE_DATA[day] ?? [];
    const status = list[i]?.status ?? "inprogress";
    return <StatusBadge status={status} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <SegmentedMM value={mode} onChange={setMode} />
      <DayTab value={day} onChange={setDay} style={{ marginBottom: 8 }} />

      <TodayPuzzleStack
        items={items}
        palette={mode === "me" ? "yellow" : "purple"}
        rightSlot={rightSlot}
        showPlus={mode === "me"}                 // mate 모드에서는 + 숨김
        onAdd={() => console.log("새 퍼즐 추가")}
      />
    </View>
  );
}