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
} from "react-native";

import BackHeader from "@/components/BackHeader";
import SearchBar from "@/components/SearchBar";
import SelectedMateStrip from "./SelectedMateStrip";
import SearchResultItem, { SearchResultItemState } from "./SearchResultItem";

type User = { id: string; name: string; code: string; avatarUri?: string };

// 🔸 더미 유저 (API 연동 시 교체)
const ALL_USERS: User[] = [
  {
    id: "u1",
    name: "박민지",
    code: "SZZYDE770",
    avatarUri:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=480&auto=format&fit=crop",
  },
  {
    id: "u2",
    name: "김희영",
    code: "SZZYDE771",
    avatarUri:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=480&auto=format&fit=crop",
  },
  {
    id: "u3",
    name: "손민수",
    code: "SZZYDE772",
    avatarUri:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
  },
  {
    id: "u4",
    name: "정하진",
    code: "SZZYDE773",
    avatarUri:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=480&auto=format&fit=crop",
  },
    {
    id: "u5",
    name: "이하진",
    code: "SZZYDE775",
    avatarUri:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=480&auto=format&fit=crop",
  },
];

export default function MateAddScreen() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Array<User>>([]);

  // 예: 이미 메이트/요청중 목록 (API 연동 시 서버에서 내려받아 비교)
  const alreadyMateIds = useMemo(() => new Set<string>([]), []);

  const results = useMemo(() => {
    if (!q.trim()) return [] as User[];
    const t = q.trim().toLowerCase();
    return ALL_USERS.filter(
      (u) => u.name.toLowerCase().includes(t) || u.code.toLowerCase().includes(t)
    );
  }, [q]);

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
    const user = ALL_USERS.find((u) => u.id === id);
    if (!user) return;
    setSelected((prev) =>
      prev.some((s) => s.id === id) ? prev.filter((s) => s.id !== id) : [...prev, user]
    );
  }, []);

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

      {/* 공용 SearchBar 적용 */}
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
            <Text style={s.hint}>아이디(이름/코드)로 검색해 보세요.</Text>
          )
        }
      />

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
  // 🔄 기존 searchWrap 제거 → 공용 SearchBar 마진만 관리
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