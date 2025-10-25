import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TokenReq } from "@/components/apis/axiosInstance";

import RuleCard1 from "@/assets/image/rules/Rule_card1.png";
import RuleCard2 from "@/assets/image/rules/Rule_card3.png";
import RuleCard3 from "@/assets/image/rules/Rule_card2.png";

import RuleAddModal from "@/app/rules/RuleAddModal";
import Vector from "@/assets/image/rules/Vector.png";

type RuleItem = {
  id: number;
  title: string;
  content: string;
  groupId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
};

const PLACEHOLDER = "__placeholder__";
const LAST_CARD = "__last__";
type GridItem = RuleItem | typeof PLACEHOLDER | typeof LAST_CARD;

export default function RuleScreen() {
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<RuleItem | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const isEditing = !!editTarget;

  // 공용 로드 함수
  const loadRules = useCallback(async () => {
    try {
      const res = await TokenReq.get("/api/rulebooks");
      const list: RuleItem[] = Array.isArray(res?.data?.data) ? res.data.data : [];
      setRules(list);
    } catch (e) {
      console.error("규칙 로드 실패", e);
      setRules([]);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadRules();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadRules]);

  // ✅ onRefresh 훅을 조건부 반환보다 위로 이동
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setMenuOpenId(null);
      await loadRules();
    } finally {
      setRefreshing(false);
    }
  }, [loadRules]);

  // grid 데이터: 항상 마지막 카드 추가 + 홀수면 placeholder
  const gridData: GridItem[] = useMemo(() => {
    if (rules.length === 0) return [LAST_CARD];
    const arr: GridItem[] = [...rules, LAST_CARD];
    if (arr.length % 2 === 1) arr.push(PLACEHOLDER);
    return arr;
  }, [rules]);

  // 규칙 추가/수정 submit
  const handleSubmitRule = useCallback(
    async ({ title, body }: { title: string; body: string }) => {
      const t = title.trim();
      const c = body.trim();
      if (!t || !c) {
        Alert.alert("입력 필요", "제목과 내용을 모두 입력해 주세요.");
        return;
      }

      try {
        if (isEditing && editTarget) {
          // 수정
          const id = editTarget.id;
          const res = await TokenReq.put(`/api/rulebooks/${id}`, {
            title: t,
            content: c,
          });

          const updated: RuleItem | undefined =
            res?.data?.data && typeof res.data.data === "object" ? res.data.data : undefined;

          setRules((prev) =>
            prev.map((r) =>
              r.id === id
                ? {
                    ...r,
                    title: updated?.title ?? t,
                    content: updated?.content ?? c,
                    updatedAt: updated?.updatedAt ?? new Date().toISOString(),
                  }
                : r
            )
          );
          setEditTarget(null);
          setModalVisible(false);
          return;
        }

        // 생성
        const res = await TokenReq.post("/api/rulebooks", {
          title: t,
          content: c,
        });

        const created: RuleItem | undefined =
          res?.data?.data && typeof res.data.data === "object" ? res.data.data : undefined;

        if (created && typeof created.id === "number") {
          setRules((prev) => [...prev, created]);
        } else {
          // 낙관적 추가
          const now = new Date().toISOString();
          const temp: RuleItem = {
            id: Date.now(),
            title: t,
            content: c,
            groupId: 0,
            createdBy: 0,
            createdAt: now,
            updatedAt: now,
          };
          setRules((prev) => [...prev, temp]);
        }

        setModalVisible(false);
      } catch (e: any) {
        console.error("규칙 등록/수정 실패", e?.response?.data || e?.message || e);
        Alert.alert("실패", "작업을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    },
    [isEditing, editTarget]
  );

  // 규칙 삭제
  const handleDeleteRule = useCallback(
    async (id: number) => {
      try {
        await TokenReq.delete(`/api/rulebooks/${id}`);
        setRules((prev) => prev.filter((r) => r.id !== id));
        setMenuOpenId(null);
      } catch (e: any) {
        console.error("규칙 삭제 실패", e?.response?.data || e?.message || e);
        Alert.alert("삭제 실패", "규칙을 삭제하지 못했어요. 다시 시도해 주세요.");
      }
    },
    []
  );

  // ✅ 여기까지 훅 선언 끝 — 아래부터 조건부 렌더 가능
  if (loading) {
    return (
      <View style={[s.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: GridItem; index: number }) => {
    // placeholder
    if (item === PLACEHOLDER) {
      return <View style={s.cardWrapper} />;
    }

    // 마지막 카드 (추가 버튼 역할)
    if (item === LAST_CARD) {
      return (
        <TouchableOpacity
          style={s.cardWrapper}
          activeOpacity={0.85}
          onPress={() => {
            setEditTarget(null);
            setModalVisible(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="규칙 추가하기"
        >
          <Image source={RuleCard3} style={s.ruleImage} resizeMode="contain" />
          {/* 중앙 오버레이 라벨 */}
          <View style={s.centerLabelWrap} pointerEvents="none">
            <Text style={s.centerAddLabel}>+규칙추가하기</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // 일반 규칙 카드
    const rule = item as RuleItem;

    // 지그재그 배치 계산
    const idxInRules = rules.findIndex((r) => r.id === rule.id);
    const visualIndex = idxInRules >= 0 ? idxInRules : index;
    const row = Math.floor(visualIndex / 2);
    const col = visualIndex % 2;
    const imgSource = (row + col) % 2 === 0 ? RuleCard1 : RuleCard2;

    const ordinal = visualIndex + 1;
    const ruleNo = String(ordinal).padStart(2, "0");

    const isMenuOpen = menuOpenId === rule.id;

    return (
      <View style={s.cardWrapper}>
        <Image
          source={imgSource ?? RuleCard1}
          style={s.ruleImage}
          resizeMode="contain"
        />

        {/* 메뉴 버튼 */}
        <TouchableOpacity
          style={s.menuBtn}
          onPress={() => setMenuOpenId((cur) => (cur === rule.id ? null : rule.id))}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityRole="button"
          accessibilityLabel="규칙 메뉴 열기"
        >
          {Vector ? (
            <Image source={Vector} style={s.menuIcon} resizeMode="contain" />
          ) : (
            <Text style={{ fontSize: 18 }}>⋯</Text>
          )}
        </TouchableOpacity>

        {/* 드롭다운 메뉴 */}
        {isMenuOpen && (
          <View style={s.menuDropdown}>
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => {
                setMenuOpenId(null);
                setEditTarget(rule);
                setModalVisible(true);
              }}
            >
              <Text style={s.menuText}>수정하기</Text>
            </TouchableOpacity>
            <View style={s.menuDivider} />
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => {
                Alert.alert("삭제", "정말 삭제하시겠어요?", [
                  { text: "취소", style: "cancel" },
                  { text: "삭제", style: "destructive", onPress: () => handleDeleteRule(rule.id) },
                ]);
              }}
            >
              <Text style={[s.menuText, { color: "#D11" }]}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 텍스트 오버레이 */}
        <View style={s.overlay}>
          <Text style={s.ruleNo}>{String(ruleNo)}</Text>
          <Text style={s.ruleTitle} numberOfLines={1}>{String(rule?.title ?? "")}</Text>
          <Text style={s.ruleContent} numberOfLines={3}>{String(rule?.content ?? "")}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={s.screen}>
      {/* 좌측 정렬 헤더 */}
      <View style={s.heroWrap}>
        <Text style={s.heroLine}>규칙은 딱 필요한 만큼만,</Text>
        <Text style={s.heroLine}>서로 편하게</Text>
      </View>

      <View style={s.gridContainer}>
        <FlatList
          data={gridData}
          renderItem={renderItem}
          keyExtractor={(item) => {
            if (item === PLACEHOLDER) return "placeholder";
            if (item === LAST_CARD) return "last";
            const id = (item as RuleItem)?.id;
            return typeof id === "number" ? `rule-${id}` : `rule-temp`;
          }}
          numColumns={2}
          columnWrapperStyle={s.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          onScrollBeginDrag={() => setMenuOpenId(null)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>

      {/* 규칙 추가/수정 모달 */}
      <RuleAddModal
        visible={modalVisible}
        mode={isEditing ? "edit" : "create"}
        initialTitle={editTarget?.title ?? ""}
        initialBody={editTarget?.content ?? ""}
        onClose={() => {
          setModalVisible(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmitRule}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 헤더 좌측 정렬 + 그리드 폭과 동일하게
  heroWrap: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 16,
    alignItems: "flex-start",
  },
  heroLine: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
  },

  gridContainer: {
    flex: 1,
    width: "90%",
    marginHorizontal: "5%",
    paddingVertical: 10,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: -35,
  },

  menuIcon: {
    width: 18,
    height: 18,
  },

  cardWrapper: {
    width: "49.2%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  ruleImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 25,
  },

  ruleNo: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },

  ruleTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },

  ruleContent: {
    fontSize: 12,
    lineHeight: 18,
    color: "#333",
  },

  centerLabelWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  centerAddLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(153, 153, 153, 1)",
    textAlign: "center",
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },

  menuBtn: {
    position: "absolute",
    top: 16,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  menuDropdown: {
    position: "absolute",
    top: 44,
    right: 8,
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#222",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 4,
  },
});
