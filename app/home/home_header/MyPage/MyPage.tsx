import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import BackHeader from "@/components/BackHeader";
import GradientAvatar from "@/components/GradientAvatar";
import SettingListItem from "./SettingListItem";

import UserIcon from "@/assets/image/mypage/user.svg";
import LockIcon from "@/assets/image/mypage/lock.svg";
import BellIcon from "@/assets/image/mypage/bell.svg";
import FlagIcon from "@/assets/image/mypage/flag.svg";
import ChatIcon from "@/assets/image/mypage/chat.svg";
import LogoutIcon from "@/assets/image/mypage/logout.svg";
import EditIcon from "@/assets/image/mypage/edit.svg";

export default function MyPage() {
  const user = {
    name: "심효진",
    id: "SZZYDE770",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=480&auto=format&fit=crop",
  };

  const handleLogout = () => {
    console.log("로그아웃 실행");
    // TODO: storage.clear(); router.replace("/login");
  };

  return (
    <View style={s.container}>
      <BackHeader title="마이페이지" />

      <ScrollView contentContainerStyle={s.scroll}>
        {/* 프로필 영역 */}
        <View style={s.profileBox}>
          <View style={s.avatarWrap}>
            <GradientAvatar uri={user.avatar} size={80} />
            <TouchableOpacity style={s.editBtn} activeOpacity={0.8}>
              <EditIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.idText}>ID : {user.id}</Text>
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
  container: {
    flex: 1,
    //backgroundColor: "#FAFAFA",
  },
  scroll: {
    paddingBottom: 40,
  },

  /* 프로필 */
  profileBox: {
    alignItems: "center",
    paddingVertical: 32,
    //backgroundColor: "pink",
  },
  avatarWrap: {
    position: "relative",
  },
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
  section: {
    marginTop: 10,
    //backgroundColor: "yellow",
  },
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
  sectionBody: {
    //backgroundColor: "red",
  },

  /* 로그아웃 버튼 */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: "5%",
    borderRadius: 10,
    //backgroundColor: "#FFF",
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