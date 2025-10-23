// components/CalendarCard.tsx
import React, { useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    FlatList,
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";
import ArrowRightIcon from "@/assets/image/adjustmenticon/arrow_right_Icon.svg";
import ArrowBottomIcon from "@/assets/image/adjustmenticon/arrowbottom_Icon.svg";

// Locale
if (!LocaleConfig.locales.ko) {
    LocaleConfig.locales.ko = {
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
    };
}
LocaleConfig.defaultLocale = "ko";

// Helpers
export const toDash = (d: Date | string) => {
    if (typeof d === "string") return d;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};
const firstOfMonth = (s: string) => s.slice(0, 7) + "-01";
const addMonth = (s: string, delta: number) => {
    const [y, m] = s.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return firstOfMonth(toDash(d));
};

// Props
type Props = {
    value: string | Date;
    onChange?: (dateString: string, data: DateData) => void;
    onMonthChange?: (year: number, month: number, cursorISO: string) => void; // 👈 추가
    markedDates?: Record<string, any>;
    minDate?: string;
    maxDate?: string;
    style?: ViewStyle;
};

// Component
export default function CalendarCard({
    value,
    onChange,
    onMonthChange, // 👈 추가
    markedDates,
    minDate,
    maxDate,
    style,
}: Props) {
    const selected = toDash(value);
    const [cursor, setCursor] = useState(firstOfMonth(selected));
    const [yearOpen, setYearOpen] = useState(false);

    const year = useMemo(() => Number(cursor.slice(0, 4)), [cursor]);
    const month = useMemo(() => Number(cursor.slice(5, 7)), [cursor]);

    const years = useMemo(() => {
        const arr: number[] = [];
        for (let y = 2020; y <= 2025; y++) arr.push(y);
        return arr.reverse();
    }, []);

    const listRef = useRef<FlatList<number>>(null);
    const ITEM_H = 44;

    const setCursorAndNotify = (updater: (prev: string) => string) => {
        setCursor(prev => {
            const next = updater(prev);
            // cursor 형식은 'YYYY-MM-01'
            const yy = Number(next.slice(0, 4));
            const mm = Number(next.slice(5, 7));
            onMonthChange?.(yy, mm, next); // 👈 부모에게 월 변경 알림
            return next;
        });
    };

    const handleOpenYear = () => {
        setYearOpen(true);
        const idx = years.indexOf(year);
        if (idx >= 0) {
            setTimeout(() => {
                listRef.current?.scrollToIndex({ index: Math.max(idx - 2, 0), animated: false });
            }, 0);
        }
    };

    const todayStr = toDash(new Date());

    return (
        <View style={[styles.card, style]}>
            {/* 연도 드롭다운 버튼 */}
            <TouchableOpacity style={styles.yearRow} onPress={handleOpenYear} activeOpacity={0.8}>
                <Text style={styles.yearText}>{year}</Text>
                <ArrowBottomIcon width={20} height={20} />
            </TouchableOpacity>

            {/* 연도 드롭다운(카드 안) */}
            {yearOpen && (
                <>
                    <TouchableOpacity style={styles.innerOverlay} activeOpacity={1} onPress={() => setYearOpen(false)} />
                    <View style={styles.yearDropdownWrap}>
                        <FlatList
                            ref={listRef}
                            data={years}
                            keyExtractor={(y) => String(y)}
                            renderItem={({ item }) => {
                                const active = item === year;
                                return (
                                    <TouchableOpacity
                                        style={[styles.yearItem, active && styles.yearItemActive]}
                                        onPress={() => {
                                            const m = cursor.slice(5, 7);
                                            setCursorAndNotify(() => `${item}-${m}-01`);
                                            setYearOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.yearPickText, active && styles.yearPickTextActive]}>
                                            {item}년
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            style={styles.yearDropdown}
                            showsVerticalScrollIndicator={false}
                            getItemLayout={(_, index) => ({ length: ITEM_H, offset: ITEM_H * index, index })}
                            initialNumToRender={12}
                            windowSize={10}
                        />
                    </View>
                </>
            )}

            {/* 월 네비게이션 */}
            <View style={styles.monthRow}>
                <TouchableOpacity style={styles.arrowBtn} onPress={() => setCursorAndNotify((p) => addMonth(p, -1))}>
                    <ArrowLeftIcon width={12} height={12} />
                </TouchableOpacity>
                <Text style={styles.monthText}>{month}월</Text>
                <TouchableOpacity style={styles.arrowBtn} onPress={() => setCursorAndNotify((p) => addMonth(p, +1))}>
                    <ArrowRightIcon width={12} height={12} />
                </TouchableOpacity>
            </View>

            {/* 캘린더 */}
            <Calendar
                key={cursor}
                current={cursor}
                initialDate={cursor}
                markingType="multi-dot"
                renderHeader={() => null}
                renderArrow={() => <></>}
                disableArrowLeft
                disableArrowRight
                enableSwipeMonths
                markedDates={markedDates}
                minDate={minDate}
                maxDate={maxDate}
                onDayPress={(d) => onChange?.(d.dateString, d)}
                dayComponent={({ date, state }) => {
                    // 타입 가드: date가 없는 슬롯은 빈 셀
                    if (!date) return <View style={styles.dayCell} />;

                    const isSelected = date.dateString === selected;
                    const isToday = date.dateString === todayStr;
                    const isOutside = state === "disabled";

                    const textColor = isOutside ? "#C8C8C8" : isSelected ? "#FFF" : "#111";
                    const marking = (markedDates && (markedDates as any)[date.dateString]) || {};
                    const dots: Array<{ key?: string; color: string; selectedDotColor?: string }> = marking.dots || [];

                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.dayCell}
                            onPress={() => onChange?.(date.dateString, date as unknown as DateData)}
                        >
                            <View style={[isSelected && styles.dayCircle]}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: textColor },
                                        isToday && (isSelected ? styles.underlineWhite : styles.underlineDark),
                                    ]}
                                >
                                    {date.day}
                                </Text>
                            </View>
                            <View style={styles.dotRow}>
                                {dots.slice(0, 3).map((d, i) => (
                                    <View
                                        key={d.key ?? `${date.dateString}-dot-${i}`}
                                        style={[
                                            styles.dot,
                                            {
                                                backgroundColor: d.color,
                                                opacity: isOutside ? 0.3 : 1,
                                            },
                                        ]}
                                    />
                                ))}
                            </View>
                        </TouchableOpacity>
                    );
                }}
                theme={{
                    textSectionTitleColor: "#9E9E9E",
                    dayTextColor: "#111",
                    todayTextColor: "#111",
                    selectedDayBackgroundColor: "#111",
                    selectedDayTextColor: "#FFF",
                    textDayFontWeight: "500",
                    textDayFontSize: 16,
                    // @ts-ignore
                    "stylesheet.calendar.main": {
                        week: {
                            marginTop: 8,
                            marginBottom: 8,
                            flexDirection: "row",
                            justifyContent: "space-around",
                        },
                    },
                }}
                style={styles.calendar}
            />
        </View>
    );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    card: {
        //backgroundColor: "pink",
        borderRadius: 20,
        overflow: "hidden",
    },
    yearRow: {
        //height: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginVertical: 8,
        //backgroundColor: "green",
    },
    yearText: { fontSize: 16, fontWeight: "500", color: "#111" },

    innerOverlay: { ...StyleSheet.absoluteFillObject },
    yearDropdownWrap: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        width: 230,
        maxHeight: 360,
        borderRadius: 14,
        backgroundColor: "#fff",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 6,
        zIndex: 20,
    },
    yearDropdown: { maxHeight: 360 },
    yearItem: { height: 44, justifyContent: "center", paddingHorizontal: 16 },
    yearItemActive: { backgroundColor: "#FFF7B8" },
    yearPickText: { fontSize: 16, color: "#111" },
    yearPickTextActive: { fontWeight: "800" },

    monthRow: {
        //height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        marginBottom: 15,
        //backgroundColor: "red",
    },
    monthText: { fontSize: 32, fontWeight: "600", color: "#111" },
    arrowBtn: {
        width: 24,
        height: 24,
        borderRadius: 5,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        justifyContent: "center",
    },

    calendar: { backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#EAEAEA" },

    // Day cell
    dayCell: {
        width: 40,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    dayCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
    },
    dayText: { fontSize: 16, fontWeight: "600" },
    underlineDark: { textDecorationLine: "underline", textDecorationColor: "#111" },
    underlineWhite: { textDecorationLine: "underline", textDecorationColor: "#FFF" },
    dotRow: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 2,            // 셀 하단에 고정
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        height: 6,            // 항상 같은 높이 확보
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
});