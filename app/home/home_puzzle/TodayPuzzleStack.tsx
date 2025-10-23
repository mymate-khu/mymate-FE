// app/home_puzzle/TodayPuzzleStack.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, StyleSheet as RNStyleSheet } from "react-native";
import PuzzleCard from "./PuzzleCard";
import PlusIcon from "@/assets/image/homepage_puzzleimg/PlusYellow.svg";

const CARD_HEIGHT = 120;
const OVERLAP_OFFSET = 100;
const EXPAND_DELTA = 200;
const MAX_CARDS = 3;
const OPEN_TOP = 0;

// ✅ id 필드 추가
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
  // ✅ id를 넘겨 받도록 타입 변경
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

  const containerHeight =
    CARD_HEIGHT +
    Math.max(0, puzzles.length - 1) * OVERLAP_OFFSET +
    (openIndex !== null ? EXPAND_DELTA : 0);

  const anchorIndex = openIndex ?? puzzles.length - 1;
  const anchorIsOpen = openIndex === anchorIndex;
  const anchorBaseTop = anchorIndex * OVERLAP_OFFSET;
  const anchorTop = anchorIsOpen ? OPEN_TOP : anchorBaseTop;
  const anchorHeight = anchorIsOpen ? CARD_HEIGHT + EXPAND_DELTA : CARD_HEIGHT;

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
        const top = isOpen ? OPEN_TOP : baseTop;

        return (
          <View
            key={p.id} // ✅ id로 key
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
              // ✅ ME일 때만 액션 노출
              showActions={isOpen && !isMateMode}
              // ✅ id를 넘겨서 수정/삭제 호출
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
  container: { position: "relative", width: "100%", alignItems: "center", paddingTop: 20, overflow: "visible", marginTop: 16 },
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