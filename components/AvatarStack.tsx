// components/AvatarStack.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import GradientAvatar from "@/components/GradientAvatar";

type Props = {
  uris: string[];          // 아바타 이미지 URL들
  size?: number;           // 아바타 지름
  overlap?: number;        // 겹치는 정도(px)
  style?: ViewStyle;
  rightMostOnTop?: boolean; // 오른쪽(마지막) 아바타가 위로 오게
};

export default function AvatarStack({
  uris,
  size = 64,
  overlap = 16,
  style,
  rightMostOnTop = true,
}: Props) {
  return (
    <View style={[s.row, style]}>
      {uris.map((uri, idx) => {
        // 위로 올릴 순서 조정
        const z = rightMostOnTop ? idx + 1 : uris.length - idx;
        return (
          <View
            key={`${uri}-${idx}`}
            style={[
              { marginLeft: idx === 0 ? 0 : -overlap, zIndex: z },
            ]}
          >
            <GradientAvatar uri={uri} size={size} />
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});