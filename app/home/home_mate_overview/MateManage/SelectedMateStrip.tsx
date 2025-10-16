// app/home/home_mate_overview/MateManage/SelectedMateStrip.tsx
import React from "react";
import { View, ScrollView, Text, StyleSheet, ViewStyle } from "react-native";
import SelectedMateChip from "./SelectedMateChip";

type ChipItem = { id: string; name: string; code?: string; avatarUri?: string };

export default function SelectedMateStrip({
  selected,
  onRemove,
  style,
  contentStyle,
  alwaysShow = false,         // ✅ 비어 있어도 박스를 보여줄지
  placeholder = "선택한 메이트가 여기에 표시돼요", // ✅ 빈 상태 문구
}: {
  selected: ChipItem[];
  onRemove: (id: string) => void;
  style?: ViewStyle;          // ✅ 바깥 박스 스타일
  contentStyle?: ViewStyle;   // ✅ 내부 스크롤 content padding 등
  alwaysShow?: boolean;
  placeholder?: string;
}) {
  const showBox = alwaysShow || selected.length > 0;

  if (!showBox) return null;

  return (
    <View style={[s.box, style]}>
      {selected.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            s.content,
            contentStyle,
          ]}
        >
          {selected.map((m) => (
            <SelectedMateChip
              key={m.id}
              id={m.id}
              name={m.name}
              code={m.code}
              avatarUri={m.avatarUri}
              onRemove={onRemove}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[s.content, contentStyle]}>
          <Text style={s.placeholder}>{placeholder}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    paddingHorizontal: "5%",
    marginTop: 10,
    //borderRadius: 14,
    //borderWidth: StyleSheet.hairlineWidth,
    //borderColor: "#EDEDED",
    //backgroundColor: "pink",
    minHeight: 96,            // “큰 박스” 높이 확보
    justifyContent: "center",
  },
  content: {
    //paddingHorizontal: 12,
    paddingVertical: 12,
  },
  placeholder: {
    fontSize: 13,
    color: "#9B9B9B",
    paddingHorizontal: 4,
  },
});