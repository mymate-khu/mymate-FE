// app/home_puzzle/TodayPuzzleScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { router, useFocusEffect } from "expo-router";

import DayTab from "./DayTab";
import SegmentedMM, { type Mode } from "./SegmentedMM";
import TodayPuzzleStack from "./TodayPuzzleStack";
import StatusBadge from "./StatusBadge";
import { usePuzzles } from "@/hooks/usePuzzles";

// ✅ 부모(Home)에서 넘겨주는 새로고침 시그널
type Props = { refreshSignal?: number };

export default function TodayPuzzleScreen({ refreshSignal }: Props) {
  const {
    loading, mode, setMode, day, setDay,
    items, mateStatuses, puzzleStatuses,
    refetch, remove, toggleStatus
  } = usePuzzles();

  // 화면 재진입 시 자동 refetch (기존 유지)
  useFocusEffect(React.useCallback(() => { refetch(); }, [refetch]));

  // ✅ Pull-to-Refresh 등 부모 시그널 변화 시 강제 refetch
  React.useEffect(() => {
    if (refreshSignal !== undefined) {
      refetch();
    }
  }, [refreshSignal, refetch]);

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

  const handleToggle = (id: number) => {
    toggleStatus(id).catch((e: any) => {
      console.error("[TodayPuzzleScreen] toggle failed:", e);
      if (Platform.OS === "web") {
        alert(e?.message || "상태 변경에 실패했어요.");
      } else {
        Alert.alert("상태 변경 실패", e?.message || "상태 변경에 실패했어요.");
      }
    });
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
        onToggle={handleToggle}
        puzzleStatuses={puzzleStatuses}
      />

      {/* 필요하면 로딩 인디케이터 표시 영역 */}
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
