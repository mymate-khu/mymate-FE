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
        numColumns={2}
        contentContainerStyle={s.listContent}
        columnWrapperStyle={{ gap: 4 }}
        renderItem={({ item, index }) =>
          item.id === "add" ? (
            <AddRuleCard onPress={openCreate} />
          ) : (
            <View style={deletingId === item.id ? { opacity: 0.5 } : undefined}>
              <RuleCard
                {...item}
                order={index + 1}
                onEdit={() => openEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            </View>
          )
        }
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
    paddingHorizontal: "5%",
    paddingBottom: 20,
    //backgroundColor: "yellow",
  },
  heroLine: { fontSize: 24, lineHeight: 40, fontWeight: "700", color: "#111" },
  listContent: {
    paddingHorizontal: "5%",
    paddingTop: 10,
    paddingBottom: 24,
    gap: 4,
  },
});