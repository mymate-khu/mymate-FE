// app/home_puzzle/TodayPuzzleStack.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, StyleSheet as RNStyleSheet } from "react-native";
import PuzzleCard from "./PuzzleCard";
import PlusIcon from "@/assets/image/homepage_puzzleimg/PlusYellow.svg";

const CARD_HEIGHT = 120;
const OVERLAP_OFFSET = 100;
const EXPAND_DELTA = 200;      // 펼쳤을 때 카드 높이 증가분
const MAX_CARDS = 3;

// 펼칠 때 컨테이너는 그대로 두고, 카드만 위로 당겨서 겹치게 보정
const PULL_UP = EXPAND_DELTA;  // 위로 끌어올릴 픽셀
const EXTRA_PAD = 40;          // 스택 하단 여유(플로팅 버튼/그림자 여백)

export type StackItem = { id: number; title: string; desc?: string };
type Palette = "yellow" | "purple";

export default function TodayPuzzleStack({
  items,
  palette = "yellow",
  rightSlot,
  showPlus = true,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: StackItem[];
  palette?: Palette;
  rightSlot?: (index: number) => React.ReactNode;
  showPlus?: boolean;
  onAdd?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) {
  const puzzles = useMemo(() => (items ?? []).slice(0, MAX_CARDS), [items]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean[]>(() => puzzles.map(() => false));

  useEffect(() => {
    setChecked(prev => puzzles.map((_, i) => prev[i] ?? false));
    setOpenIndex(idx => (idx !== null && idx >= puzzles.length ? null : idx));
  }, [puzzles.length]);

  const tones: Array<"light" | "medium" | "dark"> = ["light", "medium", "dark"];

  // ✅ 컨테이너 높이는 '고정' (펼쳐도 전체 레이아웃이 늘어나지 않게)
  const containerHeight =
    CARD_HEIGHT + Math.max(0, puzzles.length - 1) * OVERLAP_OFFSET + EXTRA_PAD;

  // 플로팅 버튼 위치 계산(앵커 카드 기준)
  const anchorIndex = openIndex ?? puzzles.length - 1;
  const anchorBaseTop = Math.max(0, anchorIndex * OVERLAP_OFFSET);
  const anchorTop =
    openIndex === null ? anchorBaseTop : Math.max(0, anchorBaseTop - PULL_UP);
  const anchorHeight = openIndex === null ? CARD_HEIGHT : CARD_HEIGHT + EXPAND_DELTA;

  const FAB_SIZE = 52;
  const fabTop = anchorTop + anchorHeight - FAB_SIZE / 2;

  const fabZIndex = 2000;
  const fabElevation = 24;

  const isMateMode = palette === "purple";

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {puzzles.map((p, i) => {
        const isOpen = openIndex === i;
        const baseTop = i * OVERLAP_OFFSET;
        // ✅ 펼치면 해당 카드만 위로 당겨서(겹치게) 키워 보이도록
        const top = isOpen ? Math.max(0, baseTop - PULL_UP) : baseTop;

        return (
          <View
            key={p.id}
            style={[
              styles.cardWrap,
              { top, zIndex: isOpen ? 999 : i, elevation: isOpen ? 12 : 0 },
            ]}
          >
            <PuzzleCard
              title={p.title}
              description={p.desc}
              palette={palette}
              tone={tones[i]}
              size={isOpen ? "large" : "small"}
              chevron={isOpen ? "down" : "up"}
              showActions={isOpen && !isMateMode}
              onEdit={isOpen && !isMateMode ? () => onEdit?.(p.id) : undefined}
              onDelete={isOpen && !isMateMode ? () => onDelete?.(p.id) : undefined}
              checked={!isMateMode ? checked[i] : undefined}
              onToggle={
                !isMateMode
                  ? () =>
                      setChecked(prev => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      })
                  : undefined
              }
              rightSlot={rightSlot?.(i)}
              onPress={() => setOpenIndex(isOpen ? null : i)}
            />
          </View>
        );
      })}

      {showPlus && (
        <View
          pointerEvents="box-none"
          style={[RNStyleSheet.absoluteFill, { zIndex: fabZIndex, elevation: fabElevation }]}
        >
          <Pressable
            onPress={onAdd ?? (() => {})}
            style={({ pressed }) => [
              styles.fab,
              {
                top: fabTop,
                width: FAB_SIZE,
                height: FAB_SIZE,
                borderRadius: FAB_SIZE / 2,
                opacity: pressed ? 0.9 : 1,
                transform: [{ translateX: -FAB_SIZE / 2 }],
                zIndex: fabZIndex,
                elevation: fabElevation,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="추가"
          >
            <PlusIcon width={28} height={28} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    overflow: "visible",
    marginTop: 16,
  },
  cardWrap: { position: "absolute", width: "100%", alignItems: "center" },
  fab: {
    position: "absolute",
    left: "50%",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
});