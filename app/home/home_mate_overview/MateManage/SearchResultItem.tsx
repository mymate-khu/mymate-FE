// app/home/home_mate_overview/MateManage/SearchResultItem.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";

// ✅ SVG 아이콘 import (경로는 실제 아이콘 위치에 맞춰 조정)
import CheckIcon from "@/assets/image/home/check.svg";
import PlusIcon from "@/assets/image/home/plus.svg";

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
      {/* 아바타 */}
      <GradientAvatar uri={avatarUri} size={40} />

      {/* 이름 + 코드 */}
      <View style={s.center}>
        <Text style={s.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={s.code} numberOfLines={1}>
          {code}
        </Text>
      </View>

      {/* 우측 아이콘 영역 */}
      <View
        style={[
          s.circle,
          isSelected ? s.circleSelected : s.circleDefault,
        ]}
      >
        {isSelected ? (
          <CheckIcon width={24} height={24} />
        ) : (
          <PlusIcon width={24} height={24} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    paddingHorizontal: "5%",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "lightblue",
  },
  center: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "500", color: "#111" },
  code: { marginTop: 4, fontSize: 10, color: "#797979" },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  circleDefault: { backgroundColor: "#F0F0F0" },
  circleSelected: { backgroundColor: "#FFE600" },
});