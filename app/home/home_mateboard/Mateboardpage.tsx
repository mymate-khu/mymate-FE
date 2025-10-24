import React, { useCallback, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Text, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Union from "@/assets/image/homepage_puzzleimg/Union.svg";
import { TokenReq } from "@/components/apis/axiosInstance";

// 📌 실제 로그인 유저의 memberId로 교체하세요 (ex. 전역 auth store, /me 응답 등)
const MY_MEMBER_ID = 123; // TODO: replace

// 서버 응답 타입 (질문에 준 스키마 기준)
type PuzzleDto = {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
  completedAt: string | null;
  status: "PENDING" | "DONE" | string;
  memberId: number;
  recurrenceType: string | null;
  recurrenceEndDate: string | null;
  parentPuzzleId: number | null;
  priority: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;

};



type ApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: PuzzleDto[];
  success: boolean;
};

// 화면 렌더용 타입
type CardData = {
  id: number;
  imgurl: string;
  name: string;     // 멤버 이름 (서버에 없으면 memberId로 대체)
  content: string;  // 퍼즐 내용(제목/설명)
  memberId: number;
};

const DUMMY_CARDS: CardData[] = [
  { id: 9001, imgurl: "", name: "멤버 201", content: "분리수거 / 오늘 저녁", memberId: 201 },
  { id: 9002, imgurl: "", name: "멤버 202", content: "거실 청소", memberId: 202 },
  { id: 9003, imgurl: "", name: "멤버 204", content: "전기요금 정산", memberId: 204 },
  { id: 9004, imgurl: "", name: "멤버 205", content: "우유/계란 사오기", memberId: 205 },
  { id: 9005, imgurl: "", name: "멤버 206", content: "욕실 배수구 청소", memberId: 206 },
  { id: 9006, imgurl: "", name: "멤버 207", content: "공용 쓰레기 배출", memberId: 207 },
];

export default function MyPuzzleScreen() {
  const [items, setItems] = useState<CardData[]>(DUMMY_CARDS);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  // ✅ 화면 포커스 시 1회(또는 재진입 시마다) 퍼즐 목록 불러오기
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          setErr(null);
          // ⬇️ 실제 엔드포인트로 교체하세요 (ex. GET /api/puzzles)
          const res = await TokenReq.get<ApiResponse>(`api/puzzles/date/${todayISO}`);
          console.log(res)
          if (cancelled) return;
          const all = res.data?.data ?? [];

          // 1) 내 memberId와 다른 것만 필터
          const filtered = all.filter((p) => p.memberId !== MY_MEMBER_ID);

          // 2) UI 데이터로 매핑
          const mapped: CardData[] = filtered.map((p) => ({
            id: p.id,
            imgurl: "", // 서버에서 아바타가 오지 않으므로 비워둠 (필요 시 멤버 프로필 조회 추가)
            name: `멤버 ${p.memberId}`, // 서버가 username을 안 주므로 일단 memberId로 표시 (프로필 API 연동 시 교체)
            content: p.title || p.description || "",
            memberId: p.memberId,
          }));

          setItems(mapped.length ? mapped : DUMMY_CARDS);
        } catch (e: any) {
          if (!cancelled){
            setItems(DUMMY_CARDS);
            setErr("서버 연결이 불안정하여 임시 데이터를 표시합니다.");
          } 
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={{ fontSize: 16, fontWeight: "500", fontFamily: "PretendardSemiBold" }}>
          메이트 보드
        </Text>
        <Text style={s.arrow} onPress={() => router.replace("/home")}>{"<"}</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: "#8E8E8E" }}>불러오는 중…</Text>
        </View>
      ) : (
        <>
          {/* 5) 에러는 안내 배너처럼만 표시하고, 리스트는 항상 렌더 */}
          {err && <Text style={s.info}>{err}</Text>}

          <ScrollView style={s.puzzlecontainer} contentContainerStyle={{ paddingBottom: 32 }}>
            {items.length === 0 ? (
              <Text style={s.empty}>표시할 퍼즐이 없어요.</Text>
            ) : (
              items.map((item) => (
                <PuzzleItem key={item.id} data={item} style={{ marginBottom: -30 }} />
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function PuzzleItem({ data, style }: { data: CardData; style?: any }) {
  return (
    <View style={[s.item, style]}>
      {/* SVG 배경 (터치 통과) */}
      <Union width="100%" height="100%" viewBox="0 0 370 170" pointerEvents="none" />

      {/* 오버레이 콘텐츠 */}
      <View style={s.overlay}>
        {/* 프로필 이미지 (좌측 상단) */}
        {data.imgurl ? (
          <Image source={{ uri: data.imgurl }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Text style={s.avatarInitial}>{data.name?.[0] ?? "?"}</Text>
          </View>
        )}

        {/* 이름 */}
        <Text style={s.name}>{data.name}</Text>

        {/* content */}
        <Text style={s.content} numberOfLines={2}>
          {data.content}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  arrow: {
    position: "absolute",
    fontSize: 20,
    fontFamily: "PretendardSemiBold",
    left: 10,
  },
  puzzlecontainer: {
    flexDirection: "column",
    paddingHorizontal: "5%",
    marginTop: 30,
  },
  info: { paddingHorizontal: 16, paddingVertical: 8, color: "#8E8E8E" },

  // 각 퍼즐 카드 컨테이너
  item: {
    position: "relative",
    minWidth: 300, // ← 쉼표 누락되어 있던 부분 수정!
    // 필요 시: aspectRatio: 370 / 170,
  },

  // SVG 위 오버레이
  overlay: {
    position: "absolute",
    left: 16,
    top: 16,
    right: 16,
  },

  // 아바타
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 8,
  },
  avatarFallback: {
    backgroundColor: "#EEF1F5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontWeight: "700",
    color: "#4A5568",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#4A4A4A",
  },

  empty: {
    padding: 24,
    textAlign: "center",
    color: "#8E8E8E",
  },
  error: {
    padding: 24,
    textAlign: "center",
    color: "#D00",
  },
});
