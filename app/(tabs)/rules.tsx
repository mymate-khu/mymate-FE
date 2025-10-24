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

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<RuleItem | null>(null); // 수정 타겟
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);   // 열린 메뉴의 카드 id

  const isEditing = !!editTarget;

  // 규칙 목록 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await TokenReq.get("/api/rulebooks");
        const list: RuleItem[] = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (mounted) setRules(list);
      } catch (e) {
        console.error("규칙 로드 실패", e);
        if (mounted) setRules([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
          // ✅ 수정
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

        // ✅ 생성
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

    // rules 배열 내 위치(= 그리드 내 시각적 인덱스) → 지그재그용 행/열 계산
    const idxInRules = rules.findIndex((r) => r.id === rule.id);
    const visualIndex = idxInRules >= 0 ? idxInRules : index; // 안전망
    const row = Math.floor(visualIndex / 2);
    const col = visualIndex % 2;

    // ✅ 체커보드(지그재그) 규칙: (row + col) 짝/홀에 따라 카드 배경 선택
    const imgSource = (row + col) % 2 === 0 ? RuleCard1 : RuleCard2;

    const ordinal = visualIndex + 1;
    const ruleNo = String(ordinal).padStart(2, "0"); // 01, 02, ...

    const isMenuOpen = menuOpenId === rule.id;

    return (
      <View style={s.cardWrapper}>
        <Image source={imgSource} style={s.ruleImage} resizeMode="contain" />

        {/* 메뉴 버튼 (Vector 아이콘) */}
        <TouchableOpacity
          style={s.menuBtn}
          onPress={() => setMenuOpenId((cur) => (cur === rule.id ? null : rule.id))}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityRole="button"
          accessibilityLabel="규칙 메뉴 열기"
        >
          <Image source={Vector} style={s.menuIcon} resizeMode="contain" />
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
          <Text style={s.ruleNo}>{ruleNo}</Text>
          <Text style={s.ruleTitle} numberOfLines={1}>{rule.title}</Text>
          <Text style={s.ruleContent} numberOfLines={3}>{rule.content}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[s.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <View style={s.hero}>
        <Text style={s.heroLine}>규칙은 딱 필요한 만큼만,</Text>
        <Text style={s.heroLine}>서로 편하게</Text>
      </View>

      <View style={s.gridContainer}>
        <FlatList
          data={gridData}
          renderItem={renderItem}
          keyExtractor={(item, i) => {
            if (item === PLACEHOLDER) return `placeholder-${i}`;
            if (item === LAST_CARD) return `last-${i}`;
            return `rule-${(item as RuleItem).id}-${i}`;
          }}
          numColumns={2}
          columnWrapperStyle={s.row}
          onScrollBeginDrag={() => setMenuOpenId(null)} // 스크롤 시작 시 메뉴 닫기
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
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
  hero: {
    marginVertical: 16,
    alignItems: "center",
  },
  heroLine: {
    fontSize: 20,
    fontWeight: "600",
  },

  gridContainer: {
    flex: 1,
    width: "90%",
    marginHorizontal: "5%",
    paddingVertical: 10,
  },

  // 카드 행: 퍼즐 겹침 효과
  row: {
    justifyContent: "space-between",
    marginBottom: -35,
  },

  // 메뉴 아이콘
  menuIcon: {
    width: 18,
    height: 18,
  },

  // 카드 컨테이너
  cardWrapper: {
    width: "49.2%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // 카드 배경 이미지 (퍼즐 PNG)
  ruleImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  // 텍스트 오버레이
  overlay: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 25,
  },

  // 번호(01, 02...)
  ruleNo: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },

  // 제목
  ruleTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },

  // 내용
  ruleContent: {
    fontSize: 12,
    lineHeight: 18,
    color: "#333",
  },

  // 마지막 카드 중앙 라벨
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

  // 메뉴 버튼 (흰 원 배경 제거 + 위쪽 여유)
  menuBtn: {
    position: "absolute",
    top: 16,         // 위쪽 마진
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(255,255,255,0.75)", // 제거
  },

  // 드롭다운
  menuDropdown: {
    position: "absolute",
    top: 44,         // 버튼 위치에 맞춰 드롭다운 위치 조정
    right: 8,
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
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
