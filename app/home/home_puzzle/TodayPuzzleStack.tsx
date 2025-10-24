import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, StyleSheet as RNStyleSheet } from "react-native";
import PuzzleCard from "./PuzzleCard";
import PlusIcon from "@/assets/image/homepage_puzzleimg/PlusYellow.svg";

const CARD_HEIGHT = 120;
const OVERLAP_OFFSET = 100;

const DELTA = {
  small: 0,
  medium: 100,
  large: 200,
} as const;

const MAX_CARDS = 3;
const EXTRA_PAD = 40;

export type StackItem = { id: number; title: string; desc?: string };
type Palette = "yellow" | "purple" | "gray";
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

  // ✅ 퍼즐 0개인 경우: 빈 상태 뷰 반환
  if (puzzles.length === 0) {
    const FAB_SIZE = 52;
    const containerHeight = CARD_HEIGHT + EXTRA_PAD;
    const fabTop = CARD_HEIGHT - FAB_SIZE / 2;

    return (
      <View style={[styles.container, { height: containerHeight }]}>
        <View style={[styles.cardWrap, { top: 0, zIndex: 1 }]}>
          <PuzzleCard
            variant="empty"
            palette="gray"
            tone="medium"
            size="small"
            chevron="up"
            title="아직 퍼즐이 없어요."
            emptySubtitle="하단 버튼으로 퍼즐을 만들어 보세요."
            onPress={onAdd}
          />
        </View>

        {showPlus && (
          <View
            pointerEvents="box-none"
            style={[RNStyleSheet.absoluteFill, { zIndex: 2000, elevation: 24 }]}
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

  // ===== 여기부터 기존(퍼즐 1~3개) 로직 =====

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean[]>(() => puzzles.map(() => false));

  useEffect(() => {
    setChecked((prev) => puzzles.map((_, i) => prev[i] ?? false));
    setOpenIndex((idx) => (idx !== null && idx >= puzzles.length ? null : idx));
  }, [puzzles.length]);

  const tones: Array<"light" | "medium" | "dark"> = ["light", "medium", "dark"];

  const openSize: Size = puzzles.length >= 3 ? "large" : puzzles.length === 2 ? "medium" : "small";
  const pullUp = DELTA[openSize];

  const containerHeight =
    CARD_HEIGHT + Math.max(0, puzzles.length - 1) * OVERLAP_OFFSET + EXTRA_PAD;

  const anchorIndex = openIndex ?? puzzles.length - 1;
  const anchorBaseTop = Math.max(0, anchorIndex * OVERLAP_OFFSET);
  const anchorTop = openIndex === null ? anchorBaseTop : Math.max(0, anchorBaseTop - pullUp);
  const anchorHeight = openIndex === null ? CARD_HEIGHT : CARD_HEIGHT + DELTA[openSize];

  const FAB_SIZE = 52;
  const fabTop = anchorTop + anchorHeight - FAB_SIZE / 2;

  const isMateMode = palette === "purple";

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {puzzles.map((p, i) => {
        const isOpen = openIndex === i;
        const baseTop = i * OVERLAP_OFFSET;
        const top = isOpen ? Math.max(0, baseTop - pullUp) : baseTop;
        const sizeForCard: Size = isOpen ? openSize : "small";

        return (
          <View
            key={p.id}
            style={[styles.cardWrap, { top, zIndex: isOpen ? 999 : i, elevation: isOpen ? 12 : 0 }]}
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
                      setChecked((prev) => {
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
        <View pointerEvents="box-none" style={[RNStyleSheet.absoluteFill, { zIndex: 2000, elevation: 24 }]}>
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