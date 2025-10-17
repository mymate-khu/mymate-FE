import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Modal } from "react-native";
import { router } from "expo-router";

import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";
import SearchIcon from "@/assets/image/adjustmenticon/search_Icon.svg";
import FilterIcon from "@/assets/image/adjustmenticon/filter_Icon.svg";
import TagIcon from "@/assets/image/adjustmenticon/tag_Icon.svg";
import TicketIcon from "@/assets/image/adjustmenticon/ticket_Icon.svg";
import CutleryIcon from "@/assets/image/adjustmenticon/cutlery_Icon.svg";
import CarIcon from "@/assets/image/adjustmenticon/car_Icon.svg";
import HouseIcon from "@/assets/image/adjustmenticon/house_Icon.svg";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";

export default function AdjustmentSearch() {
  const [q, setQ] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const OPTIONS = [
    { key: "food",    label: "식비" },
    { key: "life",    label: "생활" },
    { key: "shop",    label: "쇼핑" },
    { key: "car",     label: "교통/차량" },
    { key: "house",   label: "주거/관리비" },
    { key: "culture", label: "문화/여가" },
  ];
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <SafeAreaView style={s.container}>
      {/* 상단 검색어 창 */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.replace("/adjustment")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>   
          <ArrowLeftIcon width={13} height={13} />
        </TouchableOpacity>


        <View style={s.searchBox}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="검색어를 입력하세요."
            placeholderTextColor="#767676"
            style={s.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => console.log("search:", q)}
            autoFocus={true} // 페이지 열리자마자 키보드 뜸
          />
          <SearchIcon width={20} height={20} />
        </View>
      </View>


      <View style={{ flex: 1 }} />


      {/* 하단 카테고리 필터 버튼 */}
      <View style={s.bottomArea}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={s.filterBtn}
          onPress={() => setFilterOpen(true)}   // 모달 열기
        >
          <FilterIcon width={20} height={20} />
          <Text style={s.filterText}>카테고리 필터</Text>
        </TouchableOpacity>
      </View>


      {/* 카테고리 모달 */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterOpen(false)}
      >
        {/* 흐림 배경 */}
        <TouchableOpacity
          style={s.backdrop}
          activeOpacity={1}
          onPress={() => setFilterOpen(false)}
        />

        {/* 바텀 시트 */}
        <View style={s.sheet}>
          {/* 핸들바 */}
          <View style={s.handle} />

          <Text style={s.sheetTitle}>카테고리</Text>

          {/* 2 x 3 그리드 */}
          <View style={s.grid}>
            {OPTIONS.map(opt => {
              const on = selectedKey === opt.key;

              // 각 key에 맞는 아이콘을 선택
              const renderIcon = () => {
                switch (opt.key) {
                  case "food":    return <CutleryIcon width={48} height={48} />;
                  case "life":    return <ShopbagIcon width={48} height={48} />;
                  case "shop":    return <TagIcon width={48} height={48} />;
                  case "car":     return <CarIcon width={48} height={48} />;
                  case "house":   return <HouseIcon width={48} height={48} />;
                  case "culture": return <TicketIcon width={48} height={48} />;
                  default:        return null;
                }
              };

              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[s.gridItem, on && s.gridItemActive]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedKey(opt.key)}
                >
                  <View style={s.gridIcon}>
                    {renderIcon()}
                
                  </View>
                  <Text style={[s.gridLabel, on && s.gridLabelActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 확인 버튼 */}
          <TouchableOpacity
            style={s.confirmBtn}
            activeOpacity={0.9}
            onPress={() => {
              console.log("selected:", selectedKey);
              setFilterOpen(false);
              // TODO: 선택값을 검색 쿼리/상태로 반영
            }}
          >
            <Text style={s.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F7F7F7" 
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ECECEC",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { 
    flex: 1, 
    color: "#111", 
    fontSize: 14 
  },

  bottomArea: {
    //height: 48,
    paddingHorizontal: 24,
    paddingBottom: 80,
    paddingTop: 8,
    alignItems: "center",
    //backgroundColor: "red",
  },
  filterBtn: {
    height: 48,
    width: 156,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    //shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  filterText: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#111" 
  },

  /* 모달 */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.select({ ios: 28, android: 20 }),
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D5D5D5",
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },

  /* 그리드 */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItem: {
    width: "31%",            // 3열
    aspectRatio: 1,            // 정사각형
    borderRadius: 16,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  gridItemActive: {
    backgroundColor: "#FFE81C",
  },
  gridIcon: {
    width: 48, 
    height: 48, 
    marginBottom: 6,
    alignItems: "center", 
    justifyContent: "center",
  },
  gridLabel: { 
    fontSize: 14, 
    color: "#111", 
    fontWeight: "600" 
  },
  gridLabelActive: { 
    color: "#111" 
  },

  confirmBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFE600",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  confirmText: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#111" 
  },
});