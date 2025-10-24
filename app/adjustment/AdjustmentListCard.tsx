import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";

import DetailIcon from "@/assets/image/adjustmenticon/detail_Icon.svg";
import TagIcon from "@/assets/image/adjustmenticon/tag_Icon.svg";
import TicketIcon from "@/assets/image/adjustmenticon/ticket_Icon.svg";
import CutleryIcon from "@/assets/image/adjustmenticon/cutlery_Icon.svg";
import CarIcon from "@/assets/image/adjustmenticon/car_Icon.svg";
import HouseIcon from "@/assets/image/adjustmenticon/house_Icon.svg";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";
import GradientAvatar from "@/components/GradientAvatar";

// 🔁 통일: settled | unsettled
export type SettlementStatus = "settled" | "unsettled";

export type AdjustmentCardItem = {
  id: string;
  accountId: number; // API 호출을 위한 실제 account ID
  title: string;
  dateLabel: string;
  prevAmount?: string;
  finalAmount: string;
  imageUri?: string;
  avatars?: string[];
  category?: string;
  color?: "yellow" | "purple";
};

export type AdjustmentListCardProps = {
  item: AdjustmentCardItem;
  status: SettlementStatus;
  onChangeStatus?: (id: string, next: SettlementStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMenuOpenChange?: (id: string, open: boolean) => void;
  onMenuPress?: (id: string) => void; // 메뉴 버튼 클릭 시 카드 펼치기용
};

const CATEGORY_ICON: Record<string, React.ComponentType<{ width: number; height: number }>> = {
  식비: CutleryIcon,
  생활: ShopbagIcon,
  쇼핑: TagIcon,
  "교통/차량": CarIcon,
  "주거/관리비": HouseIcon,
  "문화/여가": TicketIcon,
};

const THEME = {
  yellow: { cardBg: "#FFE300", cardBorder: "#FFD51C", chipBg: "#FFD51C" },
  purple: { cardBg: "#D8B6FF", cardBorder: "#C79EFF", chipBg: "#C79EFF" },
} as const;

export default function AdjustmentListCard({
  item,
  status,
  onChangeStatus,
  onEdit,
  onDelete,
  onMenuPress,
}: AdjustmentListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const IconForCat = CATEGORY_ICON[item.category ?? ""] ?? ShopbagIcon;
  const color = item.color ?? "yellow";
  const t = THEME[color];

  return (
    <View style={[s.card, { backgroundColor: t.cardBg, borderColor: t.cardBorder }, menuOpen && s.cardElevated]}>
      {/* 상단 */}
      <View style={s.topRow}>
        <View style={[s.iconBox, { backgroundColor: t.chipBg }]}>
          <IconForCat width={28} height={28} />
        </View>

        <View style={s.avatars}>
          {(item.avatars ?? []).slice(0, 4).map((uri, idx) => (
            <View key={`${uri}-${idx}`} style={{ marginLeft: idx === 0 ? 0 : -5 }}>
              <GradientAvatar uri={uri} size={40} />
            </View>
          ))}
        </View>

        <View style={s.topRight}>
          <View style={[s.badge, { backgroundColor: t.chipBg, borderColor: t.chipBg }]}>
            <Text style={s.badgeText}>{status === "settled" ? "정산 완료" : "정산 미완료"}</Text>
          </View>

          <TouchableOpacity
            style={s.detailDot}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              setMenuOpen(v => !v);
              onMenuPress?.(item.id); // 메뉴 버튼 클릭 시 카드 펼치기
            }}
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

      {/* 이미지 영역: imageUri가 있으면 실제 이미지, 없으면 안내 텍스트 */}
      <View style={s.bottomImageBox}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={s.bottomImage} />
        ) : (
          <Text style={s.noImageText}>이미지가 없습니다</Text>
        )}
      </View>

      {menuOpen && (
        <>
          <TouchableOpacity style={s.menuBackdrop} activeOpacity={1} onPress={closeMenu} />
          <View style={s.menuWrap} pointerEvents="box-none">
            <BlurView intensity={30} tint="light" style={[s.menu, { backgroundColor: "rgba(255, 255, 255, 0.54)" }]}>
              {/* ✅ 완료 → settled */}
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  onChangeStatus?.(item.id, "settled");
                  closeMenu();
                }}
              >
                <Text style={s.menuItemText}>정산 완료</Text>
              </TouchableOpacity>
              <View style={s.menuDivider} />

              {/* ✅ 미완료 → unsettled */}
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  onChangeStatus?.(item.id, "unsettled");
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
    height: 340,
    borderRadius: 24,
    padding: 8,
    position: "relative",
    overflow: "visible",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 4,
  },
  cardElevated: { zIndex: 1000, elevation: 40 },

  topRow: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  avatars: { flexDirection: "row", marginLeft: 12, flex: 1 },
  topRight: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, color: "#111" },
  detailDot: {},

  menuBackdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "transparent", zIndex: 1200, elevation: 50,
  },
  menuWrap: {
    position: "absolute", right: 0, zIndex: 1300, elevation: 60,
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 10 },
  },
  menu: {
    position: "absolute", top: 52, right: 8, width: 142, borderRadius: 14,
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 8 },
    elevation: 60, overflow: "hidden",
  },
  menuItem: { height: 44, paddingHorizontal: 18, justifyContent: "center" },
  menuItemText: { fontSize: 16, color: "#111", textAlign: "right" },
  menuDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#a8a8a8ff" },

  middle: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", padding: 8,
  },
  title: { fontSize: 16, fontWeight: "500", color: "#111" },
  date: { marginTop: 4, fontSize: 12, color: "#707070" },
  amounts: { marginTop: 5, alignItems: "flex-end" },
  prevAmount: { fontSize: 12, color: "#707070" },
  finalAmount: { fontSize: 20, fontWeight: "400", color: "#111" },

  bottomImageBox: { 
    marginTop: 5, 
    borderRadius: 16, 
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    aspectRatio: 16 / 9,
  },
  bottomImage: { width: "100%", height: "100%" },
  noImageText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
  },
});