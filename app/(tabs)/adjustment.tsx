// app/adjustment/adjustment.tsx
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import SearchIcon from "@/assets/image/adjustmenticon/search_Icon.svg";
import AdjustIllustration from "@/assets/image/adjustmenticon/adjustment_Illustration.svg";
import UnpaidCarousel from "../adjustment/UnpaidCarousel";
import PaidCarousel from "../adjustment/PaidCarousel";

// ✅ 공용 훅 사용
import { useAccounts } from "@/hooks/useAccounts";

export default function Adjustment() {
  const { data } = useAccounts();
  const paidData = data?.paid ?? [];
  const unpaidData = data?.unpaid ?? [];

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.searchBox}
          activeOpacity={0.85}
          onPress={() => router.push("/adjustment/adjustment_search")}
        >
          <SearchIcon style={s.searchIcon} />
          <TextInput
            placeholder="검색어를 입력하세요."
            placeholderTextColor="#767676"
            style={s.searchInput}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={s.addBtn}
          onPress={() => router.push("/adjustment/adjustment_add")}
        >
          <Text style={s.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 인포 박스 */}
      <View style={s.infoBox}>
        <View style={s.infoTextBox}>
          <Text style={s.infoTitle}>정산 상태를 확인하고,{`\n`}지출 내역을 살펴보세요</Text>
          <Text style={s.infoSub}>누가 얼마 냈는지, 헷갈릴 틈 없게</Text>
        </View>
        <View style={s.infoImageBox}>
          <AdjustIllustration width={115} height={113} />
        </View>
      </View>

      {/* 섹션: 미정산 */}
      <View style={s.sectionBox}>
        <View style={s.sectionHeader}>
          <Text style={s.title}>아직 정산되지 않은 항목이 {unpaidData.length}건 있어요</Text>
        </View>
        <UnpaidCarousel
          data={unpaidData}
          onPressItem={(item) => console.log("unpaid press:", item)}
        />
      </View>

      {/* 섹션: 정산내역 */}
      <View style={s.sectionBox}>
        <View style={s.sectionHeader}>
          <Text style={s.title}>정산내역</Text>
          <TouchableOpacity
            onPress={() => router.push("/adjustment/adjustment_list")}
            style={s.moreWrap}
          >
            <Text style={s.moreLink}>더보기</Text>
            <ChevronRight size={16} color="#707070" />
          </TouchableOpacity>
        </View>
        <PaidCarousel
          data={paidData}
          onPressItem={(item) => console.log("paid press:", item)}
          onPressMore={() => router.push("/adjustment/adjustment_list")}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 8,
  },
  searchIcon: { width: 20, height: 20 },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: "#111",
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE600",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 26, lineHeight: 26, color: "#111" },

  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    height: 124,
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
  },
  infoTextBox: { flex: 1, marginHorizontal: 10 },
  infoTitle: { fontSize: 19, fontWeight: "600", color: "#000" },
  infoSub: { fontSize: 13, color: "#797979", marginTop: 8 },
  infoImageBox: {
    width: 115,
    height: 113,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sectionBox: { marginTop: 35, marginHorizontal: 24 },
  sectionHeader: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  title: { fontSize: 16, fontWeight: "700", color: "#111" },
  moreLink: { fontSize: 14, color: "#707070" },
});