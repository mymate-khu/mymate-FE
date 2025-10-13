// components/SettingListItem.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ColorValue,
} from "react-native";
import ChevronRight from "@/assets/image/adjustmenticon/arrow_right_Icon.svg";

type Props = {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;           // 예: <UserIcon width={20} height={20} />
  onPress?: () => void;
  style?: ViewStyle;

  // 옵션
  color?: ColorValue;                   // 타이틀 색상 (기본 #111)
  disabled?: boolean;                   // 비활성
  showChevron?: boolean;                // 우측 > 표시 (기본 true)
  showDivider?: boolean;                // 하단 구분선 (기본 true)
};

export default function SettingListItem({
  title,
  subtitle,
  leftIcon,
  onPress,
  style,
  color = "#111",
  disabled = false,
  showChevron = true,
  showDivider = true,
}: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={[styles.row, disabled && { opacity: 0.5 }]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        {/* Left */}
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : <View style={{ width: 24 }} />}

        {/* Center */}
        <View style={styles.center}>
          <Text style={[styles.title, { color }]} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right */}
        {showChevron && (
          <View style={styles.right}>
            <ChevronRight width={16} height={16} />
          </View>
        )}
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFF",
  },
  row: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#8A8A8A",
  },
  right: {
    marginLeft: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ECECEC",
    marginLeft: 16 + 24 + 12, // 아이콘 영역만큼 들여쓰기
  },
});