// app/home/home_mate_overview/MateManage/SearchResultItem.tsx
// 세로 결과 1행
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";

export type SearchResultItemState = "default" | "selected" | "disabled";

export type SearchResultItemProps = {
  id: string;
  name: string;
  code: string;
  avatarUri?: string;
  state?: SearchResultItemState;  // 기본 +, 선택됨 ✓, 비활성(이미 메이트/요청중)
  onToggle?: (id: string) => void;
};

export default function SearchResultItem({
  id,
  name,
  code,
  avatarUri,
  state = "default",
  onToggle,
}: SearchResultItemProps) {
  const disabled = state === "disabled";
  const isSelected = state === "selected";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={() => onToggle?.(id)}
      style={[s.row, disabled && { opacity: 0.5 }]}
    >
      <GradientAvatar uri={avatarUri} size={56} />

      <View style={s.center}>
        <Text style={s.name} numberOfLines={1}>{name}</Text>
        <Text style={s.code} numberOfLines={1}>{code}</Text>
      </View>

      <View style={[s.circle, isSelected ? s.circleSelected : s.circleDefault]}>
        <Text style={[s.circleText, isSelected && s.circleTextSelected]}>
          {isSelected ? "✓" : "+"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  center: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  code: { marginTop: 4, fontSize: 13, color: "#8E8E8E" },

  circle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  circleDefault: { backgroundColor: "#F3F3F3" },
  circleSelected: { backgroundColor: "#FFD51C" },
  circleText: { fontSize: 20, color: "#111", fontWeight: "700" },
  circleTextSelected: { color: "#111" },
});