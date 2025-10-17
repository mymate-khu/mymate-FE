import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";
import TrashIcon from "@/assets/image/home/trash.svg";
import CloseIcon from "@/assets/image/home/close.svg";

type Props = {
  name: string;
  code: string;
  photo?: string;
  mode?: "pending" | "active"; // 대기 중 | 현재 메이트
  onPressAction?: () => void;
};

export default function MateListItem({
  name,
  code,
  photo,
  mode = "active",
  onPressAction,
}: Props) {
  const ActionIcon = mode === "pending" ? CloseIcon : TrashIcon;

  return (
    <View style={s.container}>
      {/* 프로필 */}
      <View style={s.left}>
        <GradientAvatar uri={photo} size={48} />
        <View style={s.textBox}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.code}>{code}</Text>
        </View>
      </View>

      {/* 오른쪽 아이콘 */}
      <TouchableOpacity
        onPress={onPressAction}
        style={s.iconWrap}
        activeOpacity={0.8}
      >
        <ActionIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: "5%",
    //backgroundColor: "lightgreen", 
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  textBox: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  code: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
});