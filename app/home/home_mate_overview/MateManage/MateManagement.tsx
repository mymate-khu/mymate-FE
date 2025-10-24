// app/home/home_mate_overview/MateManage/MateManagement.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router"; // ✅ 추가
import BackHeader from "@/components/BackHeader";
import SectionHeader from "./SectionHeader";
import MateListItem from "./MateListItem";
import { useGroups } from "@/hooks/useGroups";

type Mate = {
  id: string;
  name: string;
  code: string;
  photo?: string;
};

export default function MateManagement() {
  const { otherMembers, pendingMates, loading, error } = useGroups();

  // 수락 대기 중인 메이트들을 Mate 형태로 변환
  const pendingMatesList: Mate[] = useMemo(() => {
    return pendingMates.map(mate => ({
      id: mate.id,
      name: mate.name,
      code: mate.code,
      photo: mate.photo,
    }));
  }, [pendingMates]);

  // API에서 가져온 실제 그룹 멤버들을 Mate 형태로 변환
  const currentMates: Mate[] = useMemo(() => {
    return otherMembers.map(member => ({
      id: member.id,
      name: member.name,
      code: member.code,
      photo: member.photo,
    }));
  }, [otherMembers]);

  const handleRejectPending = (mate: Mate) => {
    Alert.alert("요청 취소", `${mate.name}의 요청을 취소할까요?`, [
      { text: "아니오", style: "cancel" },
      { text: "예", style: "destructive", onPress: () => console.log("reject", mate.id) },
    ]);
  };

  const handleRemoveMate = (mate: Mate) => {
    Alert.alert("삭제", `${mate.name}을(를) 메이트에서 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => console.log("remove", mate.id) },
    ]);
  };

  const handleAddMate = () => {
    // ✅ 메이트 추가 화면으로 이동
    // 내가 만든 경로에 맞춰서 push 경로를 써줘.
    // 예) app/home/mate_add/MateAddScreen.tsx 를 만들었다면:
    router.push("./MateAddScreen");

    // 만약 다른 위치라면 그 경로로 바꿔줘:
    // router.push("/home/home_mate_overview/MateManage/MateAddScreen");
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <View style={s.screen}>
        <BackHeader title="나의 메이트 관리" />
        <View style={s.loadingContainer}>
          <Text style={s.loadingText}>메이트 목록을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <View style={s.screen}>
        <BackHeader title="나의 메이트 관리" />
        <View style={s.errorContainer}>
          <Text style={s.errorText}>메이트 목록을 불러올 수 없습니다.</Text>
          <Text style={s.errorSubText}>잠시 후 다시 시도해주세요.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <BackHeader title="나의 메이트 관리" />

      <ScrollView contentContainerStyle={s.container}>
        {/* 수락 대기 중 */}
        <SectionHeader title="수락 대기 중" />
        <View style={s.sectionBody}>
          {pendingMatesList.map((m) => (
            <MateListItem
              key={m.id}
              name={m.name}
              code={m.code}
              photo={m.photo}
              mode="pending"
              onPressAction={() => handleRejectPending(m)}
            />
          ))}
          {pendingMatesList.length === 0 && (
            <Text style={s.emptyText}>수락 대기 중인 요청이 없어요.</Text>
          )}
        </View>

        {/* 현재 추가된 메이트 */}
        <SectionHeader title="현재 추가된 메이트" />
        <View style={s.sectionBody}>
          {currentMates.map((m) => (
            <MateListItem
              key={m.id}
              name={m.name}
              code={m.code}
              photo={m.photo}
              mode="active"
              onPressAction={() => handleRemoveMate(m)}
            />
          ))}
          {currentMates.length === 0 && (
            <Text style={s.emptyText}>추가된 메이트가 아직 없어요.</Text>
          )}
        </View>

        {/* 추가 버튼 */}
        <TouchableOpacity activeOpacity={0.85} style={s.addBtn} onPress={handleAddMate}>
          <Text style={s.plus}>＋</Text>
          <Text style={s.addText}>메이트 추가하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: 40 },
  sectionBody: { paddingTop: 8, paddingBottom: 16 },
  emptyText: { color: "#9A9A9A", fontSize: 14, paddingHorizontal: "5%", paddingVertical: 10 },

  // 로딩 상태
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  // 에러 상태
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },

  addBtn: {
    marginTop: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  plus: { fontSize: 25, lineHeight: 22, color: "#8B8B8B", fontWeight: "400" },
  addText: { fontSize: 15, color: "#666" },
});