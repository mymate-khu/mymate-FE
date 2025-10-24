// app/home_puzzle/TodayPuzzleScreen.tsx
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

      <TodayPuzzleStack
        items={items}
        palette={mode === "me" ? "yellow" : "purple"}
        rightSlot={rightSlot}
        showPlus={mode === "me"}
        onAdd={() => router.push("/home/home_puzzle/PuzzleCreate")}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {loading ? null : null}
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
});