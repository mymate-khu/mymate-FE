import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";
import SearchIcon from "@/assets/image/adjustmenticon/search_Icon.svg";
import AdjustIllustration from "@/assets/image/adjustmenticon/adjustment_Illustration.svg";
import UnpaidCarousel, { UnpaidItem } from "../adjustment/UnpaidCarousel";
import PaidCarousel, { PaidItem } from "../adjustment/PaidCarousel";

export default function Adjustment() {
  // 데모 데이터
  const UNPAID: UnpaidItem[] = [
    { id: "u1", title: "휴지", amount: "-₩21,000" },
    { id: "u2", title: "주방세제", amount: "-₩8,400" },
  ];
  const PAID: PaidItem[] = [
    { id: "p1", title: "휴지", amount: "-₩21,000", color: "yellow" },
    { id: "p2", title: "섬유유연제", amount: "-₩12,500", color: "purple" },
    { id: "p3", title: "전기요금", amount: "-₩34,700", color: "purple" },
  ];

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

      {/* 미정산 박스 */}
      <View style={s.section}>
        <Text style={s.title}>아직 정산되지 않은 항목이 {UNPAID.length}건 있어요</Text>
        <UnpaidCarousel
          data={UNPAID}
          onPressItem={(item) => console.log("unpaid press:", item)}
        />
      </View>

      {/* 정산내역 박스 */}
      <View style={s.sectionRow}>
        <Text style={s.title}>정산내역</Text>
        <TouchableOpacity onPress={() => router.push("/adjustment/adjustment_list")}>
          <Text style={s.moreLink}>더보기  ›</Text>
        </TouchableOpacity>
      </View>
      <PaidCarousel
        data={PAID}
        onPressItem={(item) => console.log("paid press:", item)}
        onPressMore={(item) => router.push("/adjustment/adjustment_list")}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
    },

  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 24, 
    paddingTop: 8 
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
  searchIcon: {
    width: 20, 
    height: 20 
    },
  searchInput: { 
    flex: 1, 
    height: 48, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    color: "#111" 
    },
  addBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: "#FFE600", 
    alignItems: "center", 
    justifyContent: "center" 
    },
  addBtnText: { 
    fontSize: 26, 
    lineHeight: 26, 
    color: "#111" 
    },

    // 인포 박스
  infoBox: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F0F0", 
    height: 124, 
    borderRadius: 24, 
    padding: 16,
    marginHorizontal: 15, 
    marginTop: 20,
    },
  infoTextBox: { 
    flex: 1, 
    marginHorizontal: 10 
    },
  infoTitle: { 
    fontSize: 19, 
    fontWeight: "600", 
    color: "#000" 
    },
  infoSub: { 
    fontSize: 13, 
    color: "#797979", 
    marginTop: 8 
    },
  infoImageBox: { 
    width: 115, 
    height: 113, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 17  
    },

    // 정산/미정산 박스
  section: { 
    marginTop: 32 
   },
  sectionRow: {
    marginTop: 32, 
    paddingHorizontal: 24,
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    },
  title: { 
    paddingHorizontal: 24, 
    fontSize: 16, 
    fontWeight: "800", 
    marginBottom: 12, 
    color: "#000" 
    },
  moreLink: { 
    fontSize: 16, 
    color: "#9A9A9A" 
    },
});