// components/AvatarStack.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";

type AvatarData = {
  uri?: string;
  seed?: string | number;
};

type Props = {
  uris?: string[];          // 기존 호환성을 위한 prop (deprecated)
  avatars?: AvatarData[];   // 새로운 방식: uri와 seed를 함께 전달
  size?: number;            // 아바타 지름
  overlap?: number;         // 겹치는 정도(px)
  style?: ViewStyle;
  rightMostOnTop?: boolean; // 오른쪽(마지막) 아바타가 위로 오게
};

export default function AvatarStack({
  uris,
  avatars,
  size = 64,
  overlap = 16,
  style,
  rightMostOnTop = true,
}: Props) {
  // avatars가 있으면 우선 사용, 없으면 uris를 avatars 형태로 변환
  const avatarList = avatars || (uris || []).map(uri => ({ uri }));

  return (
    <View style={[s.row, style]}>
      {avatarList.map((avatar, idx) => {
        // 위로 올릴 순서 조정
        const z = rightMostOnTop ? idx + 1 : avatarList.length - idx;
        return (
          <View
            key={`${avatar.uri || avatar.seed}-${idx}`}
            style={[
              { marginLeft: idx === 0 ? 0 : -overlap, zIndex: z },
            ]}
          >
            <GradientAvatar uri={avatar.uri} seed={avatar.seed} size={size} />
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});