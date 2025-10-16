// app/home/home_header/MyPage/MyPage.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";

import BackHeader from "@/components/BackHeader";
import GradientAvatar from "@/components/GradientAvatar";
import SettingListItem from "./SettingListItem";

// 아이콘
import UserIcon from "@/assets/image/mypage/user.svg";
import LockIcon from "@/assets/image/mypage/lock.svg";
import BellIcon from "@/assets/image/mypage/bell.svg";
import FlagIcon from "@/assets/image/mypage/flag.svg";
import ChatIcon from "@/assets/image/mypage/chat.svg";
import LogoutIcon from "@/assets/image/mypage/logout.svg";
import EditIcon from "@/assets/image/mypage/edit.svg";

// ✅ 프로필 훅
import { useMyProfile } from "@/hooks/useMyProfile";
// ✅ 토큰/스토리지 (logout 시 사용)
import { storage } from "@/components/apis/storage";

export default function MyPage() {
  // 프로필 불러오기
  const { me, loading, error } = useMyProfile();

  // 화면에 표기할 값들 (닉네임 > 실명 > email)
  const displayName = loading
    ? "..."
    : (me?.nickname || me?.username || me?.email || "회원");

  // ID 표기: 기획에 맞게 email 또는 memberId 등에서 선택
  const idLabel = loading
    ? ""
    : (me?.email ? me.email : `ID : ${me?.memberId ?? ""}`);

  const avatarUri = me?.profileImageUrl ?? undefined;

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
            // 필요하다면 사용자 캐시/기타 키도 함께 정리
            // await storage.removeItem("userId");

            router.replace("/login"); // 로그인 화면 경로에 맞게 수정
          } catch (e) {
            console.warn(e);
          }
        },
      },
    ]);
  };

  const goEditProfile = () => {
    // 프로필 수정 화면 경로에 맞게 조정
    router.push("/profile/edit");
  };

  return (
    <View style={s.container}>
      <BackHeader title="마이페이지" />

      <ScrollView contentContainerStyle={s.scroll}>
        {/* 프로필 영역 */}
        <View style={s.profileBox}>
          <View style={s.avatarWrap}>
            <GradientAvatar uri={avatarUri} size={80} />
            <TouchableOpacity style={s.editBtn} activeOpacity={0.8} onPress={goEditProfile}>
              <EditIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* 이름 & 아이디 */}
          <Text style={s.name}>{displayName}</Text>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 8 }} />
          ) : (
            !!idLabel && <Text style={s.idText}>{idLabel}</Text>
          )}

          {/* 에러가 있으면 살짝만 표시(원하면 삭제 가능) */}
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

  /* 프로필 */
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

  /* 섹션 */
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

  /* 로그아웃 버튼 */
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