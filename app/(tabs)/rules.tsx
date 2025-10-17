// app/rules/RulesScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
} from "react-native";

import RuleCard from "../rules/RuleCard";
import AddRuleCard from "../rules/AddRuleCard";
import RuleAddModal from "../rules/RuleAddModal";
import { useRulebooks } from "../../hooks/useRulebooks";

type EditTarget = { id: number; title: string; body: string } | null;

// 퍼즐 겹침/간격 설정
const COLS = 2;
const NOTCH = 26;     // 카드 SVG의 하단 반달 높이(필요하면 24~28 사이로 미세조정)
const ROW_GAP = 4;   // 행 간 기본 여백
const OVERLAP = NOTCH - ROW_GAP; // 2행부터 위로 당겨 겹칠 값

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
        await update(editTarget.id, {
          title: payload.title,
          content: payload.body,
        });
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

  const dataWithAdd = [...rules, { id: "add" } as any];

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
        columnWrapperStyle={{ gap: 4,  }} 
        ItemSeparatorComponent={() => <View style={{ height: ROW_GAP }} />}   // ✅ 행 간 기본 여백
        renderItem={({ item, index }) => {
          const row = Math.floor(index / COLS);
          const overlapStyle = row > 0 ? { marginTop: -OVERLAP } : null;      // ✅ 2행부터 겹치기

          if (item.id === "add") {
            return (
              <View style={overlapStyle}>
                <AddRuleCard onPress={openCreate} />
              </View>
            );
          }

          return (
            <View style={[overlapStyle, deletingId === item.id ? { opacity: 0.5 } : undefined]}>
              <RuleCard
                {...item}
                order={index + 1}
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
    color: "#111" 
},
  listContent: {
    paddingHorizontal: "5%",
    paddingTop: 10,
    paddingBottom: 24,
    gap: 4,
  },
});