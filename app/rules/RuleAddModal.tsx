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
  mode?: "create" | "edit";
  onClose: () => void;
  onSubmit: (payload: { title: string; body: string }) => void;
};

export default function RuleAddModal({
  visible,
  initialTitle = "",
  initialBody = "",
  mode = "create",
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={s.centerContainer}
      >
        {/* 배경 딤 처리 */}
        <TouchableOpacity style={s.dim} activeOpacity={1} onPress={onClose} />

        {/* 모달 본체 */}
        <View style={s.sheet}>
          <RuleAddBg
            width="100%"
            height="100%"
            style={StyleSheet.absoluteFillObject}
          />

          {/* 닫기 버튼 */}
          <TouchableOpacity style={s.close} onPress={onClose} hitSlop={8}>
            <X size={22} color="#111" />
          </TouchableOpacity>

          {/* 제목 */}
          <Text style={s.title}>
            {mode === "edit" ? "규칙 수정하기" : "규칙 등록하기"}
          </Text>

          {/* 입력 영역 */}
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
          <View style={[s.inputBox, s.bodyBox]}>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="내용을 입력하세요"
              placeholderTextColor="#9A9A9A"
              style={[s.input, { textAlignVertical: "top" }]}
              multiline
            />
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity
            style={s.cta}
            activeOpacity={0.9}
            onPress={() =>
              onSubmit({ title: title.trim(), body: body.trim() })
            }
          >
            <Text style={s.ctaText}>
              {mode === "edit" ? "수정" : "완료"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  /** ✅ 모달 전체를 화면 중앙에 배치 */
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /** 반투명 딤 레이어 */
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  bodyBox: {
    height: 180,
    justifyContent: "flex-start", // ✅ 글자가 위에서부터 시작
    paddingTop: 10,               // ✅ 위 여백 살짝 줘서 자연스럽게
  },

  /** 본체 카드 */
  sheet: {
    width: 340,
    height: 480,
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "white",
    elevation: 8, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  close: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    alignSelf: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: "#797979",
    marginLeft: 6,
    marginBottom: 6,
  },
  inputBox: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    color: "#111",
  },
  cta: {
    marginTop: 22,
    alignSelf: "flex-end",
    height: 42,
    paddingHorizontal: 22,
    backgroundColor: "#FFE600",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
});
