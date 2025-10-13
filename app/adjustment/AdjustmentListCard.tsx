// app/adjustment/AdjustmentListCard.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import DetailIcon from "@/assets/image/adjustmenticon/detail_Icon.svg";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";

export type SettlementStatus = "done" | "todo";

export type AdjustmentCardItem = {
  id: string;
  title: string;
  dateLabel: string;     // "25.07.24"
  prevAmount?: string;   // "-₩21,000"
  finalAmount: string;   // "₩10,500"
  imageUri?: string;     // 하단 썸네일
  avatars?: string[];    // 아바타 URL 배열
};

export type AdjustmentListCardProps = {
  item: AdjustmentCardItem;
  status: SettlementStatus;
  onChangeStatus?: (id: string, next: SettlementStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMenuOpenChange?: (id: string, open: boolean) => void; // ✅ 추가
};

const AVATAR = 40;

/** 외곽 그라데이션 아바타 */
export function GradientAvatar({ uri }: { uri: string }) {
  return (
    <LinearGradient
      colors={["#FFE81C", "#EBD29C", "#DDC2FA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={ga.ring}
    >
      <View style={ga.hole}>
        <Image source={{ uri }} style={ga.img} />
      </View>
    </LinearGradient>
  );
}

const ga = StyleSheet.create({
  ring: { width: AVATAR + 2, height: AVATAR + 2, borderRadius: (AVATAR + 2) / 2, padding: 1 },
  hole: { flex: 1, borderRadius: AVATAR / 2, backgroundColor: "#fff", overflow: "hidden" },
  img: { width: "100%", height: "100%", borderRadius: AVATAR / 2 },
});

export default function AdjustmentListCard({
  item,
  status,
  onChangeStatus,
  onEdit,
  onDelete,
}: AdjustmentListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <View style={[s.card, menuOpen && s.cardElevated]}>
      {/* 상단 */}
      <View style={s.topRow}>
        <View style={s.iconBoxYellow}>
          <ShopbagIcon width={28} height={28} />
        </View>

        {/* 아바타들 */}
        <View style={s.avatars}>
          {(item.avatars ?? []).slice(0, 4).map((uri, idx) => (
            <View key={`${uri}-${idx}`} style={{ marginLeft: idx === 0 ? 0 : -5 }}>
              <GradientAvatar uri={uri} />
            </View>
          ))}
        </View>

        {/* 상태 배지 + 더보기 */}
        <View style={s.topRight}>
          <View
            style={[
              s.badge,
              status === "done"
                ? { backgroundColor: "#FFD51C", borderColor: "#FFD51C" }
                : { backgroundColor: "#FFD51C", borderColor: "#FFD51C" },
            ]}
          >
            <Text style={s.badgeText}>{status === "done" ? "정산 완료" : "정산 미완료"}</Text>
          </View>

          <TouchableOpacity
            style={s.detailDot}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setMenuOpen(v => !v)}
          >
            <DetailIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 중앙 텍스트 */}
      <View style={s.middle}>
        <View>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.date}>{item.dateLabel}</Text>
        </View>

        <View style={s.amounts}>
          {!!item.prevAmount && <Text style={s.prevAmount}>{item.prevAmount}</Text>}
          <Text style={s.finalAmount}>{item.finalAmount}</Text>
        </View>
      </View>

      {/* 하단 이미지 */}
      {!!item.imageUri && (
        <View style={s.bottomImageBox}>
          <Image source={{ uri: item.imageUri }} style={s.bottomImage} />
        </View>
      )}

      {/* 메뉴 오버레이 */}
      {menuOpen && (
        <>
          {/* 배경 터치 시 닫힘 */}
          <TouchableOpacity style={s.menuBackdrop} activeOpacity={1} onPress={closeMenu} />

          {/* 메뉴 (항상 맨 위) */}
          <View style={s.menuWrap} pointerEvents="box-none">
            <BlurView
              intensity={30}
              tint="light"
              style={[s.menu, { backgroundColor: "rgba(255, 255, 255, 0.54)" }]}
            >
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  onChangeStatus?.(item.id, "done");
                  closeMenu();
                }}
              >
                <Text style={s.menuItemText}>정산 완료</Text>
              </TouchableOpacity>
              <View style={s.menuDivider} />
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  onChangeStatus?.(item.id, "todo");
                  closeMenu();
                }}
              >
                <Text style={s.menuItemText}>정산 미완료</Text>
              </TouchableOpacity>
              <View style={s.menuDivider} />
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  onEdit?.(item.id);
                  closeMenu();
                }}
              >
                <Text style={s.menuItemText}>수정</Text>
              </TouchableOpacity>
              <View style={s.menuDivider} />
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  onDelete?.(item.id);
                  closeMenu();
                }}
              >
                <Text style={s.menuItemText}>삭제</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#FFE300",
    height: 340,
    borderRadius: 24,
    padding: 8,
    position: "relative",   // 오버레이 기준
    overflow: "visible",
    borderWidth: 1,
    borderColor: "#FFD51C",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 4,
  },
  // 메뉴 열릴 때 카드 자체도 최상단으로
  cardElevated: {
    zIndex: 1000,   // iOS
    elevation: 40,  // Android
  },

  topRow: { flexDirection: "row", alignItems: "center" },
  iconBoxYellow: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: "#FFD51C", alignItems: "center", justifyContent: "center",
  },
  avatars: { flexDirection: "row", marginLeft: 12, flex: 1 },
  topRight: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 8 },
  badge: { paddingHorizontal: 12, height: 32, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  badgeText: { fontSize: 12, color: "#111" },
  detailDot: {},

  /* 메뉴 레이어들 */
  menuBackdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
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
    top: 52,
    right: 8,
    width: 142,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 60,     // 안드로이드에서 진짜 위로
    overflow: "hidden",
  },
  menuItem: { height: 44, paddingHorizontal: 18, justifyContent: "center" },
  menuItemText: { fontSize: 16, color: "#111", textAlign: "right" },
  menuDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#a8a8a8ff" },

  /* 중앙 */
  middle: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", padding: 8 },
  title: { fontSize: 16, fontWeight: "500", color: "#111" },
  date: { marginTop: 4, fontSize: 12, color: "#707070" },
  amounts: { marginTop: 5, alignItems: "flex-end" },
  prevAmount: { fontSize: 12, color: "#707070" },
  finalAmount: { fontSize: 20, fontWeight: "400", color: "#111" },

  /* 하단 이미지 */
  bottomImageBox: { marginTop: 5, borderRadius: 16, overflow: "hidden" },
  bottomImage: { width: "100%", aspectRatio: 16 / 9 },
});