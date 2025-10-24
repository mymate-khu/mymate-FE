import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { router } from "expo-router";
import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";

type Props = {
  title?: string;                 // 기본 타이틀
  onBack?: () => void;            // 기본: router.back()
  color?: string;                 // 타이틀/아이콘 색 (기본 #111)
  backgroundColor?: string;       // 배경색 (기본 'transparent'로 둬도 됨)
  height?: number;                // 바 높이 (기본 56)
  style?: ViewStyle;              // 컨테이너 추가 스타일

  // 커스터마이즈 슬롯
  centerSlot?: React.ReactNode;   // 센터 영역 전체를 대체 (드롭다운 버튼 등)
  rightSlot?: React.ReactNode;    // 오른쪽 영역 (검색 아이콘 등)
};

export default function BackHeader({
  title,
  onBack,
  color = "#111",
  backgroundColor = "transparent",
  height = 56,
  style,
  centerSlot,
  rightSlot,
}: Props) {
  const onPressBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      // 뒤로 갈 화면이 없으면 홈으로 이동
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor }}>
      <View style={[s.row, { height, backgroundColor }, style]}>
        {/* Left: Back */}
        <TouchableOpacity
          onPress={onPressBack}
          activeOpacity={0.7}
          style={s.left}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeftIcon width={15} height={15} />
        </TouchableOpacity>

        {/* Center */}
        <View style={s.center}>
          {centerSlot ? (
            centerSlot
          ) : !!title ? (
            <Text style={[s.title, { color }]} numberOfLines={1}>{title}</Text>
          ) : null}
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
    paddingHorizontal: 25,
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
    fontSize: 16,
    fontWeight: "600",
  },
  right: {
    width: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});