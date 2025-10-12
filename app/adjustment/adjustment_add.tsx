// app/adjustment/adjustment_add.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // ✅ 사진 선택
import { router } from "expo-router";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

import CalendarIcon from "@/assets/image/adjustmenticon/calendar_Icon.svg";
import CameraIcon from "@/assets/image/adjustmenticon/camera_Icon.svg";
import DropDownIcon from "@/assets/image/adjustmenticon/arrow_drop_down.svg";
import CheckIcon from "@/assets/image/adjustmenticon/check_Icon.svg";
import BackHeader from "@/components/BackHeader";

/* ====== 캘린더 한글 ====== */
LocaleConfig.locales["ko"] = {
  monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  dayNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
  dayNamesShort: ["일","월","화","수","목","금","토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

/* ====== 날짜/금액 유틸 ====== */
function toDash(slash: string) {
  const m = slash.match(/(\d{4})\s*\/\s*(\d{2})\s*\/\s*(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : slash;
}
function toSlash(dash: string) {
  const [y, m, d] = dash.split("-");
  return y && m && d ? `${y} / ${m} / ${d}` : dash;
}
function todayStrSlash() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} / ${m} / ${day}`;
}
function formatCurrency(value: string) {
  const num = Number(value.replace(/[^0-9]/g, ""));
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(num);
}

/* ====== 컴포넌트 ====== */
export default function ExpenseCreate() {
  const [date, setDate] = useState<string>(todayStrSlash());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState<string>("카테고리");

  const [item, setItem] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  // ✅ 업로드된 사진 미리보기
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 사진 선택 (갤러리)
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("사진 접근 권한을 허용해주세요.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  };

  const people = useMemo(
    () => [
      { id: "u1", name: "A", uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240" },
      { id: "u2", name: "B", uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240" },
      { id: "u3", name: "C", uri: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=240" },
      { id: "u4", name: "D", uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240" },
    ],
    []
  );

  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const togglePerson = (id: string) =>
    setSelectedPeople(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const isValid =
    item.trim().length > 0 &&
    Number(totalAmount.replace(/[^0-9]/g, "")) > 0 &&
    receiveAmount.trim().length > 0 &&
    Number(receiveAmount.replace(/[^0-9]/g, "")) >= 0 &&
    selectedPeople.length > 0;

  const onSubmit = () => {
    if (!isValid) return;
    const payload = {
      date,
      category,
      item: item.trim(),
      totalAmount: Number(totalAmount.replace(/[^0-9]/g, "")),
      receiveAmount: Number(receiveAmount.replace(/[^0-9]/g, "")),
      people: selectedPeople,
      image: imageUri, // ✅ 선택된 이미지 URI
    };
    console.log("submit:", payload);
    // TODO: 서버 업로드/저장 후 이동
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* 공용 백헤더 */}
      <BackHeader title="정산 등록하기" color="#111" onBack={() => router.replace("/adjustment")} />

      <View style={s.card}>
        {/* ✅ 사진 등록 */}
        <TouchableOpacity style={s.photoBox} activeOpacity={0.8} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={s.photoPreview} />
          ) : (
            <CameraIcon width={28} height={28} />
          )}
        </TouchableOpacity>

        {/* 날짜 입력 */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="YYYY / MM / DD"
            placeholderTextColor="#B0B0B0"
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity style={s.trailingIcon} onPress={() => setCalendarOpen(true)}>
            <CalendarIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 카테고리 드롭다운 */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity style={s.inputRow} onPress={() => setCategoryOpen(v => !v)} activeOpacity={0.8}>
            <Text style={[s.inputText, category === "카테고리" && { color: "#B0B0B0" }]}>{category}</Text>
            <DropDownIcon width={16} height={16} />
          </TouchableOpacity>

          {categoryOpen && (
            <View style={s.dropdown}>
              {["식비", "생활용품", "교통", "문화", "기타"].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={s.dropdownItem}
                  onPress={() => {
                    setCategory(opt);
                    setCategoryOpen(false);
                  }}
                >
                  <Text style={s.dropdownText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 지출 항목 */}
        <TextInput
          style={s.inputSolo}
          placeholder="지출 항목을 입력하세요"
          placeholderTextColor="#B0B0B0"
          value={item}
          onChangeText={setItem}
        />

        {/* 총 금액 */}
        <TextInput
          style={s.inputSolo}
          placeholder="총 금액을 입력하세요"
          placeholderTextColor="#B0B0B0"
          value={totalAmount}
          onChangeText={text => setTotalAmount(formatCurrency(text))}
          keyboardType="number-pad"
        />

        {/* 받을 금액 */}
        <TextInput
          style={s.inputSolo}
          placeholder="받을 금액을 입력하세요"
          placeholderTextColor="#B0B0B0"
          value={receiveAmount}
          onChangeText={text => setReceiveAmount(formatCurrency(text))}
          keyboardType="number-pad"
        />

        {/* 사람 선택 */}
        <View style={s.peopleBox}>
          <Text style={s.peopleLabel}>정산 할 사람을 선택하세요</Text>
          <View style={s.peopleRow}>
            {people.map(p => {
              const on = selectedPeople.includes(p.id);
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => togglePerson(p.id)}
                  activeOpacity={0.85}
                  style={[s.avatarWrap, on && s.avatarWrapActive]}
                >
                  <Image source={{ uri: p.uri }} style={s.avatar} />
                  {on && <View style={s.avatarDim} />}
                  {on && (
                    <View style={s.checkWrap}>
                      <CheckIcon width={28} height={28} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 등록 버튼 */}
        <TouchableOpacity
          activeOpacity={isValid ? 0.9 : 1}
          style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
          onPress={onSubmit}
          disabled={!isValid}
        >
          <Text style={[s.submitText, !isValid && s.submitTextDisabled]}>등록하기</Text>
        </TouchableOpacity>
      </View>

      {/* === 달력 모달 (배경 투명) === */}
      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={s.modalRoot}>
          {/* 바깥 터치 시 닫기 */}
          <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={() => setCalendarOpen(false)} />
          {/* 캘린더 패널 */}
          <View style={s.modalPanel}>
            <Calendar
              current={toDash(date)}
              initialDate={toDash(date)}
              markedDates={{
                [toDash(date)]: { selected: true, selectedColor: "#111", selectedTextColor: "#fff" },
              }}
              enableSwipeMonths
              onDayPress={(d: DateData) => {
                setDate(toSlash(d.dateString));
                setCalendarOpen(false);
              }}
              onPressArrowLeft={(sub) => sub()}
              onPressArrowRight={(add) => add()}
              theme={{
                textMonthFontSize: 28,
                textMonthFontWeight: "800",
                monthTextColor: "#111",
                textSectionTitleColor: "#8A8A8A",
                dayTextColor: "#111",
                selectedDayBackgroundColor: "#111",
                selectedDayTextColor: "#fff",
                todayTextColor: "#1e90ff",
                textDayFontWeight: "500",
                textDayFontSize: 16,
                arrowColor: "#111",
              }}
              style={{ borderRadius: 20 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ====== styles ====== */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  card: {
    backgroundColor: "#FFE300",
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    overflow: "hidden",
  },

  photoBox: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  inputRow: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  trailingIcon: { marginLeft: "auto" },
  input: { flex: 1, color: "#111" },
  inputText: { flex: 1, color: "#111", fontSize: 16 },

  inputSolo: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    marginBottom: 12,
    color: "#111",
  },

  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    zIndex: 10,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 14 },
  dropdownText: { fontSize: 15, color: "#111" },

  peopleBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  peopleLabel: { fontSize: 14, color: "#666", marginBottom: 8 },
  peopleRow: { flexDirection: "row", gap: 12 },

  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 2,
    borderWidth: 2,
    borderColor: "#E9E9E9",
    position: "relative",
    overflow: "hidden",
  },
  avatarWrapActive: { borderColor: "#FFD51C" },
  avatar: { width: "100%", height: "100%", borderRadius: 36 },
  avatarDim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  checkWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  submitBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnDisabled: { backgroundColor: "#E6E6E6" },
  submitText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  submitTextDisabled: { color: "#9E9E9E" },

  /* === 달력 모달 === */
  modalRoot: { flex: 1, alignItems: "center", justifyContent: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "transparent" },
  modalPanel: {
    width: "97%",
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
    elevation: 3,
    paddingBottom: Platform.select({ ios: 8, android: 8 }),
  },
});