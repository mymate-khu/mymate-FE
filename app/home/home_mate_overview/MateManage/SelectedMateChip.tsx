// app/home/home_mate_overview/MateManage/SelectedMateChip.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";
import { X } from "lucide-react-native"; // ✅ 추가 (Lucide 아이콘)

export type SelectedMateChipProps = {
  id: string;
  name: string;
  code?: string;
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
      <GradientAvatar uri={avatarUri} seed={code || name} size={40} />

      {/* 이름 */}
      <Text style={s.name} numberOfLines={1}>
        {name}
      </Text>

      {/* 아이디 */}
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
        <X size={12} color="#fff" strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginRight: 15,
    paddingRight: 4,
    alignItems: "center",
    width: 48,
    //backgroundColor: "yellow",
  },
  name: {
    marginTop: 5,
    fontSize: 13,
    color: "#111",
    textAlign: "center",
    fontWeight: "500",
  },
  code: {
    marginTop: 2,
    fontSize: 11,
    color: "#9A9A9A",
    textAlign: "center",
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 15,
    height: 15,
    borderRadius: 9,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});