import React from "react";
import { View, Image, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  uri: string;
  size?: number; // 내부 원 크기
  ringWidth?: number; // 링 두께
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]]; // 최소 2개 이상 필수
};

export default function GradientAvatar({
  uri,
  size = 40,
  ringWidth = 2,
  colors = ["#FFE81C", "#EBD29C", "#DDC2FA"] as const, // ✅ as const 필수!
}: Props) {
  const outer = size + ringWidth;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: outer,
        height: outer,
        borderRadius: outer / 2,
        padding: ringWidth / 2,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: size / 2,
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
      </View>
    </LinearGradient>
  );
}