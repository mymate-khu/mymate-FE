import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { router } from "expo-router";
import Mypuzzle from "@/assets/image/homepage_puzzleimg/Mypuzzle.svg";
import Matepuzzle from "@/assets/image/homepage_puzzleimg/Matepuzzle.svg";
import ChevronRight from "@/assets/image/homepage_puzzleimg/chevron-right.svg";
import { TokenReq } from "@/components/apis/axiosInstance";

export default function MateboardComponent() {
  const [memo, setMemo] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSent = useRef<string>("");

  const postMemo = useCallback(
    async (content: string) => {
      const body = content.trim();
      if (!body) return; // 빈 내용은 전송 안 함
      if (latestSent.current === body) return; // 중복 전송 방지

      try {
        const res = await TokenReq.post("/api/mateboards", { content: body });
        console.log(res)
        latestSent.current = body;
      } catch (e: any) {
        if (Platform.OS === "web") {
          alert(`저장 실패: ${e?.message || "서버 오류"}`);
        } else {
          Alert.alert("저장 실패", e?.message || "서버 오류가 발생했어요.");
        }
      }
    },
    []
  );

  // 입력 시 디바운스 자동 저장 (800ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!memo.trim()) return;

    debounceRef.current = setTimeout(() => {
      postMemo(memo);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [memo, postMemo]);

  // 포커스 아웃 시 즉시 저장
  const onBlurSave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    postMemo(memo);
  }, [memo, postMemo]);

  return (
    <View>
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <Text style={s.title}>MATE BOARD</Text>
      </View>

      <View style={s.puzzleRow}>
        {/* 왼쪽 퍼즐 - 나의 메모 입력 */}
        <View style={[s.cell, { width: "51%" }]}>
          <Mypuzzle width="100%" height="100%" viewBox="0 0 193 124" pointerEvents="none" />

          <View style={s.overlay} pointerEvents="box-none">
            <Text style={s.label}>Me</Text>

            <TextInput
              style={s.memoInput}
              placeholder="내용을 입력해주세요..."
              placeholderTextColor="#888"
              multiline
              value={memo}
              onChangeText={setMemo}
              onBlur={onBlurSave}
            />
          </View>
        </View>

        {/* 오른쪽 퍼즐 - 메이트 보드 이동 */}
        <View style={[s.cell, { width: "55%", marginLeft: -26 }]}>
          <Matepuzzle width="100%" height="100%" viewBox="0 0 209 124" pointerEvents="none" />

          <View style={s.overlay} pointerEvents="box-none">
            <TouchableOpacity
              onPress={() => router.push("/home/home_mateboard/Mateboardpage")}
              style={s.chevron}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            >
              <ChevronRight width={20} height={20} />
            </TouchableOpacity>

            <Text style={[s.label, { left: 16 }]}>Mate</Text>
            <Text style={[s.label, { left: 16, color: "#888", fontSize: 14, fontWeight: "400" }]}>
              {"오늘의 메이트 보드를\n확인해보세요!"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  puzzleRow: {
    flexDirection: "row",
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    position: "relative",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 20,
    top: 20,
    right: 20,
  },
  chevron: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 6,
    zIndex: 10,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: "400",
    color: "#111",
    marginBottom: 6,
    fontFamily: "DonerRegularDisplay",
  },
  memoInput: {
    minHeight: 70,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: "transparent",
    fontSize: 14,
  },
  title: {
    fontWeight: "400",
    fontSize: 18,
    fontFamily: "DonerRegularDisplay",
  },
});
