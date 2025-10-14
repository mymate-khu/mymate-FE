// app/home/home_mate_overview/MateManage/SelectedMateChip.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";

export type SelectedMateChipProps = {
  id: string;
  name: string;
  code?: string; // ✅ 아이디 추가
  avatarUri?: string;
  onRemove?: (id: string) => void;
};

export default function SelectedMateChip({
  id,
  name,
  code,
  avatarUri,
  onRemove,
}: SelectedMateChipProps) {
  return (
    <View style={s.wrap}>
      <GradientAvatar uri={avatarUri} size={56} />

      {/* 이름 */}
      <Text style={s.name} numberOfLines={1}>
        {name}
      </Text>

      {/* ✅ 아이디 추가 */}
      {!!code && (
        <Text style={s.code} numberOfLines={1}>
          {code}
        </Text>
      )}

      {/* 삭제 버튼 */}
      <TouchableOpacity
        style={s.close}
        onPress={() => onRemove?.(id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={s.closeText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginRight: 12,
    alignItems: "center",
    width: 86,
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    color: "#111",
    textAlign: "center",
    fontWeight: "600",
  },
  // ✅ 아이디(코드) 스타일
  code: {
    marginTop: 2,
    fontSize: 11,
    color: "#9A9A9A",
    textAlign: "center",
  },
  close: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: "#fff", fontSize: 12, lineHeight: 12, fontWeight: "700" },
});