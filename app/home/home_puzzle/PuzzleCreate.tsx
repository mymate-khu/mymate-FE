// app/home_puzzle/PuzzleCreate.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Modal,
  Platform,
  Alert,
  Text,
} from "react-native";
import { router } from "expo-router";

import BackHeader from "@/components/BackHeader";
import CalendarCard from "@/components/CalendarCard";
import CalendarIcon from "@/assets/image/adjustmenticon/calendar_Icon.svg";

import { createPuzzle } from "@/components/apis/puzzles"; // ✅ API 분리 사용

/* helpers */
const todayStrSlash = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} / ${m} / ${day}`;
};
const slashToDash = (s: string) => s.replace(/\s*\/\s*/g, "-");

export default function PuzzleCreate() {
  const [date, setDate] = useState<string>(todayStrSlash());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const isValid = title.trim().length > 0;

  const onSubmit = async () => {
    if (!isValid) {
      Alert.alert("입력 확인", "퍼즐 제목을 입력해주세요.");
      return;
    }
    try {
      await createPuzzle({
        title: title.trim(),
        description: desc.trim(),
        scheduledDate: slashToDash(date), // "YYYY-MM-DD"
        // 필요하면 여기에 priority, category 등 추가로 전달
        // priority: "HIGH",
        // category: "건강",
      });
      Alert.alert("완료", "퍼즐이 등록되었습니다.");
      router.back();
    } catch (err: any) {
      Alert.alert("실패", err?.message || "퍼즐 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="마이 퍼즐" color="#111" onBack={() => router.back()} />

      <View style={s.card}>
        {/* 날짜 */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="YYYY / MM / DD"
            placeholderTextColor="#999"
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity style={s.trailingIcon} onPress={() => setCalendarOpen(true)}>
            <CalendarIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 퍼즐 제목 */}
        <TextInput
          style={s.inputSolo}
          placeholder="퍼즐 제목 입력"
          placeholderTextColor="#999999"
          value={title}
          onChangeText={setTitle}
        />

        {/* 세부 설명 */}
        <View style={s.textareaBox}>
          <TextInput
            style={s.textarea}
            placeholder="세부 설명 입력"
            placeholderTextColor="#999999"
            value={desc}
            onChangeText={setDesc}
            multiline
          />
        </View>

        {/* 완료 버튼 (비활성화일 때 회색/커서 기본) */}
        <TouchableOpacity
          activeOpacity={isValid ? 0.9 : 1}
          style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
          onPress={onSubmit}
          disabled={!isValid}
        >
          <Text style={[s.submitText, !isValid && s.submitTextDisabled]}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 캘린더 모달 */}
      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={s.modalRoot}>
          <TouchableOpacity style={s.backdrop} onPress={() => setCalendarOpen(false)} />
          <View style={s.modalPanel}>
            <CalendarCard
              value={slashToDash(date)}
              onChange={(newDate) => {
                const [y, m, d] = newDate.split("-");
                setDate(`${y} / ${m} / ${d}`);
                setCalendarOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE300",
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
  },
  card: { borderRadius: 24, padding: 16, marginTop: 8 },

  inputRow: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  trailingIcon: { marginLeft: "auto" },
  input: { flex: 1, color: "#111", fontSize: 17 },

  inputSolo: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    marginBottom: 12,
    color: "#111",
    fontSize: 17,
  },

  textareaBox: {
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    height: 180,
    marginBottom: 16,
  },
  textarea: {
    flex: 1,
    color: "#111",
    fontSize: 16,
    textAlignVertical: "top",
  },

  submitBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: "#fff",
    opacity: 0.5,                // ← 비활성화 시 흐리게
  },
  submitText: { color: "#111", fontWeight: "700", fontSize: 16 },
  submitTextDisabled: { color: "#999" },

  modalRoot: { flex: 1, alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)" },
  modalPanel: {
    width: "97%",
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
    elevation: 3,
    paddingBottom: Platform.select({ ios: 8, android: 8 }),
    marginTop: 275,
  },
});