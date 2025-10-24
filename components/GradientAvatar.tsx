import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getRandomAvatarUrl } from "@/utils/avatar";

type Props = {
  uri?: string;
  size?: number;
  seed?: string | number; // 랜덤 아바타 생성을 위한 seed
};

export default function GradientAvatar({ uri, size = 40, seed }: Props) {
  const ringSize = size + 1; // 41x41 크기로 설정
  
  // uri가 없으면 seed를 사용하여 랜덤 아바타 생성
  const avatarUri = uri || (seed ? getRandomAvatarUrl(seed) : undefined);

  return (
    <LinearGradient
      colors={["#FFE81C", "#EBD29C", "#DDC2FA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        s.ring,
        { 
          width: ringSize, 
          height: ringSize, 
          borderRadius: ringSize / 2,
          justifyContent: 'center',
          alignItems: 'center'
        },
      ]}
    >
      <View
        style={[
          s.hole,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
            resizeMode="cover"
          />
        ) : (
          // ✅ seed도 없고 uri도 없으면 회색 원
          <View style={[s.svgWrap, { backgroundColor: "#E0E0E0" }]} />
        )}
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  ring: { 
    justifyContent: 'center',
    alignItems: 'center'
  },
  hole: { backgroundColor: "#fff", overflow: "hidden" },
  svgWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});