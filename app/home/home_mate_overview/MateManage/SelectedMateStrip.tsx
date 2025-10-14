// app/home/home_mate_overview/MateManage/SelectedMateStrip.tsx
// 상단 가로 스트립
import React from "react";
import { ScrollView, ViewStyle } from "react-native";
import SelectedMateChip, { SelectedMateChipProps } from "./SelectedMateChip";

export default function SelectedMateStrip({
  selected,
  onRemove,
  style,
}: {
  selected: Array<{ id: string; name: string; avatarUri?: string }>;
  onRemove: (id: string) => void;
  style?: ViewStyle;
}) {
  if (!selected.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      {selected.map((m) => (
        <SelectedMateChip key={m.id} id={m.id} name={m.name} avatarUri={m.avatarUri} onRemove={onRemove} />
      ))}
    </ScrollView>
  );
}