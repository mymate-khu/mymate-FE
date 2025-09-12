import { View, ScrollView, StyleSheet, Text, Image } from "react-native";
import { router } from "expo-router";
import Union from "@/assets/image/homepage_puzzleimg/Union.svg";

type Data = {
  imgurl: string;
  name: string;
  content: string;
};

const datas: Data[] = [
  { imgurl: "", name: "홍길동", content: "화장실 청소" },
  { imgurl: "", name: "홍길동", content: "화장실 청소" },
  { imgurl: "", name: "홍길동", content: "화장실 청소" },
  { imgurl: "", name: "홍길동", content: "화장실 청소" },
  { imgurl: "", name: "홍길동", content: "화장실 청소" },
  { imgurl: "", name: "홍길동", content: "화장실 청소" },
];

export default function MyPuzzleScreen() {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={{ fontSize: 16, fontWeight: "500", fontFamily: "PretendardSemiBold" }}>
          메이트 보드
        </Text>
        <Text style={s.arrow} onPress={() => router.replace("/home")}>{"<"}</Text>
      </View>

      <ScrollView style={s.puzzlecontainer} contentContainerStyle={{ paddingBottom: 32 }}>
        {datas.map((item, idx) => (
          <PuzzleItem key={idx} data={item} style={{ marginBottom: -30 }} />
        ))}
      </ScrollView>
    </View>
  );
}

function PuzzleItem({ data, style }: { data: Data; style?: any }) {
  return (
    <View style={[s.item, style]}>
      {/* SVG 배경 (터치 통과) */}
      <Union width="100%" height="100%" viewBox="0 0 370 170" pointerEvents="none" />

      {/* 오버레이 콘텐츠 */}
      <View style={s.overlay}>
        {/* 프로필 이미지 (좌측 상단) */}
        {data.imgurl ? (
          <Image source={{ uri: data.imgurl }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Text style={s.avatarInitial}>{data.name?.[0] ?? "?"}</Text>
          </View>
        )}

        {/* 이름 */}
        <Text style={s.name}>{data.name}</Text>

        {/* content */}
        <Text style={s.content} numberOfLines={2}>
          {data.content}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  arrow: {
    position: "absolute",
    fontSize: 20,
    fontFamily: "PretendardSemiBold",
    left: 10,
  },
  puzzlecontainer: {
    flexDirection: "column",
    paddingHorizontal: "5%",
    marginTop: 30,
  },

  // 각 퍼즐 카드 컨테이너
  item: {
    position: "relative",
    width: "100%",         // viewBox 높이에 맞춤
    // 또는 비율 고정 원하면: aspectRatio: 370 / 170, height 제거
  },

  // SVG 위 오버레이
  overlay: {
    position: "absolute",
    left: 16,
    top: 16,
    right: 16,
  },

  // 아바타
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 8,
  },
  avatarFallback: {
    backgroundColor: "#EEF1F5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontWeight: "700",
    color: "#4A5568",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#4A4A4A",
  },
});
