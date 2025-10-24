import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";
import CheckIcon from "@/assets/image/adjustmenticon/check_Icon.svg";

export type UnpaidItem = {
  id: string;
  title: string;
  amount: string; // "-₩21,000"
};

export default function UnpaidCarousel({
  data,
  onPressItem,
}: {
  data: UnpaidItem[];
  onPressItem?: (item: UnpaidItem) => void;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(x) => x.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={354 + 12} // 카드폭 + 간격
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 0 }}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.iconBoxYellow}>
            <ShopbagIcon width={28} height={28} />
          </View>

          <View style={styles.itemTextBox}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemAmount}>{item.amount}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPressItem?.(item)}
            style={styles.checkIconBox}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CheckIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: 354,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE500",
    borderRadius: 16,
    padding: 16,
  },
  iconBoxYellow: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: "#FFD51C",
    alignItems: "center", justifyContent: "center",
  },
  itemTextBox: { flex: 1, marginHorizontal: 16 },
  itemTitle: { fontSize: 14, color: "#000" },
  itemAmount: { fontSize: 14, color: "#000", marginTop: 8 },
  checkIconBox: {
    width: 40, height: 40, borderRadius: 18,
    backgroundColor: "#FFD51C",
    alignItems: "center", justifyContent: "center",
  },
});