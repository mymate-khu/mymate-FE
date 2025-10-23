// app/home_puzzle/TodayPuzzleStack.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, StyleSheet as RNStyleSheet } from "react-native";
import PuzzleCard from "./PuzzleCard";
import PlusIcon from "@/assets/image/homepage_puzzleimg/PlusYellow.svg";

const CARD_HEIGHT = 120;
const OVERLAP_OFFSET = 100;

// 사이즈별 확장량(작게/중간/크게로 펼쳤을 때 추가되는 높이)
// medium = +100, large = +200 은 예시값이며 PuzzleBox의 높이와 맞춰 사용하세요.
const DELTA = {
  small: 0,
  medium: 100,
  large: 200,
} as const;

const MAX_CARDS = 3;
const EXTRA_PAD = 40; // 하단 여유 (플로팅 버튼 그림자 등)

export type StackItem = { id: number; title: string; desc?: string };
type Palette = "yellow" | "purple";
type Size = "small" | "medium" | "large";

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

  // 퍼즐 개수에 따라 "열렸을 때" 사이즈 결정
  const openSize: Size =
    puzzles.length >= 3 ? "large" : puzzles.length === 2 ? "medium" : "small";
  const pullUp = DELTA[openSize]; // 펼칠 때 위로 당기는 양

  // 컨테이너는 고정 높이 (펼쳐도 레이아웃 안 흔들리게)
  const containerHeight =
    CARD_HEIGHT + Math.max(0, puzzles.length - 1) * OVERLAP_OFFSET + EXTRA_PAD;

  // FAB 위치 계산 (열린 카드 기준)
  const anchorIndex = openIndex ?? puzzles.length - 1;
  const anchorBaseTop = Math.max(0, anchorIndex * OVERLAP_OFFSET);
  const anchorTop = openIndex === null ? anchorBaseTop : Math.max(0, anchorBaseTop - pullUp);
  const anchorHeight =
    openIndex === null ? CARD_HEIGHT : CARD_HEIGHT + DELTA[openSize];

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
        const top = isOpen ? Math.max(0, baseTop - pullUp) : baseTop;

        // 닫힌 카드는 small, 열린 카드는 openSize 로 렌더
        const sizeForCard: Size = isOpen ? openSize : "small";

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
              size={sizeForCard}
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
    paddingTop: 20,
    overflow: "visible",
    marginTop: 16,
  },
  cardWrap: {
    position: "absolute",
    width: "100%",
  },
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