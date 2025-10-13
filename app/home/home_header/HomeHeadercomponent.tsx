import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { router } from "expo-router";
import AlarmIcon from "@/assets/image/home/alarm_basic.svg";
import ChevronRight from "@/assets/image/adjustmenticon/arrow_right_Icon.svg";
import GradientAvatar from "@/components/GradientAvatar";

type Props = {
  style?: ViewStyle;
  profileImage?: string;
  profileLabel?: string;
  onPressProfile?: () => void;
  unreadCount?: number;
  onPressBell?: () => void;
};

export default function HomeHeadercomponent({
  style,
  profileImage,
  profileLabel = "내 계정",
  onPressProfile,
  unreadCount = 0,
  onPressBell,
}: Props) {
  const hasUnread = unreadCount > 0;

  // ✅ 내 계정 클릭 시 이동
  const handlePressProfile = () => {
    if (onPressProfile) return onPressProfile();
    router.push("/home/home_header/MyPage/MyPage");
  };

  // ✅ 알림 아이콘 클릭 시 이동
  const handlePressBell = () => {
    if (onPressBell) return onPressBell();
    router.push("/home/home_header/Alarm/NotificationListScreen");
  };

  return (
    <View style={[s.container, style]}>
      {/* 좌측: 프로필 */}
      <TouchableOpacity activeOpacity={0.85} style={s.profileBtn} onPress={handlePressProfile}>
        <GradientAvatar uri={profileImage} size={40} />
        <Text style={s.profileText}>{profileLabel}</Text>
        <ChevronRight width={14} height={14} />
      </TouchableOpacity>

      {/* 우측: 알림 */}
      <TouchableOpacity activeOpacity={0.85} style={s.bellWrap} onPress={handlePressBell}>
        <View style={s.bellCircle}>
          <AlarmIcon width={24} height={24} />
          {hasUnread && <View style={s.badgeDot} />}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginRight: 2,
  },
  bellWrap: {},
  bellCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
  },
});