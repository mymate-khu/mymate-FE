// app/home_puzzle/PuzzleEdit.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView, View, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Modal, Platform, Alert, Text,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import BackHeader from "@/components/BackHeader";
import CalendarCard from "@/components/CalendarCard";
import CalendarIcon from "@/assets/image/adjustmenticon/calendar_Icon.svg";

import { getPuzzle, updatePuzzle } from "@/components/apis/puzzles";

const dashToSlash = (s: string) => s.replace(/-/g, " / ");
const slashToDash = (s: string) => s.replace(/\s*\/\s*/g, "-");

export default function PuzzleEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const puzzleId = Number(id);

  const [date, setDate] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const isValid = title.trim().length > 0;

  // ✅ 웹 아웃라인 제거 (Create와 동일)
  const webNoOutline =
    Platform.OS === "web" ? ({ outlineStyle: "none", outlineWidth: 0 } as any) : null;

  useEffect(() => {
    (async () => {
      try {
        if (!Number.isFinite(puzzleId)) throw new Error("잘못된 퍼즐 ID");
        const p = await getPuzzle(puzzleId);
        setTitle(p.title || "");
        setDesc(p.description || "");
        setDate(dashToSlash(p.scheduledDate));
      } catch (e: any) {
        Alert.alert("불러오기 실패", e?.message || "퍼즐 정보를 불러오지 못했습니다.");
        router.back();
      }
    })();
  }, [puzzleId]);

  const onSubmit = async () => {
    if (!isValid) {
      Alert.alert("입력 확인", "제목을 입력해주세요.");
      return;
    }
    try {
      await updatePuzzle(puzzleId, {
        title: title.trim(),
        description: desc.trim(),
        scheduledDate: slashToDash(date),
      });
      Alert.alert("완료", "퍼즐이 수정되었습니다.");
      router.back();
    } catch (e: any) {
      Alert.alert("실패", e?.message || "퍼즐 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="퍼즐 수정" color="#111" onBack={() => router.back()} />

      <View style={s.card}>
        {/* 날짜 */}
        <View style={s.inputRow}>
          <TextInput
            style={[s.input, webNoOutline]}
            placeholder="YYYY / MM / DD"
            placeholderTextColor="#999"
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity style={s.trailingIcon} onPress={() => setCalendarOpen(true)}>
            <CalendarIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 제목 */}
        <TextInput
          style={[s.inputSolo, webNoOutline]}
          placeholder="퍼즐 제목 입력"
          placeholderTextColor="#999999"
          value={title}
          onChangeText={setTitle}
        />

        {/* 설명 */}
        <View style={s.textareaBox}>
          <TextInput
            style={[s.textarea, webNoOutline]}
            placeholder="세부 설명 입력"
            placeholderTextColor="#999999"
            value={desc}
            onChangeText={setDesc}
            multiline
          />
        </View>

        {/* 저장 */}
        <TouchableOpacity
          activeOpacity={isValid ? 0.9 : 1}
          style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
          onPress={onSubmit}
          disabled={!isValid}
        >
          <Text style={[s.submitText, !isValid && s.submitTextDisabled]}>저장</Text>
        </TouchableOpacity>
      </View>

      {/* 캘린더 */}
      <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
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

/* ✅ 수정된 스타일 (Create와 통일) */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE300",
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
  },
  card: { borderRadius: 24, padding: 16 },

  inputRow: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  trailingIcon: { marginLeft: "auto" },
  input: { flex: 1, color: "#111", fontSize: 17 },

  inputSolo: {
    height: 48,
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
    marginBottom: 48,
  },
  textarea: {
    flex: 1,
    color: "#111",
    fontSize: 17,
    textAlignVertical: "top",
    paddingTop: 12,
    paddingBottom: 12,
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
    backgroundColor: "#fff", // ✅ 비활성화 시 흰색 고정
  },
  submitText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 17,
  },
  submitTextDisabled: {
    color: "#999",
  },

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