import React from "react";
import { View, Pressable, StyleSheet, StyleProp, ViewStyle, Text, TouchableOpacity } from "react-native";

import ChevronUpIcon from "@/assets/image/homepage_puzzleimg/chevron-up.svg";
import ChevronDownIcon from "@/assets/image/homepage_puzzleimg/chevron-down.svg";

type Tone = "light" | "medium" | "dark";
type Palette = "yellow" | "purple";
type Size = "small" | "medium" | "large";
type Chevron = "up" | "down";

interface PuzzleBoxProps {
  palette?: Palette;
  tone?: Tone;
  size?: Size;
  chevron?: Chevron;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;

  // 수정하기 | 삭제하기
  showActions?: boolean;  // 기본 false
  onEdit?: () => void;
  onDelete?: () => void;
}

// 고정값
const BOX_WIDTH = 386;
const RADIUS = 16;
const NUB_SIZE = 52;
const NUB_OFFSET = 16;

const BG_MAP: Record<Palette, Record<Tone, string>> = {
  yellow: { light: "#FFFCC2", medium: "#FFF385", dark: "#FFE600" },
  purple: { light: "#EBD9FF", medium: "#D3A9FF", dark: "#C188FF" },
};

const HEIGHT_MAP: Record<Size, number> = { small: 120, medium: 220, large: 320 };

export default function PuzzleBox({
  palette = "yellow",
  tone = "light",
  size = "small",
  chevron = "up",
  onPress,
  style,
  children,
  showActions = false,
  onEdit,
  onDelete,
}: PuzzleBoxProps) {
  const bg = BG_MAP[palette][tone];
  const height = HEIGHT_MAP[size];
  const ChevronIcon = chevron === "up" ? ChevronUpIcon : ChevronDownIcon;

  // 보여줄지 최종 판단
  const actionsVisible = showActions && (!!onEdit || !!onDelete);

  const Card = (
    <View style={[styles.card, { backgroundColor: bg, width: "100%", height, borderRadius: RADIUS, }, style]}>
      {/* 위쪽 돌기 + 아이콘 */}
      <View style={[styles.nubWrap, { top: -NUB_OFFSET }]}>
        <View style={[styles.nub, { width: NUB_SIZE, height: NUB_SIZE, borderRadius: NUB_SIZE / 2, backgroundColor: bg }]}>
          <ChevronIcon width={24} height={24} style={{ marginBottom: 10 }} />
        </View>
      </View>

      {/* 내용 */}
      <View style={[styles.inner, actionsVisible && styles.innerWithActions]}>
        {children}
      </View>

      {/* 수정하기 | 삭제하기 */}
      {actionsVisible && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              onPress={(e) => { e?.stopPropagation?.(); onEdit(); }} // 전파 방지
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionText}>수정하기</Text>
            </TouchableOpacity>
          )}
          {onEdit && onDelete && <Text style={styles.divider}> | </Text>}
          {onDelete && (
            <TouchableOpacity
              onPress={(e) => { e?.stopPropagation?.(); onDelete(); }} // 전파 방지
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionText}>삭제하기</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      {Card}
    </Pressable>
  ) : (
    Card
  );
}



const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "visible",
    shadowColor: "#000",
    shadowOpacity: 0.1 ,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 3,
  },
  inner: {
    flex: 1,
    //paddingHorizontal: 16,
    //paddingVertical: 16,
    justifyContent: "center",
  },
  innerWithActions: {
    paddingBottom: 48,
  },
  nubWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  nub: {
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    position: "absolute",
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
    elevation: 10,
  },
  actionText: {
    fontSize: 12,
    color: "#111",
    fontWeight: "600",
  },
  divider: {
    fontSize: 14,
    color: "#111",
    opacity: 0.6,
    marginHorizontal: 5,
  },
});