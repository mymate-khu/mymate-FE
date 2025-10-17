// app/home/home_mate_overview/MateManage/MateAddScreen.tsx
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BackHeader from "@/components/BackHeader";
import SearchBar from "@/components/SearchBar";
import SelectedMateStrip from "./SelectedMateStrip";
import SearchResultItem, { SearchResultItemState } from "./SearchResultItem";
// 프로젝트에 이미 쓰고 있던 axios 인스턴스가 있다면 이걸로 교체하세요.
import { TokenReq } from "@/components/apis/axiosInstance";

type User = { id: string; name: string; code: string; avatarUri?: string };

// 서버 응답 타입 (질문에 준 스키마 기준)
type ApiUser = {
  id: number;         // 123
  userId: string;     // "user123"  → code로 사용
  username: string;   // "홍길동"    → name으로 사용
  email: string;
};
type ApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: ApiUser[];
  success: boolean;
};

export default function MateAddScreen() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Array<User>>([]);

  // ✅ 서버에서 받아올 유저 목록
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 이미 메이트/요청중인 아이디들 (API 연동 시 교체)
  const alreadyMateIds = useMemo(() => new Set<string>([]), []);

  // 화면 진입 시 1회 조회
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          setErr(null);
          // ⬇️ 실제 엔드포인트로 교체하세요.
          // ex) GET /api/users?query=... (이번엔 전체 조회)
          const res = await TokenReq.get<ApiResponse>("/api/profile/all");
          if (cancelled) return;

          const list = (res.data?.data ?? []).map<User>((u) => ({
            id: String(u.id),
            name: u.username,
            code: u.userId,
            // 서버에서 아바타가 없으면 undefined 유지(또는 랜덤/프리셋 지정 가능)
          }));
          setAllUsers(list);
        } catch (e: any) {
          if (!cancelled) setErr(e?.message ?? "목록을 불러오지 못했어요.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  // 검색 결과
  const results = useMemo(() => {
    if (!q.trim()) return [] as User[];
    const t = q.trim().toLowerCase();
    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(t) ||
        u.code.toLowerCase().includes(t)
    );
  }, [q, allUsers]);

  const isSelected = useCallback(
    (id: string) => selected.some((s) => s.id === id),
    [selected]
  );

  const stateOf = useCallback(
    (id: string): SearchResultItemState => {
      if (alreadyMateIds.has(id)) return "disabled";
      return isSelected(id) ? "selected" : "default";
    },
    [alreadyMateIds, isSelected]
  );

  const toggleSelect = useCallback((id: string) => {
    const user = allUsers.find((u) => u.id === id);
    if (!user) return;
    setSelected((prev) =>
      prev.some((s) => s.id === id) ? prev.filter((s) => s.id !== id) : [...prev, user]
    );
  }, [allUsers]);

  const removeSelected = useCallback((id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const onSubmit = useCallback(() => {
    if (!selected.length) {
      // 건너뛰기
      console.log("skip");
      return;
    }
    // 추가하기
    console.log("add mates:", selected.map((s) => s.id));
    // TODO: POST /api/groups/{groupId}/members or 초대 API 호출
  }, [selected]);

  const ctaLabel = selected.length ? `추가하기(${selected.length})` : "건너뛰기";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <BackHeader title="나의 메이트 추가하기" />

      {/* 공용 SearchBar */}
      <View style={s.searchBar}>
        <SearchBar
          value={q}
          placeholder="아이디 찾기"
          onChangeText={setQ}
          onSubmit={() => console.log("검색:", q)}
          onClear={() => setQ("")}
          showClearButton
        />
      </View>

      {/* 선택 스트립 */}
      <SelectedMateStrip
        style={{
          borderBottomWidth: results.length ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: "#EFEFEF",
        }}
        selected={selected.map((s) => ({
          id: s.id,
          name: s.name,
          avatarUri: s.avatarUri,
        }))}
        onRemove={removeSelected}
      />

      {/* 결과 리스트 */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: "#8E8E8E" }}>불러오는 중…</Text>
        </View>
      ) : err ? (
        <Text style={s.empty}>{err}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(it) => it.id}
          ItemSeparatorComponent={() => <View style={s.divider} />}
          renderItem={({ item }) => (
            <SearchResultItem
              id={item.id}
              name={item.name}
              code={item.code}
              avatarUri={item.avatarUri}
              state={stateOf(item.id)}
              onToggle={toggleSelect}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            q.trim() ? (
              <Text style={s.empty}>검색 결과가 없어요.</Text>
            ) : (
              <Text style={s.hint}>
                아이디(이름/코드)로 검색해 보세요.
              </Text>
            )
          }
        />
      )}

      {/* 하단 고정 CTA */}
      <View style={s.ctaWrap}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[s.ctaBtn, selected.length ? s.ctaBtnActive : s.ctaBtnGhost]}
          onPress={onSubmit}
        >
          <Text
            style={[
              s.ctaText,
              selected.length ? s.ctaTextActive : s.ctaTextGhost,
            ]}
          >
            {ctaLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  searchBar: { marginHorizontal: 16, marginTop: 6, marginBottom: 20 },
  divider: { height: 1, backgroundColor: "#F1F1F1", marginLeft: 84 },
  empty: { padding: 24, textAlign: "center", color: "#8E8E8E" },
  hint: { padding: 24, textAlign: "center", color: "#B5B5B5" },
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EFEFEF",
  },
  ctaBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBtnActive: { backgroundColor: "#FFE600" },
  ctaBtnGhost: { backgroundColor: "#FFE600" },
  ctaText: { fontSize: 17, fontWeight: "500" },
  ctaTextActive: { color: "#111" },
  ctaTextGhost: { color: "#111" },
});
