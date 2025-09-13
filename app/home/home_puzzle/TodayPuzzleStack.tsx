import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import PuzzleCard from "./PuzzleCard";
import PlusIcon from "@/assets/image/homepage_puzzleimg/PlusYellow.svg";

const CARD_HEIGHT = 120;
const OVERLAP_OFFSET = 100;
const EXPAND_DELTA = 200;
const MAX_CARDS = 3;

export type StackItem = { title: string; desc?: string };

type Palette = "yellow" | "purple";

export default function TodayPuzzleStack({
  items,
  palette = "yellow",
  rightSlot,           // 우상단에 공통으로 넣을 슬롯 (index → ReactNode)
  showPlus = true,     // 하단 + 버튼 노출 여부
  onAdd,
}: {
  items: StackItem[];
  palette?: Palette;
  rightSlot?: (index: number) => React.ReactNode;
  showPlus?: boolean;
  onAdd?: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const puzzles = (items ?? []).slice(0, MAX_CARDS);
  if (puzzles.length === 0) return null;

  const tones: Array<"light"|"medium"|"dark"> = ["light","medium","dark"];
  const containerHeight =
    CARD_HEIGHT + Math.max(0, puzzles.length - 1) * OVERLAP_OFFSET +
    (openIndex !== null ? EXPAND_DELTA : 0);

  // 플러스 버튼 위치 (마지막 카드에 붙임)
  const lastIndex = puzzles.length - 1;
  const lastIsOpen = openIndex === lastIndex;
  const lastTop = lastIndex * OVERLAP_OFFSET;
  const lastHeight = lastIsOpen ? CARD_HEIGHT + EXPAND_DELTA : CARD_HEIGHT;

  const FAB_SIZE = 52;
  const fabTop = lastTop + lastHeight - FAB_SIZE / 2;

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {puzzles.map((p, i) => {
        const isOpen = openIndex === i;
        return (
          <View
            key={`${p.title}-${i}`}
            style={[
              styles.cardWrap,
              { top: i * OVERLAP_OFFSET, /*zIndex: isOpen ? 999 : 10 - i,*/ elevation: isOpen ? 12 : 0 },
            ]}
          >
            <PuzzleCard
              title={p.title}
              description={p.desc}
              palette={palette}                     // ⬅️ 노랑/보라 전환
              tone={tones[i]}
              size={isOpen ? "large" : "small"}
              chevron={isOpen ? "down" : "up"}
              showActions={isOpen}
              checked={false}
              onToggle={() => {}}
              rightSlot={rightSlot?.(i)}            // ⬅️ 슬롯 전달 (있으면 토글 대신 표시)
              onPress={() => setOpenIndex(isOpen ? null : i)}
            />
          </View>
        );
      })}

      {showPlus && (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
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
    alignItems: "center", 
    paddingTop: 20, 
    overflow: "visible",
    marginTop: 16,
    //backgroundColor: "red" 
  },
  cardWrap: { 
    position: "absolute", 
    width: "100%", 
    alignItems: "center" 
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
    elevation: 12,
    zIndex: 1000,
  },
});