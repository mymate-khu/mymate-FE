// app/home_puzzle/TodayPuzzleScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";

import DayTab from "./DayTab";
import SegmentedMM, { type Mode } from "./SegmentedMM";
import TodayPuzzleStack from "./TodayPuzzleStack";
import StatusBadge from "./StatusBadge";
import { usePuzzles } from "@/hooks/usePuzzles";

export default function TodayPuzzleScreen() {
  const { loading, mode, setMode, day, setDay, items, mateStatuses, refetch, remove } = usePuzzles();

  useFocusEffect(React.useCallback(() => { refetch(); }, [refetch]));

  const rightSlot = (index: number) =>
    mode === "mate" ? <StatusBadge status={mateStatuses[index] ?? "inprogress"} /> : null;

  const handleEdit = (id: number) => {
    router.push(`/home/home_puzzle/PuzzleEdit?id=${id}`);
  };

  const handleDelete = (id: number) => {
    if (Platform.OS === "web") {
      // eslint-disable-next-line no-restricted-globals
      const ok = confirm("정말 삭제하시겠습니까?");
      if (!ok) return;
      remove(id).catch((e: any) => alert(e?.message || "삭제에 실패했어요."));
      return;
    }
    Alert.alert("삭제", "정말 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () =>
          remove(id).catch((e: any) =>
            Alert.alert("삭제 실패", e?.message || "삭제에 실패했어요.")
          ),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TODAY’s PUZZLE</Text>
        <SegmentedMM value={mode as Mode} onChange={setMode} />
      </View>

      <DayTab value={day} onChange={setDay} style={{ marginTop: 8, marginBottom: 8 }} />

      {/* 빈 상태 표시 */}
      {items.length === 0 ? (
        <EmptyPuzzleState
          mode={mode}
          onAdd={() => router.push("/home/home_puzzle/PuzzleCreate")}
        />
      ) : (
        <TodayPuzzleStack
          items={items}
          palette={mode === "me" ? "yellow" : "purple"}
          rightSlot={rightSlot}
          showPlus={mode === "me"}
          onAdd={() => router.push("/home/home_puzzle/PuzzleCreate")}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {loading ? null : null}
    </View>
  );
}

function EmptyPuzzleState({
  mode,
  onAdd,
}: {
  mode: "me" | "mate";
  onAdd: () => void;
}) {
  const isMe = mode === "me";
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>
        {isMe ? "아직 퍼즐이 없어요" : "오늘 볼 퍼즐이 없어요"}
      </Text>
      <Text style={styles.emptySub}>
        {isMe ? "하단 버튼으로 퍼즐을 만들어 보세요." : "상대가 퍼즐을 만들면 여기서 확인할 수 있어요."}
      </Text>

      {isMe && (
        <TouchableOpacity style={styles.emptyBtn} onPress={onAdd} activeOpacity={0.85}>
          <Text style={styles.emptyBtnText}>퍼즐 만들기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerTitle: { fontSize: 18, color: "#111" },

  /* empty */
  emptyWrap: {
    height: 260,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    backgroundColor: "#FFFCE6",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    marginTop: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  emptySub: { marginTop: 6, fontSize: 13, color: "#707070" },
  emptyBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBtnText: { color: "#FFE600", fontWeight: "700" },
});