import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import RuleCardAdd from "@/assets/image/rules/RuleCardAdd.svg";
import { Plus } from "lucide-react-native";

type Props = {
  onPress?: () => void;
};

export default function AddRuleCard({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={s.wrap} onPress={onPress}>
      {/* 배경 SVG */}
      <RuleCardAdd width="100%" height="100%" />

      {/* 중앙 + 아이콘 + 텍스트 */}
      <View style={s.centerContent}>
        <Plus size={24} color="#999999" />
        <Text style={s.label}>규칙 추가하기</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap: {
    width: 183,           // RuleCard와 동일한 크기
    height: 158,
    aspectRatio: 0.78,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "pink",  
  },
  centerContent: {
    position: "absolute",
    top: "35%",            // SVG 노치 피해서 약간 위로
    left: 0,
    right: 0,
    alignItems: "center",
    transform: [{ translateY: -12 }],
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: "#999999",
    fontWeight: "500",
  },
});