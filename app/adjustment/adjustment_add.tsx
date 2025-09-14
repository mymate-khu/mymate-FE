import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, Image, Modal } from 'react-native';
import { router } from 'expo-router';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";
import CalendarIcon from "@/assets/image/adjustmenticon/calendar_Icon.svg";
import CameraIcon from "@/assets/image/adjustmenticon/camera_Icon.svg";
import DropDownIcon from "@/assets/image/adjustmenticon/arrow_drop_down.svg";
import CheckIcon from "@/assets/image/adjustmenticon/check_Icon.svg";


// 한국어 표기 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

//유틸 + 상태 추가
function toDash(slash: string) {      // "YYYY / MM / DD" -> "YYYY-MM-DD"
  const m = slash.match(/(\d{4})\s*\/\s*(\d{2})\s*\/\s*(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : slash;
}
function toSlash(dash: string) {      // "YYYY-MM-DD" -> "YYYY / MM / DD"
  const [y, m, d] = dash.split('-');
  return (y && m && d) ? `${y} / ${m} / ${d}` : dash;
}
const [calendarOpen, setCalendarOpen] = useState(false);

// 날짜 입력 행에서 아이콘 핸들러 수정
function todayStrSlash() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');      // "YYYY / MM / DD"
  return `${y} / ${m} / ${day}`;
}

// 숫자 -> "₩10,000" 변환 함수
function formatCurrency(value: string) {
  // 입력값에서 숫자만 추출
  const num = Number(value.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0, // 소수점 없음
  }).format(num);
}


export default function ExpenseCreate() {
  const [date, setDate] = useState<string>(todayStrSlash()); // 처음 화면이 열리면 오늘 날짜로 초기화 세팅
  const [calendarOpen, setCalendarOpen] = useState(false); // 달력 모달 열림 상태
 
  const [categoryOpen, setCategoryOpen] = useState(false); // 카테고리 드롭다운 열림 상태
  const [category, setCategory] = useState<string>('카테고리'); // 선택된 카테고리
  
  const [item, setItem] = useState(''); // 지출 항목
  const [totalAmount, setTotalAmount] = useState(''); // 총 금액
  const [receiveAmount, setReceiveAmount] = useState(''); // 받을 금액

  // 사람 선택(더미 데이터)
  const people = useMemo(() => ([
    { id: 'u1', name: 'A', uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240' },
    { id: 'u2', name: 'B', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240' },
    { id: 'u3', name: 'C', uri: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=240' },
    { id: 'u4', name: 'D', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240' },
  ]), []);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const togglePerson = (id: string) => {
    setSelectedPeople(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 유효성 검사(필요 최소한)
  const isValid =
    item.trim().length > 0 &&
    Number(totalAmount) > 0 &&
    receiveAmount.trim().length > 0 &&
    Number(receiveAmount) >= 0 &&
    selectedPeople.length > 0;

  // 저장
  const onSubmit = () => {
    if (!isValid) return;

    // 실제 전송 payload 예시
    const payload = {
      date, category, item: item.trim(),
      totalAmount: Number(totalAmount),
      receiveAmount: Number(receiveAmount),
      people: selectedPeople
    };
    // TODO: API/상태 연동 위치
    // await api.post('/adjustments', payload)

    //router.back();
  };



  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

  
      <View style={s.card}>
        {/* 헤더 */}
        <View style={s.headerRow}>
          <TouchableOpacity style={s.backIconHit} onPress={() => router.replace("/adjustment")} activeOpacity={0.8}>
            <ArrowLeftIcon width={16} height={16} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>정산 등록하기</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* 사진 등록 */}
        <TouchableOpacity style={s.photoBox} activeOpacity={0.8} onPress={() => { /* TODO: 이미지 피커 */ }}>
          <CameraIcon width={28} height={28} />
        </TouchableOpacity>

        {/* 날짜 */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="YYYY / MM / DD"
            placeholderTextColor="#B0B0B0"
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity style={s.trailingIcon} onPress={() => { 
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
            }}>
            <CalendarIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 카테고리 드롭다운 */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={s.inputRow}
            onPress={() => setCategoryOpen(v => !v)}
            activeOpacity={0.8}
          >
            <Text style={[s.inputText, category === '카테고리' && { color: '#B0B0B0' }]}>
              {category}
            </Text>
            <DropDownIcon width={16} height={16} />
          </TouchableOpacity>

          {categoryOpen && (
            <View style={s.dropdown}>
              {['식비', '생활용품', '교통', '문화', '기타'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={s.dropdownItem}
                  onPress={() => { setCategory(opt); setCategoryOpen(false); }}
                >
                  <Text style={s.dropdownText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 지출 항목 입력 */}
        <TextInput
          style={s.inputSolo}
          placeholder="지출 항목을 입력하세요"
          placeholderTextColor="#B0B0B0"
          value={item}
          onChangeText={setItem}
          keyboardType="number-pad" // 숫자 키보드
        />

        {/* 총 금액 */}
        <TextInput
          style={s.inputSolo}
          placeholder="총 금액을 입력하세요"
          placeholderTextColor="#B0B0B0"
          value={totalAmount}
          onChangeText={(text) => setTotalAmount(formatCurrency(text))} // 입력값 포맷팅 : ₩10,000
          keyboardType="number-pad" // 숫자 키보드
        />

        {/* 받을 금액 */}
        <TextInput
          style={s.inputSolo}
          placeholder="받을 금액을 입력하세요"
          placeholderTextColor="#B0B0B0"
          value={receiveAmount}
          onChangeText={(text) => setReceiveAmount(formatCurrency(text))} // 입력값 포맷팅 : ₩10,000
          keyboardType="number-pad"
        />

        {/* 정산 할 사람 선택 */}
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
                  {/* 사람 사진 */}
                  <Image source={{ uri: p.uri }} style={s.avatar} />

                  {/* 선택되면 어둡게 */}
                  {on && <View style={s.avatarDim} />}

                  {/* 선택되면 노란 체크 */}
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

        {/* 등록하기 버튼 */}
        <TouchableOpacity
          activeOpacity={isValid ? 0.9 : 1} // 유효하지 않으면 눌리지 않게
          style={[s.submitBtn, !isValid && s.submitBtnDisabled]} // 유효하지 않으면 회색
          onPress={onSubmit}
          disabled={!isValid} // 유효하지 않으면 비활성화
        >
          <Text style={[s.submitText, !isValid && s.submitTextDisabled]}>등록하기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={calendarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>날짜 선택</Text>
              <TouchableOpacity onPress={() => setCalendarOpen(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={s.modalClose}>닫기</Text>
              </TouchableOpacity>
            </View>

            <Calendar
              initialDate={toDash(date)}
              current={toDash(date)}
              markedDates={{
                [toDash(date)]: { selected: true, selectedColor: 'black' },
              }}
              onDayPress={(day: DateData) => {
                setDate(toSlash(day.dateString));
                setCalendarOpen(false);
              }}
              onPressArrowLeft={(sub) => sub()}
              onPressArrowRight={(add) => add()}
              style={{ borderRadius: 12 }}
              theme={{
                arrowColor: 'black',
                todayTextColor: '#1e90ff',
                textDayFontWeight: '500',
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}





const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  card: {
    backgroundColor: '#FFE300',
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    overflow: 'hidden',
  },

  /* 헤더 */
  headerRow: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconHit: {
    position: 'absolute', 
    left: 4, 
    top: 8,
    width: 32, 
    height: 28, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  headerTitle: { 
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111' 
  },

  /* 사진 */
  photoBox: {
    width: 96, 
    height: 96, 
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 8, 
    marginBottom: 12,
  },

  /* 입력 공통 */
  inputRow: {
    height: 48, 
    borderRadius: 12, 
    backgroundColor: '#FFFFFF',
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 14, 
    marginBottom: 12,
  },
    trailingIcon: { 
    marginLeft: 'auto' 
  },
    input: { 
      flex: 1, 
      color: '#111' 
    },
    inputText: { 
      flex: 1, 
      color: '#111', 
      fontSize: 16 
    },

    inputSolo: {
      height: 48, 
      borderRadius: 12, 
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 14, 
      marginBottom: 12, 
      color: '#111',
    },

    /* 드롭다운 */
    dropdown: {
      position: 'absolute', 
      top: 50, 
      left: 0, 
      right: 0,
      backgroundColor: '#FFF', 
      borderRadius: 12, 
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth, 
      borderColor: '#E5E5E5',
      zIndex: 10,
    },
    dropdownItem: { 
      paddingVertical: 12, 
      paddingHorizontal: 14 
    },
    dropdownText: { 
      fontSize: 15, 
      color: '#111' 
    },

    /* 사람 선택 */
    peopleBox: {
      backgroundColor: '#FFFFFF', 
      borderRadius: 12, 
      padding: 14, 
      marginBottom: 12,
    },
    peopleLabel: { 
      fontSize: 14, 
      color: '#666', 
      marginBottom: 8 
    },
    peopleRow: { 
      flexDirection: 'row', 
      gap: 12 
    },
    avatarWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      padding: 2,
      borderWidth: 2,
      borderColor: '#E9E9E9',
      position: 'relative',   // 오버레이/체크 아이콘 배치용
      overflow: 'hidden',     // 둥근 영역 밖은 잘라내기
    },
    avatarWrapActive: {
      borderColor: '#FFD51C', // 선택 시 노란 테두리
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: 36,
    },
    avatarDim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    checkWrap: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* 등록 버튼 */
    submitBtn: {
      height: 50, 
      borderRadius: 12, 
      backgroundColor: '#111',
      alignItems: 'center', 
      justifyContent: 'center', 
      marginTop: 8,
    },
    submitBtnDisabled: { 
      backgroundColor: '#E6E6E6' 
    },
    submitText: { 
      color: '#FFF', 
      fontWeight: '700', 
      fontSize: 16 
    },
    submitTextDisabled: { 
      color: '#9E9E9E' 
    },
    
    /* 달력 모달 */
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalTitle: { 
      fontSize: 16, 
      fontWeight: '700', 
      color: '#111' 
    },
    modalClose: { 
      marginLeft: 'auto', 
      fontSize: 14, 
      color: '#111' 
    },
});