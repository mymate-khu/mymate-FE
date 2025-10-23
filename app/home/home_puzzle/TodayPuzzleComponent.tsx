// app/home_puzzle/TodayPuzzleComponent.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";

import DayTab from "./DayTab";
import SegmentedMM, { type Mode } from "./SegmentedMM";
import TodayPuzzleStack from "./TodayPuzzleStack";
import StatusBadge from "./StatusBadge";
import { usePuzzles } from "@/hooks/usePuzzles";

export default function TodayPuzzleComponent() {
  const { loading, mode, setMode, day, setDay, items, mateStatuses, refetch } = usePuzzles();

  useFocusEffect(React.useCallback(() => { refetch(); }, [refetch]));

  const rightSlot = (index: number) =>
    mode === "mate" ? <StatusBadge status={mateStatuses[index] ?? "inprogress"} /> : null;

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TODAY’s PUZZLE</Text>
        <SegmentedMM value={mode as Mode} onChange={setMode} />
      </View>

      <DayTab value={day} onChange={setDay} style={{ marginTop: 8, marginBottom: 8 }} />

      <TodayPuzzleStack
        items={items /* ✅ 이제 각 item에 id가 있어야 함 */}
        palette={mode === "me" ? "yellow" : "purple"}
        rightSlot={rightSlot}
        showPlus={mode === "me"}
        onAdd={() => router.push("/home/home_puzzle/PuzzleCreate")}
        // ✅ 수정 화면으로 이동 (id 쿼리로 전달)
        onEdit={(id) => router.push(`/home/home_puzzle/PuzzleEdit?id=${id}`)}
        // 삭제는 이후 API 붙일 때 처리
        onDelete={(id) => console.log("delete id:", id)}
      />

      {loading ? null : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  headerTitle: { fontSize: 18, color: "#111" },
});