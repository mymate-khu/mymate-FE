// MATE에서 쓰는 상태 배지 (표시 전용)
import React from "react";
import { Text, View, StyleSheet } from "react-native";

export type MateStatus = "inprogress" | "done";

export default function StatusBadge({ status }: { status: MateStatus }) {
  const isDone = status === "done";
  return (
    <View style={[styles.badge, isDone ? styles.done : styles.progress]}>
      <Text style={[styles.label, isDone ? styles.doneLabel : styles.progressLabel]}>
        {isDone ? "DONE" : "IN PROGRESS"}
      </Text>
    </View>
  );
}



const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    height: 28,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { 
    fontSize: 14,  
  },
  progress: { 
    borderColor: "#999999", 
    backgroundColor: "transparent",
    borderStyle: "dashed", 
  },
  progressLabel: { 
    color: "#999999" 
  },
  done: { 
    borderColor: "#fff", 
    backgroundColor: "#fff" 
  },
  doneLabel: { 
    color: "#111" 
  },
});