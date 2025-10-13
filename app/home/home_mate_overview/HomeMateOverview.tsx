import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useRouter } from "expo-router"; // ✅ 추가!
import PuzzleLogo from "@/assets/image/home/puzzle_logo.svg";
import ArrowRight from "@/assets/image/home/arrow_right.svg";
import AvatarStack from "@/components/AvatarStack";

type Mate = { id: string; name?: string; photo?: string };

type Props = {
  style?: ViewStyle;
  userName?: string;
  mates?: Mate[];
};

const DEFAULT_MATES: Mate[] = [
  {
    id: "m1",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=480&auto=format&fit=crop",
  },
  {
    id: "m2",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=480&auto=format&fit=crop",
  },
  {
    id: "m3",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
  },
];

export default function HomeMateOverview({
  style,
  userName = "효진",
  mates = DEFAULT_MATES,
}: Props) {
  const router = useRouter(); // ✅ 라우터 객체 생성

  const handleNavigateToManage = () => {
    // MateManagement 페이지 경로로 이동
    router.push("/home/home_mate_overview/MateManage/MateManagement");
  };

  return (
    <View style={[s.container, style]}>
      {/* 좌측: 퍼즐 로고 */}
      <View style={s.logoWrap}>
        <PuzzleLogo width="100%" height="100%" />
      </View>

      {/* 우측: 텍스트 + 메이트 + 버튼 */}
      <View style={s.rightCol}>
        <View>
          <Text style={s.hello1}>안녕하세요!</Text>
          <Text style={s.hello2}>{userName} 님!</Text>
        </View>

        <Text style={s.sectionTitle}>MyMate</Text>

        <View style={s.matesRow}>
          <AvatarStack
            uris={mates.slice(0, 3).map((m) => m.photo || "")}
            size={40}
            overlap={10}
          />
        </View>
      </View>

      {/* 👉 MateManagement로 이동 */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={s.nextBtn}
        onPress={handleNavigateToManage}
      >
        <ArrowRight width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 5,
  },
  logoWrap: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
    gap: 12,
  },
  hello1: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    lineHeight: 40,
  },
  hello2: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    lineHeight: 40,
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#222",
  },
  matesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextBtn: {
    position: "absolute",
    right: 0,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 36,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
});