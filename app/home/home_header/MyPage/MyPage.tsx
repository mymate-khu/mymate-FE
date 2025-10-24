// app/home/home_header/MyPage/MyPage.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

import BackHeader from "@/components/BackHeader";
import GradientAvatar from "@/components/GradientAvatar";
import SettingListItem from "./SettingListItem";

// 아이콘
import UserIcon from "@/assets/image/mypage/user.svg";
import LockIcon from "@/assets/image/mypage/lock.svg";
import BellIcon from "@/assets/image/mypage/Bell.svg";
import FlagIcon from "@/assets/image/mypage/Flag.svg";
import ChatIcon from "@/assets/image/mypage/chat.svg";
import LogoutIcon from "@/assets/image/mypage/logout.svg";
import EditIcon from "@/assets/image/mypage/edit.svg";

// 프로필 훅 / 스토리지
import { useMyProfile } from "@/hooks/useMyProfile";
import { storage } from "@/components/apis/storage";

export default function MyPage() {
  const { me, loading, error } = useMyProfile();

  // 이름: 닉네임 > 실명 > 기본값
  const displayName = loading ? "..." : (me?.nickname || me?.username || "회원");
  // 로그인 아이디만 노출
  const idLabel = loading ? "" : (me?.memberLoginId ?? "");

  const avatarUri = me?.profileImageUrl ?? undefined;
  const avatarSeed = me?.memberLoginId || me?.nickname || me?.username;

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await storage.removeItem("accessToken");
            await storage.removeItem("refreshToken");
            router.replace("/login");
          } catch (e) {
            console.warn(e);
          }
        },
      },
    ]);
  };

  const goEditProfile = () => {
    router.push("/profile/edit");
  };

  return (
    <View style={s.container}>
      <BackHeader title="마이페이지" />
      <ScrollView contentContainerStyle={s.scroll}>
        {/* 프로필 영역 */}
        <View style={s.profileBox}>
          <View style={s.avatarWrap}>
            <GradientAvatar uri={avatarUri} seed={avatarSeed} size={80} />
            <TouchableOpacity style={s.editBtn} activeOpacity={0.8} onPress={goEditProfile}>
              <EditIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* 이름 & 로그인아이디 */}
          <Text style={s.name}>{displayName}</Text>
          {!!idLabel && <Text style={s.idText}>{idLabel}</Text>}

          {!!error && (
            <Text style={{ color: "#f33", marginTop: 8 }}>프로필 불러오기 실패</Text>
          )}
        </View>

        {/* 나의 계정 섹션 */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>나의 계정</Text>
          <View style={s.sectionBody}>
            <SettingListItem
              title="회원 정보 수정"
              leftIcon={<UserIcon width={24} height={24} />}
              onPress={() => router.push("/profile/edit")}
            />
            <SettingListItem
              title="비밀번호 변경"
              leftIcon={<LockIcon width={24} height={24} />}
              onPress={() => router.push("/profile/password")}
            />
            <SettingListItem
              title="알림 설정"
              leftIcon={<BellIcon width={24} height={24} />}
              onPress={() => router.push("/settings/notification")}
            />
          </View>
        </View>

        {/* 고객센터 섹션 */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>고객센터</Text>
          <View style={s.sectionBody}>
            <SettingListItem
              title="공지사항"
              leftIcon={<FlagIcon width={20} height={20} />}
              onPress={() => router.push("/support/notice")}
            />
            <SettingListItem
              title="1 : 1 문의"
              leftIcon={<ChatIcon width={20} height={20} />}
              onPress={() => router.push("/support/inquiry")}
            />
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogoutIcon width={20} height={20} />
          <Text style={s.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },

  profileBox: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarWrap: { position: "relative" },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginTop: 12,
  },
  idText: {
    fontSize: 12,
    color: "#797979",
    marginTop: 4,
  },

  section: { marginTop: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginHorizontal: "5%",
    paddingTop: 18,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#797979",
  },
  sectionBody: {},

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: "5%",
    borderRadius: 10,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
});