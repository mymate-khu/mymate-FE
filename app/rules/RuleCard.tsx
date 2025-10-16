// app/rules/components/RuleCard.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

import RuleCardMe from "@/assets/image/rules/RuleCardMe.svg";
import RuleCardMate from "@/assets/image/rules/RuleCardMate.svg";
import DetailIcon from "@/assets/image/adjustmenticon/detail_Icon.svg";

type AuthorType = "me" | "mate";

export type RuleCardItem = {
  id: number | string;
  order: number;
  title: string;
  description?: string;
  author: AuthorType;
};

export type RuleCardProps = RuleCardItem & {
  style?: ViewStyle;
  onPress?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
};

export default function RuleCard({
  id,
  order,
  title,
  description,
  author,
  style,
  onPress,
  onEdit,
  onDelete,
}: RuleCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const Bg = author === "me" ? RuleCardMe : RuleCardMate;

  // 카드 안쪽 안전 여백 (SVG 파먹임/둥근 모서리 회피)
  // 필요하면 수치만 살짝 조절하면 됩니다.
  const SAFE = { left: 16, right: 16, top: 20, bottom: 16 };

  return (
    <View style={[s.cardWrap, style,  { width: 183 }]}>
      {/* 배경 SVG (터치 방해 X) */}
      <View style={s.bgWrap} pointerEvents="none">
        <Bg width="100%" height="100%" />
      </View>

      {/* 내용 오버레이: MateboardComponent처럼 absolute로 안전영역에 배치 */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress?.(id)}
        style={[s.content, { left: SAFE.left, right: SAFE.right, top: SAFE.top, bottom: SAFE.bottom }]}
      >
        {/* 상단: 번호 + 더보기 */}
        <View style={s.topRow}>
          <Text style={s.orderText}>{`O${order}`}</Text>

          <TouchableOpacity
            style={s.moreBtn}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setMenuOpen(v => !v)}
          >
            <DetailIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 본문 */}
        <View style={s.body}>
          <Text style={s.title} numberOfLines={2}>{title}</Text>
          {!!description && (
            <Text style={s.desc} numberOfLines={3}>{description}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* 메뉴 오버레이 */}
      {menuOpen && (
        <>
          <TouchableOpacity style={s.menuBackdrop} activeOpacity={1} onPress={closeMenu} />
          <View style={s.menuWrap} pointerEvents="box-none">
            <BlurView intensity={30} tint="light" style={[s.menu, { backgroundColor: "rgba(255,255,255,0.54)" }]}>
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => { onEdit?.(id); closeMenu(); }}
              >
                <Text style={s.menuText}>수정</Text>
              </TouchableOpacity>
              <View style={s.menuDivider} />
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => { onDelete?.(id); closeMenu(); }}
              >
                <Text style={s.menuText}>삭제</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  cardWrap: {
    position: "relative",
    aspectRatio: 0.78, 
    height: 158,    
    overflow: "hidden",     // 텍스트가 바깥으로 새지 않게
    //backgroundColor: "pink",  
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  // 🔥 MateboardComponent처럼 absolute overlay로 안전영역에 텍스트 배치
  content: {
    position: "absolute",
    zIndex: 2,
    height: 90,
    //backgroundColor: "lightyellow",  
  },

  topRow: { flexDirection: "row", alignItems: "center", },
  orderText: { fontSize: 18, fontWeight: "700", color: "#111" },
  moreBtn: { marginLeft: "auto" },

  body: { marginTop: 12,  flex: 1, },
  title: { fontSize: 18, fontWeight: "700", color: "#111",   },
  desc: { marginTop: 8, fontSize: 14, lineHeight: 20, color: "#3E3E3E" },

  // 메뉴
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1200,
    elevation: 50,
  },
  menuWrap: {
    position: "absolute",
    right: 0,
    zIndex: 1300,
    elevation: 60,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  menu: {
    position: "absolute",
    top: 56,
    right: 10,
    width: 132,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  menuItem: { height: 44, paddingHorizontal: 18, justifyContent: "center" },
  menuText: { fontSize: 16, color: "#111", textAlign: "right" },
  menuDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#A8A8A8" },
});