// app/home/MyPuzzleScreen.tsx
import React, { useCallback, useState } from "react";
import { View, ScrollView, StyleSheet, Text, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Union from "@/assets/image/homepage_puzzleimg/Union.png";
import { TokenReq } from "@/components/apis/axiosInstance";

const MY_MEMBER_ID = 123;

// ===== API 타입: mateBoards 스키마 =====
type MateBoardDto = {
  id: number;
  memberId: number;
  memberName: string;
  content: string;
  createdAt: string;
  expiresAt: string;
  isOwner: boolean;
};

type ApiData = {
  mateBoards: MateBoardDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
};

type ApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: ApiData;
  success: boolean;
};

// ===== 화면 표시용 카드 =====
type CardData = {
  id: number;
  imgurl: string;
  name: string;
  content: string;
  memberId: number;
};

export default function MyPuzzleScreen() {
  const [items, setItems] = useState<CardData[]>([]);
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

          const res = await TokenReq.get<ApiResponse>("/api/mateboards", {
            params: { page: 0, size: 300 },
          });

          if (cancelled) return;

          if (!res.data?.isSuccess || !res.data?.data) {
            throw new Error(res.data?.message || "응답 포맷 오류");
          }

          const boards = res.data.data.mateBoards ?? [];

          // 내 글 제외
          const filtered = boards.filter((b) => b.memberId !== MY_MEMBER_ID);

          const mapped: CardData[] = filtered.map((b) => ({
            id: b.id,
            imgurl: "", // 프로필 이미지 있으면 여기에 추가
            name: b.memberName || `멤버 ${b.memberId}`,
            content: b.content || "",
            memberId: b.memberId,
          }));

          setItems(mapped);
        } catch (e: any) {
          if (!cancelled) {
            setItems([]);
            setErr("서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
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
const CARD_RATIO = 370 / 185;

function PuzzleItem({ data, idx }: { data: CardData; idx: number }) {
  return (
    <View
      style={[
        s.card,
        {
          marginTop: idx === 0 ? 0 : -OVERLAP,
          zIndex: idx + 1,
        },
      ]}
    >
      {/* 배경 */}
      <View style={s.bgWrap}>
        <Image source={Union} style={s.bgImage} resizeMode="cover" />
      </View>

      {/* 오버레이 */}
      <View style={s.cardOverlay}>
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

        <Text style={s.title} numberOfLines={2}>
          {data.content}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: { height: 50, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "600", fontFamily: "PretendardSemiBold" },
  arrow: { position: "absolute", left: 10, fontSize: 20, fontFamily: "PretendardSemiBold" },

  puzzleContent: {
    paddingBottom: 32,
    rowGap: 0,
    paddingHorizontal: "5%",
    alignItems: "stretch",
  },

  info: { paddingHorizontal: 16, paddingVertical: 8, color: "#8E8E8E" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 8, color: "#8E8E8E" },

  card: {
    position: "relative",
    width: "100%",
    alignSelf: "stretch",
    aspectRatio: CARD_RATIO,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  bgImage: { width: "100%", height: "100%", borderRadius: CARD_RADIUS },

  cardOverlay: { flex: 1, zIndex: 1, padding: 16, justifyContent: "flex-start" },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarFallback: { backgroundColor: "#EEF1F5", alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontWeight: "700", color: "#4A5568" },

  name: { flexShrink: 1, fontSize: 15, fontWeight: "700", color: "#111" },
  title: { fontSize: 14, color: "#333", lineHeight: 20 },
  empty: { padding: 24, textAlign: "center", color: "#8E8E8E" },
});
