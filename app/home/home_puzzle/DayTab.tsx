import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";

type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 일 월 화 수 목 금 토

interface Props {
  value: DayIndex;                  // 현재 선택된 요일
  onChange: (d: DayIndex) => void;  // 요일 변경 콜백
  style?: ViewStyle;
  labels?: string[];                // 커스텀 라벨 (기본: 일월화수목금토)
}

export default function DayOfWeekTabs({
  value,
  onChange,
  style,
  labels = ["일", "월", "화", "수", "목", "금", "토"],
}: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {labels.map((label, i) => {
        const selected = value === i;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(i as DayIndex)}
            style={({ pressed }) => [
              styles.item,
              pressed && { opacity: 0.8 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${label} 요일`}
            accessibilityState={{ selected }}
          >
            <View style={[styles.badge, selected && styles.badgeSelected]}>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}



const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  item: {
    padding: 4,
  },
  badge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeSelected: {
    backgroundColor: "#111", // 선택된 검은 원
  },
  label: {
    fontSize: 14,
    color: "#767676",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});