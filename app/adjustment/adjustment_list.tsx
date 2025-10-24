// app/adjustment/adjustment_list.tsx
import React, { useMemo } from "react";
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

import BackHeader from "@/components/BackHeader";
import AdjustmentListStack from "./AdjustmentListStack";
import type { SettlementStatus, AdjustmentCardItem } from "./AdjustmentListCard";

import { useAccounts, useDeleteAccount, useSetAccountStatus } from "@/hooks/useAccounts";
import type { AccountStatus } from "@/components/apis/account";

const formatKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdjustmentList() {
  const monthLabel = "2025년 10월";

  const { data, isLoading, refetch, isRefetching } = useAccounts();
  const listItems = (data?.listItems ?? []) as (AdjustmentCardItem & {
    status: SettlementStatus;
  })[];

  const totalReceive = useMemo(() => {
    const accs = data?.page.accounts ?? [];
    return accs.reduce((sum, a) => sum + (Number(a?.receiveAmount) || 0), 0);
  }, [data]);

  const del = useDeleteAccount();
  const setStatus = useSetAccountStatus();

  const onRefresh = () => refetch();

  // 화면 타입 → 서버 타입 매핑
  // 화면 타입 → 서버 타입 매핑 (타입 경고 없이 안전하게)
  const toAccountStatus = (s: SettlementStatus): AccountStatus =>
    (s as unknown as string) === "settled" ? "COMPLETED" : "PENDING";

  const handleChangeStatus = (id: string, next: SettlementStatus) => {
    const accountId = Number(id);
    const to = toAccountStatus(next);

    console.log("[정산상태 변경 요청]", { accountId, to }); // ✅ 요청 로그

    setStatus.mutate(
      { id: accountId, status: to },
      {
        onSuccess: (res) => {
          console.log("[정산상태 변경 성공]", res); // ✅ 성공 응답 확인
          refetch(); // UI 강제 갱신
        },
        onError: (e: any) => {
          console.log("[정산상태 변경 실패]", e?.response?.data || e);
          Alert.alert("오류", e?.message || "상태 변경 중 문제가 발생했어요.");
        },
      }


    );
  };



  const handleEdit = (id: string) => {
    router.push(`/adjustment/adjustment_edit?accountId=${id}`);
  };

  const handleDelete = (id: string) => {
    Alert.alert("삭제 확인", "정말 이 정산을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () =>
          del.mutate(Number(id), {
            onSuccess: () => Alert.alert("삭제 완료", "정산이 삭제되었습니다."),
            onError: (e: any) =>
              Alert.alert("삭제 실패", e?.message || "정산 삭제 중 오류가 발생했습니다."),
          }),
      },
    ]);
  };

  const onPressMonth = () => console.log("open month picker");
  const onPressSearch = () => console.log("go search");

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isLoading}
            onRefresh={onRefresh}
            tintColor="#FFD51C"
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <AdjustmentListStack
          items={listItems}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },

  monthButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  monthText: { fontSize: 18, fontWeight: "500", color: "#111" },

  revenueBox: { paddingHorizontal: 24, marginBottom: 25, marginTop: 15 },
  revenueLabel: { fontSize: 18, color: "#707070", fontWeight: "600", marginBottom: 8 },
  revenueAmount: { fontSize: 32, fontWeight: "500", color: "#111", letterSpacing: 0.5 },
});