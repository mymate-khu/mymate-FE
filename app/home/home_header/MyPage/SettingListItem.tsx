import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ChevronRight from "@/assets/image/adjustmenticon/arrow_right_Icon.svg";

type Props = {
  title: string;                      // 예: "회원 정보 수정"
  leftIcon?: React.ReactNode;         // 예: <UserIcon width={20} height={20} />
  onPress?: () => void;               // 클릭 이벤트
};

export default function SettingListItem({ title, leftIcon, onPress }: Props) {
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={onPress}>
      {/* 왼쪽 아이콘 */}
      {leftIcon ? <View style={s.leftIcon}>{leftIcon}</View> : <View style={s.leftIcon} />}

      {/* 중앙 텍스트 */}
      <Text style={s.title}>{title}</Text>

      {/* 오른쪽 화살표 */}
      <ChevronRight width={16} height={16} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    height: 52,
    //backgroundColor: "lightgreen",
  },
  leftIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
});