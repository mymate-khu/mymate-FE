// components/BackHeader.tsx
import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { router } from "expo-router";
import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";

type Props = {
  title?: string;
  /** 기본: router.back() */
  onBack?: () => void;
  /** 배경색 (기본 흰색) */
  backgroundColor?: string;
  /** 타이틀/아이콘 색 (기본 #111) */
  color?: string;
  /** 중앙 정렬 여부 (기본 true) */
  centerTitle?: boolean;
  /** 오른쪽 영역 커스텀 슬롯 */
  rightSlot?: React.ReactNode;
  /** 바닥 헤어라인 표시 */
  showDivider?: boolean;
  /** 컨테이너 추가 스타일 */
  style?: ViewStyle;
  /** 높이 (기본 56) */
  height?: number;
  /** 살짝 그림자 줄지 여부 */
  shadow?: boolean;
};

export default function BackHeader({
  title,
  onBack,
  backgroundColor = "#FFFFFF",
  color = "#111",
  centerTitle = true,
  rightSlot,
  showDivider = false,
  style,
  height = 56,
  shadow = false,
}: Props) {
  const onPressBack = () => (onBack ? onBack() : router.back());

  return (
    <SafeAreaView style={[{ backgroundColor }]}>
      <View
        style={[
          s.row,
          { height, backgroundColor },
          shadow && s.shadow,
          showDivider && s.divider,
          style,
        ]}
      >
        {/* Left: Back */}
        <TouchableOpacity
          onPress={onPressBack}
          activeOpacity={0.7}
          style={s.left}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeftIcon width={20} height={20} />
        </TouchableOpacity>

        {/* Title */}
        <View style={[s.center, !centerTitle && { alignItems: "flex-start" }]}>
          {!!title && <Text style={[s.title, { color }]} numberOfLines={1}>{title}</Text>}
        </View>

        {/* Right */}
        <View style={s.right}>{rightSlot}</View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  left: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  right: {
    width: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
});