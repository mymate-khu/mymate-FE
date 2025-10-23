// app/home_puzzle/TodayPuzzleComponent.tsx
import React from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { router, useFocusEffect } from "expo-router";

import DayTab from "./DayTab";
import SegmentedMM, { type Mode } from "./SegmentedMM";
import TodayPuzzleStack from "./TodayPuzzleStack";
import StatusBadge from "./StatusBadge";
import { usePuzzles } from "@/hooks/usePuzzles";

export default function TodayPuzzleScreen() {
  const { loading, mode, setMode, day, setDay, items, mateStatuses, refetch, remove } = usePuzzles();

  useFocusEffect(React.useCallback(() => { refetch(); }, [refetch]));

  // MATE 모드일 때만 우상단 상태 배지 (index 그대로 사용)
  const rightSlot = (index: number) =>
    mode === "mate" ? <StatusBadge status={mateStatuses[index] ?? "inprogress"} /> : null;

  // ✅ 이제 id를 직접 받음
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
      { text: "삭제", style: "destructive", onPress: () =>
          remove(id).catch((e:any)=>Alert.alert("삭제 실패", e?.message || "삭제에 실패했어요.")) },
    ]);
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TODAY’s PUZZLE</Text>
        <SegmentedMM value={mode as Mode} onChange={setMode} />
      </View>

      <DayTab value={day} onChange={setDay} style={{ marginTop: 8, marginBottom: 8 }} />

      <TodayPuzzleStack
        items={items}                                // items의 각 원소에 id 있어야 함
        palette={mode === "me" ? "yellow" : "purple"}
        rightSlot={rightSlot}                        // 배지는 index로 계속 OK
        showPlus={mode === "me"}
        onAdd={() => router.push("/home/home_puzzle/PuzzleCreate")}
        onEdit={handleEdit}                          // ← id 직접 전달
        onDelete={handleDelete}                      // ← id 직접 전달
      />

      {loading ? null : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  headerTitle: { fontSize: 18, color: "#111" },
});