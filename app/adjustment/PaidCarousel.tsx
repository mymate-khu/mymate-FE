import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";
import ReceiptImage from "@/assets/image/adjustmenticon/receipt_image.svg";

export type PaidItem = {
  id: string;
  title: string;
  amount: string;  // "-₩12,500"
  color?: "yellow" | "purple";
  image?: any;     // 이미지가 있으면 <Image>로, 없으면 영수증 SVG
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
        const isYellow = item.color !== "purple";
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressItem?.(item)}
            style={[styles.card, isYellow ? styles.cardYellow : styles.cardPurple]}
          >
            <View style={[styles.iconBox, isYellow ? styles.iconYellow : styles.iconPurple]}>
              <ShopbagIcon width={28} height={28} />
            </View>

            {/* 이미지/영수증 */}
            <View style={styles.imageWrap}>
              {item.image ? (
                <Image source={item.image} style={styles.image} />
              ) : (
                <ReceiptImage width="100%" height="100%" />
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
  },
  image: { width: "100%", height: "100%" },

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