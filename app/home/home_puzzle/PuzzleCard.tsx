import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import PuzzleBox from "./PuzzleBox"; // ← 기존 그대로 사용(노랑/보라/chevron 지원)

import CheckOnIcon from "@/assets/image/homepage_puzzleimg/PuzzleCheckOn.svg";
import CheckOffIcon from "@/assets/image/homepage_puzzleimg/PuzzleCheckOff.svg";

type Tone = "light" | "medium" | "dark";
type Palette = "yellow" | "purple";
type Size = "small" | "medium" | "large";
type Chevron = "up" | "down";

interface PuzzleCardProps {
  title: string;
  description?: string;

  // 색상 6종
  palette?: Palette;
  tone?: Tone;

  // 레이아웃
  size?: Size;
  style?: StyleProp<ViewStyle>;

  // 카드 전체 터치(옵션)
  onPress?: () => void;

  // 쉐브론 방향
  chevron?: Chevron;

  // 우하단 액션(옵션)
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;

  // ✓ 토글 (ME 모드에서 사용)
  checked?: boolean;
  onToggle?: () => void;

  // ✅ 우상단 커스텀 슬롯 (있으면 토글 대신 표시 / MATE용)
  rightSlot?: React.ReactNode;
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
}: PuzzleCardProps) {
  return (
    <PuzzleBox
      palette={palette}
      tone={tone}
      size={size}
      chevron={chevron}
      style={style}
      onPress={onPress}
      showActions={showActions}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <View style={styles.content}>
        {/* 텍스트 */}
        <View style={{ paddingRight: 56 }}>
          <Text style={styles.title}>{title}</Text>
          {!!description && <Text style={styles.desc}>{description}</Text>}
        </View>

        {/* 우상단 UI: 슬롯 > 토글 순서로 표시 */}
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
      </View>
    </PuzzleBox>
  );
}



const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    //justifyContent: "center",
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