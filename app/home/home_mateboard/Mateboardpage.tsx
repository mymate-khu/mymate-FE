import React, { useCallback, useState } from "react";
import { View, ScrollView, StyleSheet, Text, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Union from "@/assets/image/homepage_puzzleimg/Union.png";
import { TokenReq } from "@/components/apis/axiosInstance";

const MY_MEMBER_ID = 123;

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

type CardData = {
  id: number;
  imgurl: string;
  name: string;
  content: string;
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

  const todayISO = new Date().toISOString().split("T")[0];

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          setErr(null);

          // 실제 엔드포인트로 교체
          const res = await TokenReq.get<ApiResponse>(`api/puzzles/date/${todayISO}`);
          if (cancelled) return;
          const all = res.data?.data ?? [];

          const filtered = all.filter((p) => p.memberId !== MY_MEMBER_ID);
          const mapped: CardData[] = filtered.map((p) => ({
            id: p.id,
            imgurl: "",
            name: `멤버 ${p.memberId}`,
            content: p.title || p.description || "",
            memberId: p.memberId,
          }));

          setItems(mapped.length ? mapped : DUMMY_CARDS);
        } catch (e) {
          if (!cancelled) {
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
    }, [todayISO])
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>메이트 보드</Text>
        <Text style={s.arrow} onPress={() => router.replace("/home")}>
          {"<"}
        </Text>
      </View>

      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator />
          <Text style={s.loadingText}>불러오는 중…</Text>
        </View>
      ) : (
        <>
          {err && <Text style={s.info}>{err}</Text>}

          <ScrollView style={{ marginTop: 16 }} contentContainerStyle={s.puzzleContent}>
            {items.length === 0 ? (
              <Text style={s.empty}>표시할 퍼즐이 없어요.</Text>
            ) : (
              items.map((item, idx) => <PuzzleItem key={item.id} data={item} idx={idx} />)
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const OVERLAP = 23;
const CARD_RADIUS = 16;
const CARD_RATIO = 370 / 185; // Union 원본 비율 대략 반영

function PuzzleItem({ data, idx }: { data: CardData; idx: number }) {
  return (
    <View
      style={[
        s.card,
        {
          marginTop: idx === 0 ? 0 : -OVERLAP, // 위로 살짝 겹치기
          zIndex: idx + 1,
        },
      ]}
    >
      {/* ⬇️ 배경: 별도 래퍼로 감싸서 안전하게 클리핑 */}
      <View style={s.bgWrap}>
        <Image source={Union} style={s.bgImage} resizeMode="cover" />
      </View>

      {/* 오버레이 콘텐츠 */}
      <View style={s.cardOverlay}>
        {/* 아바타 + 이름 */}
        <View style={s.headerRow}>
          {data.imgurl ? (
            <Image source={{ uri: data.imgurl }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Text style={s.avatarInitial}>{data.name?.[0] ?? "?"}</Text>
            </View>
          )}
          <Text style={s.name} numberOfLines={1}>
            {data.name}
          </Text>
        </View>

        {/* 제목/내용 */}
        <Text style={s.title} numberOfLines={2}>
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
  },
  header: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "PretendardSemiBold",
  },
  arrow: {
    position: "absolute",
    left: 10,
    fontSize: 20,
    fontFamily: "PretendardSemiBold",
  },

  // ScrollView content 레이아웃
  puzzleContent: {
    paddingBottom: 32,
    rowGap: 0,               // 겹치기 위해 간격 0
    paddingHorizontal: "5%",    // ⬅️ 옆으로 튀는 걸 방지하려면 0이 안전
    alignItems: "stretch",
  },

  info: { paddingHorizontal: 16, paddingVertical: 8, color: "#8E8E8E" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 8, color: "#8E8E8E" },

  // 카드 박스
  card: {
    position: "relative",
    width: "100%",
    alignSelf: "stretch",        // 부모 폭을 그대로 사용
    aspectRatio: CARD_RATIO,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",          // 내용 클리핑
    // 그림자 필요하면 여기(elevation/shadow*) 추가
  },

  // 배경 래퍼: 절대 채우기 + 각 모서리 radius 지정(안드 이슈 대응)
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  // 배경 이미지: 래퍼 안에서 100% 채우기 + radius 부여(안드 이슈 이중 방어)
  bgImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
  },

  // 배경 위 컨텐츠
  cardOverlay: {
    flex: 1,
    zIndex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },

  // 아바타 + 이름 한 줄
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10, // columnGap 미지원 환경 대비
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
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  title: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  empty: {
    padding: 24,
    textAlign: "center",
    color: "#8E8E8E",
  },
});
