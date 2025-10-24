// app/rules/RulesScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Alert, Platform, ViewStyle } from "react-native";

import RuleCard from "../rules/RuleCard";
import AddRuleCard from "../rules/AddRuleCard";
import RuleAddModal from "../rules/RuleAddModal";
import { useRulebooks } from "../../hooks/useRulebooks";

type EditTarget = { id: number; title: string; body: string } | null;

// 퍼즐 겹침/간격 설정
const COLS = 2;
const NOTCH = 26;      // 카드 SVG 하단 반달 높이
const ROW_GAP = 4;     // 행 간 기본 여백

export default function RulesScreen() {
  const { list: rules, create, update, remove } = useRulebooks();

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openCreate = () => {
    setEditTarget(null);
    setModalVisible(true);
  };

  const openEdit = (id: number) => {
    const r = rules.find((it) => it.id === id);
    if (!r) return;
    setEditTarget({ id, title: r.title, body: r.description || "" });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditTarget(null);
  };

  const handleSubmit = async (payload: { title: string; body: string }) => {
    try {
      if (editTarget) {
        await update(editTarget.id, { title: payload.title, content: payload.body });
      } else {
        await create({ title: payload.title, content: payload.body || "" });
      }
      closeModal();
    } catch (e: any) {
      Alert.alert(editTarget ? "수정 실패" : "등록 실패", e?.message || "처리에 실패했어요.");
    }
  };

  const confirmAndDelete = useCallback(
    async (id: number) => {
      try {
        setDeletingId(id);
        await remove(id);
        if (Platform.OS === "web") alert("삭제 완료");
        else Alert.alert("삭제 완료", "규칙이 삭제되었습니다.");
      } catch (e: any) {
        const msg = e?.message || "규칙 삭제에 실패했어요.";
        if (Platform.OS === "web") alert(`삭제 실패: ${msg}`);
        else Alert.alert("삭제 실패", msg);
      } finally {
        setDeletingId(null);
      }
    },
    [remove]
  );

  const handleDelete = (id: number) => {
    if (Platform.OS === "web") {
      // eslint-disable-next-line no-restricted-globals
      const ok = confirm("정말 삭제하시겠습니까?");
      if (ok) confirmAndDelete(id);
      return;
    }
    Alert.alert("삭제", "정말 삭제할까요?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => confirmAndDelete(id) },
    ]);
  };

  // 목록 + 마지막에 추가 카드
  const dataWithAdd = [...rules, { id: "add" } as any];
  // 마지막 줄에 카드가 1개만 있는지(= 가운데로 몰리지 않게 처리하기 위함)
  const singleLast = dataWithAdd.length % COLS === 1;

  return (
    <View style={s.screen}>
      <View style={s.hero}>
        <Text style={s.heroLine}>규칙은 딱 필요한 만큼만,</Text>
        <Text style={s.heroLine}>서로 편하게</Text>
      </View>

      <FlatList
        data={dataWithAdd}
        keyExtractor={(it: any) => String(it.id)}
        numColumns={COLS}
        contentContainerStyle={s.listContent}
        columnWrapperStyle={{ gap: 4, justifyContent: "space-between" }}
        ItemSeparatorComponent={() => <View style={{ height: ROW_GAP }} />}
        renderItem={({ item, index }) => {
          // 행/열 계산
          const row = Math.floor(index / COLS);
          const col = index % COLS;

          // 2행부터 위로 살짝 겹치기
          const overlapStyle: ViewStyle | undefined =
            row > 0 ? { marginTop: -(NOTCH - ROW_GAP) } : undefined;

          // 지그재그 색상
          const author = (row + col) % 2 === 0 ? "me" : "mate";

          // 마지막 줄이 1개뿐이고, 그 1개가 '추가' 카드라면 왼쪽 정렬 강제
          const forceLeftForLonelyAdd: ViewStyle | undefined =
            item.id === "add" && index === dataWithAdd.length - 1 && singleLast
              ? ({ alignSelf: "flex-start" as const } as ViewStyle)
              : undefined;

          if (item.id === "add") {
            return (
              <View style={[overlapStyle, forceLeftForLonelyAdd]}>
                <AddRuleCard onPress={openCreate} />
              </View>
            );
          }

          return (
            <View style={[overlapStyle, deletingId === item.id ? { opacity: 0.5 } : undefined]}>
              <RuleCard
                {...item}
                order={index + 1}
                author={author}
                onEdit={() => openEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            </View>
          );
        }}
      />

      <RuleAddModal
        visible={modalVisible}
        mode={editTarget ? "edit" : "create"}
        initialTitle={editTarget?.title}
        initialBody={editTarget?.body}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  hero: {
    paddingTop: 24,
    paddingHorizontal: "8%",
    paddingBottom: 20,
  },
  heroLine: {
    fontSize: 24,
    lineHeight: 35,
    fontWeight: "700",
    color: "#111",
  },
  listContent: {
    paddingHorizontal: "2.5%", // 화면 크기에 따라 유동적 여백
    paddingTop: 10,
    paddingBottom: 24,
    gap: 4,
    
  },
});