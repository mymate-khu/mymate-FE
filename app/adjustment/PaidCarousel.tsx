import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";
import TagIcon from "@/assets/image/adjustmenticon/tag_Icon.svg";
import TicketIcon from "@/assets/image/adjustmenticon/ticket_Icon.svg";
import CutleryIcon from "@/assets/image/adjustmenticon/cutlery_Icon.svg";
import CarIcon from "@/assets/image/adjustmenticon/car_Icon.svg";
import HouseIcon from "@/assets/image/adjustmenticon/house_Icon.svg";

export type PaidItem = {
  id: string;
  title: string;
  amount: string;  // "-₩12,500"
  color?: "yellow" | "purple";
  image?: any;     // 이미지가 있으면 <Image>로, 없으면 영수증 SVG
  category?: string;
};

const CATEGORY_ICON: Record<string, React.ComponentType<{ width: number; height: number }>> = {
  식비: CutleryIcon,
  생활: ShopbagIcon,
  쇼핑: TagIcon,
  "교통/차량": CarIcon,
  "주거/관리비": HouseIcon,
  "문화/여가": TicketIcon,
};

export default function PaidCarousel({
  data,
  onPressMore,
  onPressItem,
}: {
  data: PaidItem[];
  onPressMore?: (item: PaidItem) => void;
  onPressItem?: (item: PaidItem) => void;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(x) => x.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={280 + 14}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 0 }}
      ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
      renderItem={({ item }) => {
        // 디버깅: PaidCarousel에서 받은 데이터 확인
        console.log("PaidCarousel - 받은 데이터:", {
          id: item.id,
          title: item.title,
          color: item.color,
          amount: item.amount,
          category: item.category
        });
        
        const isYellow = item.color !== "purple";
        const IconForCat = CATEGORY_ICON[item.category ?? ""] ?? ShopbagIcon;
        console.log("PaidCarousel - isYellow:", isYellow, "color:", item.color, "category:", item.category);
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressItem?.(item)}
            style={[styles.card, isYellow ? styles.cardYellow : styles.cardPurple]}
          >
            <View style={[styles.iconBox, isYellow ? styles.iconYellow : styles.iconPurple]}>
              <IconForCat width={28} height={28} />
            </View>

            {/* 이미지/영수증 */}
            <View style={styles.imageWrap}>
              {item.image ? (
                <Image source={item.image} style={styles.image} />
              ) : (
                <Text style={styles.noImageText}>이미지{"\n"}없음</Text>
              )}
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.amount}>{item.amount}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onPressMore?.(item)}
              style={styles.moreBtn}
            >
              <Text style={styles.moreText}>더보기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: 164,
    height: 320,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardYellow: { backgroundColor: "#FFE500" },
  cardPurple: { backgroundColor: "#D8B6FF" },

  iconBox: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  },
  iconYellow: { backgroundColor: "#FFD51C" },
  iconPurple: { backgroundColor: "#C188FF" },

  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  noImageText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
  },

  title: { fontSize: 14, color: "#000", marginBottom: 6 },
  amount: { fontSize: 16, color: "#000", fontWeight: "600" },

  moreBtn: {
    marginTop: 12,
    height: 32,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: { fontSize: 12, color: "#111", fontWeight: "600" },
});