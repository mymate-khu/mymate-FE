import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";
import ArrowRightIcon from "@/assets/image/adjustmenticon/arrow_right_Icon.svg";

// --- Locale(ko) 설정 ---
if (!LocaleConfig.locales["ko"]) {
  LocaleConfig.locales["ko"] = {
    monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
    monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
    dayNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
    dayNamesShort: ["일","월","화","수","목","금","토"],
    today: "오늘",
  };
}
LocaleConfig.defaultLocale = "ko";

// YYYY-MM-DD 헬퍼
export const toDash = (d: Date | string) => {
  if (typeof d === "string") return d;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

type Props = {
  value: string | Date;
  onChange?: (dateString: string, data: DateData) => void;
  markedDates?: Record<string, any>;
  minDate?: string;
  maxDate?: string;
  style?: ViewStyle;
  calendarTheme?: any;
};

export default function CalendarCard({
  value,
  onChange,
  markedDates,
  minDate,
  maxDate,
  style,
  calendarTheme,
}: Props) {
  const current = toDash(value);

  return (
    <View style={[styles.wrap, style]}>
      <Calendar
        current={current}
        initialDate={current}
        markedDates={markedDates}
        minDate={minDate}
        maxDate={maxDate}
        enableSwipeMonths
        renderArrow={(direction) =>
          direction === "left" ? (
            <ArrowLeftIcon width={18} height={18} />
          ) : (
            <ArrowRightIcon width={18} height={18} />
          )
        }
        onDayPress={(d) => onChange?.(d.dateString, d)}
        theme={{
          // 상단 연도 / 월
          textMonthFontSize: 28,
          textMonthFontWeight: "800",
          monthTextColor: "#111",
          // 요일 헤더
          textSectionTitleColor: "#8A8A8A",
          textSectionTitleFontWeight: "500",
          // 날짜
          dayTextColor: "#111",
          todayTextColor: "#1e90ff",
          selectedDayBackgroundColor: "#111",
          selectedDayTextColor: "#fff",
          textDayFontWeight: "500",
          textDayFontSize: 16,
          // 월/연도 가운데 정렬 및 위 여백 줄이기
          "stylesheet.calendar.header": {
            header: {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 24,
              marginBottom: 10,
              marginTop: 6,
            },
            monthText: {
              fontSize: 28,
              fontWeight: "800",
              color: "#111",
              textAlign: "center",
            },
          },
          // 주 행 간격
          "stylesheet.calendar.main": {
            week: {
              marginTop: 8,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-around",
            },
          },
          ...calendarTheme,
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "transparent", // 전체 흰 박스 제거
  },
  calendar: {
    borderRadius: 20,
    backgroundColor: "#fff", // 내부만 흰색
    overflow: "hidden",
  },
});