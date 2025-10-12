import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";

import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";
import SearchBlackIcon from "@/assets/image/adjustmenticon/searchblack_Icon.svg";
import DropDownIcon from "@/assets/image/adjustmenticon/dropdown_Icon.svg";

import AdjustmentListStack from "./AdjustmentListStack";
import { SettlementStatus, AdjustmentCardItem } from "./AdjustmentListCard";

const formatKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n);

export default function AdjustmentList() {
  const monthLabel = "2025년 07월";

  // 데모 데이터
  const [items, setItems] = useState<(AdjustmentCardItem & { status: SettlementStatus })[]>([
    {
      id: "a1",
      title: "휴지",
      dateLabel: "25.07.24",
      prevAmount: "-₩21,000",
      finalAmount: "₩10,500",
      imageUri: "https://picsum.photos/800/500",
      avatars: ["https://picsum.photos/200", "https://picsum.photos/201", "https://picsum.photos/202"],
      status: "todo",
    },
    {
      id: "a2",
      title: "섬유유연제",
      dateLabel: "25.07.22",
      prevAmount: "-₩25,000",
      finalAmount: "₩12,500",
      imageUri: "https://picsum.photos/801/500",
      avatars: ["https://picsum.photos/210", "https://picsum.photos/211", "https://picsum.photos/212"],
      status: "done",
    },
    {
      id: "a3",
      title: "전기세",
      dateLabel: "25.07.20",
      prevAmount: "-₩195,500",
      finalAmount: "₩97,750",
      imageUri: "https://picsum.photos/802/500",
      avatars: ["https://picsum.photos/220", "https://picsum.photos/221", "https://picsum.photos/222", "https://picsum.photos/223"],
      status: "done",
    },
  ]);

  const onPressBack = () => router.back();
  const onPressMonth = () => console.log("open month picker");
  const onPressSearch = () => console.log("go search");

  const handleChangeStatus = (id: string, next: SettlementStatus) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: next } : it)));
  };
  const handleEdit = (id: string) => console.log("edit", id);
  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity onPress={onPressBack} style={s.iconLeft} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
          <ArrowLeftIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity style={s.monthButton} onPress={onPressMonth} activeOpacity={0.7}>
          <Text style={s.monthText}>{monthLabel}</Text>
          <DropDownIcon width={16} height={16} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSearch} style={s.iconRight} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
          <SearchBlackIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Total Revenue */}
      <View style={s.revenueBox}>
        <Text style={s.revenueLabel}>Total Revenue</Text>
        <Text style={s.revenueAmount}>{formatKRW(230000)}</Text>
      </View>

      {/* 카드 스택 */}
      <AdjustmentListStack
        items={items}
        onChangeStatus={handleChangeStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: { height: 56, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  iconLeft: { position: "absolute", left: 16, height: 56, justifyContent: "center" },
  iconRight: { position: "absolute", right: 16, height: 56, justifyContent: "center" },
  monthButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  monthText: { fontSize: 18, fontWeight: "600", color: "#111" },
  revenueBox: { paddingHorizontal: 24, marginBottom: 25, marginTop: 15 },
  revenueLabel: { fontSize: 18, color: "#707070", fontWeight: "600", marginBottom: 8 },
  revenueAmount: { fontSize: 32, fontWeight: "500", color: "#111", letterSpacing: 0.5 },
});