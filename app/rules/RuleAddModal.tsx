import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import RuleAddBg from "@/assets/image/rules/RuleAdd.svg";

type Props = {
  visible: boolean;
  initialTitle?: string;
  initialBody?: string;
  mode?: "create" | "edit";              // ✅ 추가: 모달 모드
  onClose: () => void;
  onSubmit: (payload: { title: string; body: string }) => void;
};

export default function RuleAddModal({
  visible,
  initialTitle = "",
  initialBody = "",
  mode = "create",                      // ✅ 기본은 생성
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setBody(initialBody);
    }
  }, [visible, initialTitle, initialBody]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        style={s.center}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Dim */}
        <TouchableOpacity style={s.dim} activeOpacity={1} onPress={onClose} />

        {/* Sheet */}
        <View style={s.sheet}>
          <RuleAddBg width="100%" height="100%" style={StyleSheet.absoluteFillObject} />

          <TouchableOpacity style={s.close} onPress={onClose} hitSlop={8}>
            <X size={22} color="#111" />
          </TouchableOpacity>

          <Text style={s.title}>{mode === "edit" ? "규칙 수정하기" : "규칙 등록하기"}</Text>

          <Text style={s.label}>제목</Text>
          <View style={s.inputBox}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력하세요"
              placeholderTextColor="#9A9A9A"
              style={s.input}
            />
          </View>

          <Text style={[s.label, { marginTop: 16 }]}>내용</Text>
          <View style={[s.inputBox, { height: 220 }]}>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="내용을 입력하세요"
              placeholderTextColor="#9A9A9A"
              style={[s.input, { textAlignVertical: "top" }]}
              multiline
            />
          </View>

          <TouchableOpacity
            style={s.cta}
            activeOpacity={0.9}
            onPress={() => onSubmit({ title: title.trim(), body: body.trim() })}
          >
            <Text style={s.ctaText}>{mode === "edit" ? "수정" : "완료"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    width: "90%",
    borderRadius: 24,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
  },
  close: { position: "absolute", right: 16, top: 16 },
  title: { fontSize: 20, fontWeight: "800", color: "#111", alignSelf: "center", marginTop: 12, marginBottom: 16 },
  label: { fontSize: 14, color: "#666", marginLeft: 6, marginBottom: 8 },
  inputBox: { height: 56, borderRadius: 16, backgroundColor: "#F4F4F4", paddingHorizontal: 14, justifyContent: "center" },
  input: { fontSize: 15, color: "#111" },
  cta: {
    marginTop: 18,
    alignSelf: "flex-end",
    height: 44,
    paddingHorizontal: 18,
    backgroundColor: "#FFD51C",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 16, fontWeight: "700", color: "#111" },
});