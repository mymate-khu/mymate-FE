import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import PuzzleBox from "./PuzzleBox";

import CheckOnIcon from "@/assets/image/homepage_puzzleimg/PuzzleCheckOn.svg";
import CheckOffIcon from "@/assets/image/homepage_puzzleimg/PuzzleCheckOff.svg";

type Tone = "light" | "medium" | "dark";
type Palette = "yellow" | "purple" | "gray"; // ✅ 회색 팔레트 추가
type Size = "small" | "medium" | "large";
type Chevron = "up" | "down";

interface PuzzleCardProps {
  title: string;
  description?: string;

  palette?: Palette;
  tone?: Tone;

  size?: Size;
  style?: StyleProp<ViewStyle>;

  onPress?: () => void;
  chevron?: Chevron;

  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;

  checked?: boolean;
  onToggle?: () => void;

  rightSlot?: React.ReactNode;

  // ✅ 빈 상태(퍼즐 0개)용
  variant?: "normal" | "empty";
  emptySubtitle?: string;
}

export default function PuzzleCard({
  title,
  description,
  palette = "yellow",
  tone = "medium",
  size = "small",
  style,
  onPress,
  chevron = "up",
  showActions = false,
  onEdit,
  onDelete,
  checked = false,
  onToggle,
  rightSlot,
  variant = "normal",
  emptySubtitle,
}: PuzzleCardProps) {
  const isEmpty = variant === "empty";
  const finalPalette = isEmpty ? "gray" : palette;
  const finalSize = isEmpty ? "small" : size;

  return (
    <PuzzleBox
      palette={finalPalette}
      tone={tone}
      size={finalSize}
      chevron={chevron}
      style={style}
      onPress={onPress}
      showActions={isEmpty ? false : showActions}
      onEdit={isEmpty ? undefined : onEdit}
      onDelete={isEmpty ? undefined : onDelete}
    >
      <View style={[styles.content, isEmpty && styles.emptyContent]}>
        {isEmpty ? (
          // ✅ 빈 상태 전용 콘텐츠
          <View style={styles.emptyInner}>
            <Text style={styles.emptyTitle}>{title}</Text>
            {!!emptySubtitle && <Text style={styles.emptySub}>{emptySubtitle}</Text>}
          </View>
        ) : (
          <>
            {/* 일반 카드 텍스트 */}
            <View style={{ paddingRight: 56 }}>
              <Text style={styles.title}>{title}</Text>
              {!!description && <Text style={styles.desc}>{description}</Text>}
            </View>

            {/* 우상단 슬롯/토글 */}
            {rightSlot ? (
              <View style={styles.rightSlotWrap}>{rightSlot}</View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={(e) => {
                  e?.stopPropagation?.();
                  onToggle?.();
                }}
                style={styles.toggleBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {checked ? <CheckOnIcon width={40} height={40} /> : <CheckOffIcon width={40} height={40} />}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </PuzzleBox>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyInner: {
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  emptySub: {
    fontSize: 16,
    color: "#9A9A9A",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: "#5A5A5A",
  },
  toggleBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 100,
    elevation: 10,
  },
  rightSlotWrap: { position: "absolute", top: 14, right: 14, zIndex: 100, elevation: 10 },
});