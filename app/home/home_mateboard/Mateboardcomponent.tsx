import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Mypuzzle from "@/assets/image/homepage_puzzleimg/Mypuzzle.svg";
import Matepuzzle from "@/assets/image/homepage_puzzleimg/Matepuzzle.svg";
import ChevronRight from "@/assets/image/homepage_puzzleimg/chevron-right.svg";

export default function MateboardComponent() {
  return (
    <View>
      <View style={{ marginBottom: 10,marginTop:10 }}>
        <Text style={s.title}>MATE BOARD</Text>
      </View>

      <View style={s.puzzleRow}>
        {/* 왼쪽 퍼즐 */}
        <View style={[s.cell, { width: "51%" }]}>
          <Mypuzzle width="100%" height="100%" viewBox="0 0 193 124" pointerEvents="none" />

          <View style={s.overlay} pointerEvents="box-none">
            <Text style={s.label}>Me</Text>
            <TextInput
              style={s.memoInput}
              placeholder="내용을 입력해주세요..."
              placeholderTextColor="#888"
              multiline
            />
          </View>
        </View>

        {/* 오른쪽 퍼즐 */}
        <View style={[s.cell, { width: "55%", marginLeft: -26 }]}>
          <Matepuzzle width="100%" height="100%" viewBox="0 0 209 124" pointerEvents="none" />

          <View style={s.overlay} pointerEvents="box-none">
            {/* 클릭 가능한 Chevron */}
            <TouchableOpacity
              onPress={() => router.push("/home/home_mateboard/Mateboardpage")}
              style={s.chevron}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            >
              <ChevronRight width={20} height={20} />
            </TouchableOpacity>

            <Text style={[s.label, { left: 16 }]}>Mate</Text>
            <Text style={[s.label, { left: 16, color: "#888", fontSize: 14, fontWeight: "400" }]}>
              {"오늘의 메이트 보드를\n확인해보세요!"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  puzzleRow: {
    flexDirection: "row",
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    position: "relative",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 20,
    top: 20,
    right: 20,
  },
  chevron: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 6,      // 터치 영역 확대
    zIndex: 10,      // iOS/Android 모두
    elevation: 2,    // Android 시각/터치 우선
  },
  label: {
    fontSize: 18,
    fontWeight: "400",
    color: "#111",
    marginBottom: 6,
    fontFamily:"DonerRegularDisplay"
  },
  memoInput: {
    minHeight: 70,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: "transparent",
    fontSize: 14,
  },
  title: {
    fontWeight: "400",
    fontSize: 18,
    fontFamily:"DonerRegularDisplay"
  },
});
