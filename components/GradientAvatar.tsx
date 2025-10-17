import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BasicProfile from "@/assets/image/home/basic_profile.svg";

type Props = {
  uri?: string;
  size?: number;
};

export default function GradientAvatar({ uri, size = 40 }: Props) {
  const ringSize = size + 2; // 외곽선용

  return (
    <LinearGradient
      colors={["#FFE81C", "#EBD29C", "#DDC2FA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        s.ring,
        { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
      ]}
    >
      <View
        style={[
          s.hole,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
            resizeMode="cover"
          />
        ) : (
          // ✅ 기본 프로필 SVG 표시
          <View style={s.svgWrap}>
            <BasicProfile/>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  ring: { padding: 1 },
  hole: { backgroundColor: "#fff", overflow: "hidden" },
  svgWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});