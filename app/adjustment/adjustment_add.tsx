// app/adjustment/adjustment_add.tsx
import React, { useMemo, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet,
  StatusBar, Image, Modal, Platform, ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createAccount } from "@/components/apis/account";

import CalendarCard from "@/components/CalendarCard";

import CalendarIcon from "@/assets/image/adjustmenticon/calendar_Icon.svg";
import CameraIcon from "@/assets/image/adjustmenticon/camera_Icon.svg";
import DropDownIcon from "@/assets/image/adjustmenticon/arrow_drop_down.svg";
import CheckIcon from "@/assets/image/adjustmenticon/check_Icon.svg";
import BackHeader from "@/components/BackHeader";

import TagIcon from "@/assets/image/adjustmenticon/tag_Icon.svg";
import TicketIcon from "@/assets/image/adjustmenticon/ticket_Icon.svg";
import CutleryIcon from "@/assets/image/adjustmenticon/cutlery_Icon.svg";
import CarIcon from "@/assets/image/adjustmenticon/car_Icon.svg";
import HouseIcon from "@/assets/image/adjustmenticon/house_Icon.svg";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";

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
const slashToDash = (s: string) => s.replace(/\s*\/\s*/g, "-");

// "₩12,312" 같은 문자열을 숫자 12312로 바꿔주는 함수
const parseCurrencyToNumber = (v: string) =>
  Number(v.replace(/[^0-9]/g, "")) || 0;

const CATEGORIES = [
  { key: "food", label: "식비", Icon: CutleryIcon },
  { key: "life", label: "생활", Icon: ShopbagIcon },
  { key: "shopping", label: "쇼핑", Icon: TagIcon },
  { key: "transport", label: "교통/차량", Icon: CarIcon },
  { key: "house", label: "주거/관리비", Icon: HouseIcon },
  { key: "culture", label: "문화/여가", Icon: TicketIcon },
] as const;

export default function ExpenseCreate() {
  const [date, setDate] = useState<string>(todayStrSlash());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState<string>("카테고리");

  const [item, setItem] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

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
    setSelectedPeople((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const isValid =
    item.trim().length > 0 &&
    Number(totalAmount.replace(/[^0-9]/g, "")) > 0 &&
    receiveAmount.trim().length > 0 &&
    Number(receiveAmount.replace(/[^0-9]/g, "")) >= 0 &&
    selectedPeople.length > 0;


  // ✅ 수정된 onSubmit
  const onSubmit = async () => {
    if (!isValid) {
      alert("모든 입력값을 확인해주세요.");
      return;
    }

    // 임시로 선택한 사람 id를 숫자 배열로 변환
    const participantIds = selectedPeople.map((_, i) => i + 1);

    const body = {
      title: item.trim(),
      description: `${item.trim()} 정산`,
      expenseDate: slashToDash(date),
      category,
      imageUrl: imageUri ?? null,
      totalAmount: parseCurrencyToNumber(totalAmount),
      receiveAmount: parseCurrencyToNumber(receiveAmount),
      participantIds,
    };

    try {
      const res = await createAccount(body);
      alert("✅ 정산이 성공적으로 등록되었습니다!");
      console.log("정산 등록 성공:", res);
      router.replace("/adjustment");
    } catch (err: any) {
      console.error("[정산 등록 실패]", err);
      alert(err?.message || "서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  
  // 공통 placeholder 색
  const commonInputProps = { placeholderTextColor: "#999999" };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="정산 등록하기" color="#111" onBack={() => router.replace("/adjustment")} />

      <View style={s.card}>
        <TouchableOpacity style={s.photoBox} activeOpacity={0.8} onPress={pickImage}>
          {imageUri ? <Image source={{ uri: imageUri }} style={s.photoPreview} /> : <CameraIcon width={28} height={28} />}
        </TouchableOpacity>

        {/* 날짜 입력 */}
        <View style={s.inputRow}>
          <TextInput style={s.input} placeholder="YYYY / MM / DD" value={date} onChangeText={setDate} />
          <TouchableOpacity style={s.trailingIcon} onPress={() => setCalendarOpen(true)}>
            <CalendarIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 카테고리 */}
        <TouchableOpacity style={s.inputRow} onPress={() => setCategoryOpen(true)} activeOpacity={0.8}>
          <Text style={[s.inputText, category === "카테고리" && { color: "#999999" }]}>{category}</Text>
          <DropDownIcon width={24} height={24} />
        </TouchableOpacity>

        {/* 지출 항목 */}
        <TextInput
          style={s.inputSolo}
          {...commonInputProps}
          placeholder="지출 항목을 입력하세요"
          value={item}
          onChangeText={setItem}
        />

        {/* 디바이더 */}
        <View style={s.formDivider} />

        {/* 총 금액 */}
        <TextInput
          style={s.inputSolo}
          {...commonInputProps}
          placeholder="총 금액을 입력하세요"
          value={totalAmount}
          onChangeText={(text) => setTotalAmount(formatCurrency(text))}
          keyboardType="number-pad"
        />

        {/* 받을 금액 */}
        <TextInput
          style={s.inputSolo}
          {...commonInputProps}
          placeholder="받을 금액을 입력하세요"
          value={receiveAmount}
          onChangeText={(text) => setReceiveAmount(formatCurrency(text))}
          keyboardType="number-pad"
        />

        {/* 사람 선택 */}
        <View style={s.peopleBox}>
          <Text style={s.peopleLabel}>정산 할 사람을 선택하세요</Text>
          <View style={s.peopleRow}>
            {people.map((p) => {
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

      {/* CalendarCard 모달 */}
      <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
        <View style={s.modalRoot}>
          <TouchableOpacity style={s.backdrop} onPress={() => setCalendarOpen(false)} />
          <View style={s.modalPanel}>
            <CalendarCard
              value={slashToDash(date)}
              onChange={(newDate) => {
                const [y, m, d] = newDate.split("-");
                setDate(`${y} / ${m} / ${d}`);
                setCalendarOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* 카테고리 모달 */}
      <Modal visible={categoryOpen} transparent animationType="fade" onRequestClose={() => setCategoryOpen(false)}>
        <View style={s.modalRoot}>
          <TouchableOpacity style={s.backdropTransparent} onPress={() => setCategoryOpen(false)} />
          <View style={s.categoryPanel}>
            {CATEGORIES.map((opt, idx) => {
              const IconComp = opt.Icon;
              const isOn = category === opt.label;
              const isLast = idx === CATEGORIES.length - 1;
              return (
                <View key={opt.key}>
                  <TouchableOpacity
                    style={[s.categoryRow, isOn && s.categoryRowActive]}
                    onPress={() => {
                      setCategory(opt.label);
                      setCategoryOpen(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <IconComp width={22} height={22} />
                    <Text style={[s.categoryText, isOn && s.categoryTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                  {!isLast && <View style={s.categoryDivider} />}
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}



const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFE300", 
    borderRadius: 24, 
    padding: 16, 
    marginTop: 8 
  },
  card: { 
    borderRadius: 24, 
    padding: 16, 
    marginTop: 8 
  },

  // 포토 박스
  photoBox: {
    width: 98, 
    height: 98, 
    borderRadius: 12, 
    backgroundColor: "#fff",
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 8, 
    marginBottom: 24,
  },
  photoPreview: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 12 
  },


  // 입력 행
  inputRow: {
    height: 48, 
    borderRadius: 12, 
    backgroundColor: "#fff",
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 14, 
    marginBottom: 12,
  },
  trailingIcon: { 
    marginLeft: "auto" 
  },
  input: { 
    flex: 1, 
    color: "#111" 
  },
  inputText: { 
    flex: 1, 
    color: "#111", 
    fontSize: 17 
  },

  inputSolo: {
    height: 48, 
    borderRadius: 12, 
    backgroundColor: "#fff",
    paddingHorizontal: 14, 
    marginBottom: 12, 
    color: "#111",
    fontSize: 17,
  },

  /* 폼 디바이더 */
  formDivider: {
    height: 2,
    backgroundColor: "#FFD51C",
    marginBottom: 12,
    borderRadius: 1,
    
  },

  // 사람 선택
  peopleBox: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12 
  },
  peopleLabel: { 
    fontSize: 16, 
    color: "#666", 
    marginBottom: 8 
  },
  peopleRow: { 
    flexDirection: "row", 
    gap: 12 
  },
  avatarWrap: {
    width: 72, 
    height: 72, 
    borderRadius: 36, 
    padding: 2, 
    borderWidth: 2,
    borderColor: "#E9E9E9", 
    overflow: "hidden",
  },
  avatarWrapActive: { 
    borderColor: "#FFD51C" 
  },
  avatar: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 36 
  },
  avatarDim: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(0,0,0,0.45)" 
  },
  checkWrap: { 
    ...StyleSheet.absoluteFillObject, 
    alignItems: "center", 
    justifyContent: "center" 
  },

  // 등록 버튼
  submitBtn: {
    height: 48, 
    borderRadius: 12, 
    backgroundColor: "#fff",
    alignItems: "center", 
    justifyContent: "center",
    marginTop: 24,
  },
  submitBtnDisabled: { 
    backgroundColor: "#fff" 
  },
  submitText: { 
    color: "#111", 
    fontWeight: "500", 
    fontSize: 16 
  },
  submitTextDisabled: { 
    color: "#999999" 
  },

  // 모달
  modalRoot: { 
    flex: 1, 
    alignItems: "center" 
  },
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(0,0,0,0.2)" 
  },
  backdropTransparent: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "transparent" 
  },

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
    marginTop: 275,
  },

  // 카테고리 모달
  categoryPanel: {
    width: "94%", 
    borderRadius: 20, 
    backgroundColor: "#fff", 
    overflow: "hidden",
    elevation: 6, 
    shadowColor: "#000", 
    shadowOpacity: 0.08, 
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12, 
    marginTop: 333 ,
  },
  categoryRow: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 16, 
    paddingHorizontal: 18, 
    height: 56,
  },
  categoryRowActive: { 
    backgroundColor: "#FFF7B8" 
  },
  categoryText: { 
    fontSize: 17, 
    color: "#111" 
  },
  categoryTextActive: { 
    fontWeight: "700" 
  },
  categoryDivider: { 
    height: StyleSheet.hairlineWidth, 
    backgroundColor: "#ECECEC", 
    alignSelf: "stretch" 
  },
});