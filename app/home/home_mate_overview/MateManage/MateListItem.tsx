import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";
import TrashIcon from "@/assets/image/home/trash.svg";
import CloseIcon from "@/assets/image/home/close.svg";

type Props = {
  name: string;
  code: string;
  photo?: string;
  mode?: "pending" | "active" | "invitation"; // 대기 중 | 현재 메이트 | 받은 초대
  onPressAction?: () => void;
  onPressSecondary?: () => void; // 초대 거절용
  isProcessing?: boolean; // 처리 중 상태
};

export default function MateListItem({
  name,
  code,
  photo,
  mode = "active",
  onPressAction,
  onPressSecondary,
  isProcessing = false,
}: Props) {
  const ActionIcon = mode === "pending" ? CloseIcon : TrashIcon;

  // 초대 모드일 때는 수락/거절 버튼 두 개 표시
  if (mode === "invitation") {
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

        {/* 수락/거절 버튼 */}
        <View style={s.buttonGroup}>
          <TouchableOpacity
            onPress={onPressAction}
            style={[s.acceptButton, isProcessing && s.disabledButton]}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={s.acceptButtonText}>수락</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onPressSecondary}
            style={[s.rejectButton, isProcessing && s.disabledButton]}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <Text style={s.rejectButtonText}>거절</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        style={[s.iconWrap, isProcessing && s.disabledButton]}
        activeOpacity={0.8}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <ActionIcon width={24} height={24} />
        )}
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
  
  // 초대 모드용 스타일
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  rejectButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
});