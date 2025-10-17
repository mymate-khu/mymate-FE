import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type Props = {
  title: string;               // 섹션 제목
  style?: ViewStyle;           // 전체 컨테이너 커스터마이즈
  titleStyle?: TextStyle;      // 제목 텍스트 커스터마이즈
  lineColor?: string;          // 구분선 색상 (기본 #f3f3f3)
};

export default function SectionHeader({
  title,
  style,
  titleStyle,
  lineColor = "#f3f3f3",
}: Props) {
  return (
    <View style={[s.container, style]}>
      <Text style={[s.title, titleStyle]}>{title}</Text>
      <View style={[s.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: "5%",
    paddingTop: 8,
    paddingBottom: 4,
    //backgroundColor: "pink",
    marginTop: 16
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: "#797979",
    marginBottom: 6,
  },
  line: {
    height: 1.5,
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 1,
  },
});