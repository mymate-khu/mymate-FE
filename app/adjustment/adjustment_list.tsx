// app/adjustment/adjustment_list.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

import SearchBlackIcon from "@/assets/image/adjustmenticon/searchblack_Icon.svg";
import DropDownIcon from "@/assets/image/adjustmenticon/dropdown_Icon.svg";

import BackHeader from "@/components/BackHeader"; // ✅ 공용 헤더 추가
import AdjustmentListStack from "./AdjustmentListStack";
import type { SettlementStatus, AdjustmentCardItem } from "./AdjustmentListCard";

import { fetchAccounts, deleteAccount } from "@/components/apis/account";
import { storage } from "@/components/apis/storage";
import { transformToListItems } from "@/utils/transformer";

const formatKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdjustmentList() {
  const monthLabel = "2025년 10월";

  const [items, setItems] = useState<(AdjustmentCardItem & { status: SettlementStatus })[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalReceive, setTotalReceive] = useState(0);

  const load = useCallback(async () => {
    try {
      const myIdStr = await storage.getItem("userId");
      const myId = Number(myIdStr || 0);

      const page = await fetchAccounts(); // AccountsPage
      const accounts = page?.accounts ?? [];

      const mapped = transformToListItems(accounts, myId);
      setItems(mapped);

      const sum = accounts.reduce((acc: number, a: any) => acc + (Number(a?.receiveAmount) || 0), 0);
      setTotalReceive(sum);
    } catch (err) {
      console.error("[정산 리스트 불러오기 실패]", err);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChangeStatus = (id: string, next: SettlementStatus) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: next } : it)));
  };

  const handleEdit = (id: string) => {
    router.push(`/adjustment/adjustment_edit?accountId=${id}`);
  };



    // 🗑️ 삭제: 서버 삭제 후 자동 갱신(서버 재조회)
  /*const handleDelete = (id: string) => {
    Alert.alert("삭제 확인", "정말 이 정산을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const accountId = Number(id);
            if (!Number.isFinite(accountId)) {
              console.warn("[DELETE] invalid id:", id);
              Alert.alert("삭제 실패", "삭제 대상 ID가 올바르지 않습니다.");
              return;
            }

            await deleteAccount(accountId); // 서버 삭제
            await load();                   // ✅ 즉시 서버와 동기화(자동 갱신)
            Alert.alert("삭제 완료", "정산이 삭제되었습니다.");
          } catch (err: any) {
            console.error("[정산 삭제 실패]", err);
            Alert.alert("삭제 실패", err?.message || "정산 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };
  */





  const handleDelete = async (id: string) => {
    console.log("[STACK onDelete]", id);
    if (typeof window !== "undefined") {
      const ok = confirm("정말 삭제하시겠습니까?");
      if (!ok) return;
    }

    try {
      const accountId = Number(id);
      if (!Number.isFinite(accountId)) {
        console.warn("[DELETE] invalid id:", id);
        return;
      }

      await deleteAccount(accountId);
      await load();
      alert("삭제 완료!");
    } catch (err: any) {
      alert("삭제 실패: " + (err?.message || "오류 발생"));
    }
  };

  const onPressMonth = () => console.log("open month picker");
  const onPressSearch = () => console.log("go search");

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* ✅ 공용 백헤더 사용 */}
      <BackHeader
        backgroundColor="#F8F8F8"
        centerSlot={
          <TouchableOpacity style={s.monthButton} onPress={onPressMonth} activeOpacity={0.7}>
            <Text style={s.monthText}>{monthLabel}</Text>
            <DropDownIcon width={24} height={24} />
          </TouchableOpacity>
        }
        rightSlot={
          <TouchableOpacity
            onPress={onPressSearch}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SearchBlackIcon width={20} height={20} />
          </TouchableOpacity>
        }
      />

      {/* Total */}
      <View style={s.revenueBox}>
        <Text style={s.revenueLabel}>Total Revenue</Text>
        <Text style={s.revenueAmount}>{formatKRW(totalReceive)}</Text>
      </View>

      {/* 리스트 */}
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD51C" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <AdjustmentListStack
          items={items}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEdit}
          onDelete={(id) => {
            console.log("[STACK onDelete]", id);
            handleDelete(id);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- 스타일 ---------- */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },

  monthButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  monthText: { fontSize: 18, fontWeight: "500", color: "#111" },

  revenueBox: { paddingHorizontal: 24, marginBottom: 25, marginTop: 15 },
  revenueLabel: { fontSize: 18, color: "#707070", fontWeight: "600", marginBottom: 8 },
  revenueAmount: { fontSize: 32, fontWeight: "500", color: "#111", letterSpacing: 0.5 },
});