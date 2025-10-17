// app/home/home_mate_overview/MateManage/MateManagement.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router"; // ✅ 추가
import BackHeader from "@/components/BackHeader";
import SectionHeader from "./SectionHeader";
import MateListItem from "./MateListItem";

type Mate = {
  id: string;
  name: string;
  code: string;
  photo?: string;
};

export default function MateManagement() {
  const pendingMates: Mate[] = useMemo(
    () => [
      {
        id: "p1",
        name: "박민지",
        code: "SZZYDE770",
        photo:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=480&auto=format&fit=crop",
      },
    ],
    []
  );

  const currentMates: Mate[] = useMemo(
    () => [
      {
        id: "m1",
        name: "김희영",
        code: "SZZYDE770",
        photo:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=480&auto=format&fit=crop",
      },
      {
        id: "m2",
        name: "손민수",
        code: "SZZYDE770",
        photo:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
      },
      {
        id: "m3",
        name: "정하진",
        code: "SZZYDE770",
        photo:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=480&auto=format&fit=crop",
      },
    ],
    []
  );

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

  return (
    <View style={s.screen}>
      <BackHeader title="나의 메이트 관리" />

      <ScrollView contentContainerStyle={s.container}>
        {/* 수락 대기 중 */}
        <SectionHeader title="수락 대기 중" />
        <View style={s.sectionBody}>
          {pendingMates.map((m) => (
            <MateListItem
              key={m.id}
              name={m.name}
              code={m.code}
              photo={m.photo}
              mode="pending"
              onPressAction={() => handleRejectPending(m)}
            />
          ))}
          {pendingMates.length === 0 && (
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
  emptyText: { color: "#9A9A9A", fontSize: 14, paddingHorizontal: 2, paddingVertical: 10 },

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