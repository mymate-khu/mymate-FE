import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, StyleSheet as RNStyleSheet } from "react-native";
import PuzzleCard from "./PuzzleCard";
import PlusIcon from "@/assets/image/homepage_puzzleimg/PlusYellow.svg";

const CARD_HEIGHT = 120;
const OVERLAP_OFFSET = 100;
const EXPAND_DELTA = 200;   // large(320) - small(120)
const MAX_CARDS = 3;
const OPEN_TOP = 0;

export type StackItem = { title: string; desc?: string };
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
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}) {
  const puzzles = useMemo(() => (items ?? []).slice(0, MAX_CARDS), [items]);

  // 카드 열림 상태
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 체크 토글 상태(카드별)
  const [checked, setChecked] = useState<boolean[]>(() => puzzles.map(() => false));
  useEffect(() => {
    setChecked(prev => puzzles.map((_, i) => prev[i] ?? false));
    setOpenIndex(idx => (idx !== null && idx >= puzzles.length ? null : idx));
  }, [puzzles.length]);

  const tones: Array<"light" | "medium" | "dark"> = ["light", "medium", "dark"];

  // 펼치면 퍼즐 박스 높이를 200 늘림
  const containerHeight =
    CARD_HEIGHT + Math.max(0, puzzles.length - 1) * OVERLAP_OFFSET +
    (openIndex !== null ? EXPAND_DELTA : 0);

  // --- FAB 기준: 열린 카드가 있으면 그 카드, 없으면 마지막 카드 ---
  const anchorIndex = openIndex ?? (puzzles.length - 1);
  const anchorIsOpen = openIndex === anchorIndex;
  const anchorBaseTop = anchorIndex * OVERLAP_OFFSET;
  const anchorTop = anchorIsOpen ? OPEN_TOP : anchorBaseTop;
  const anchorHeight = anchorIsOpen ? CARD_HEIGHT + EXPAND_DELTA : CARD_HEIGHT;

  // FAB 위치: 기준 카드 하단 중앙에 살짝 걸치도록
  const FAB_SIZE = 52;
  const fabTop = anchorTop + anchorHeight - FAB_SIZE / 2;

  // FAB은 항상 카드보다 위 레이어
  const fabZIndex = 2000;
  const fabElevation = 24;

  // 팔레트로 모드 판정: 보라면 MATE, 노랑이면 ME
  const isMateMode = palette === "purple";

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {puzzles.map((p, i) => {
        const isOpen = openIndex === i;
        const baseTop = i * OVERLAP_OFFSET;
        const top = isOpen ? OPEN_TOP : baseTop;

        return (
          <View
            key={`${p.title}-${i}`}
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

              /* ME(노랑)일 때만 수정/삭제 노출 */
              showActions={isOpen && !isMateMode}
              onEdit={isOpen && !isMateMode ? () => onEdit?.(i) : undefined}
              onDelete={isOpen && !isMateMode ? () => onDelete?.(i) : undefined}

              /* 체크 토글은 ME만 사용하고 싶으면 아래처럼 !isMateMode로 가드 */
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
  cardWrap: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
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