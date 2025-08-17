import React, { useState, useMemo } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';


const initialEvents = {
  '2025-08-18': {
    dots: [
      { key: 'event1', color: 'rgba(255, 230, 0, 1)', selectedDotColor: 'white' },
      { key: 'event2', color: 'purple', selectedDotColor: 'white' },
      { key: 'event3', color: 'purple', selectedDotColor: 'white' },
    ],
  },
  '2025-08-20': {
    dots: [
      { key: 'event1', color: 'rgba(255, 230, 0, 1)', selectedDotColor: 'white' },
      { key: 'event2', color: 'rgba(255, 230, 0, 1)', selectedDotColor: 'white' },
    ],
  },
};

const sampleCards = [
  { id: '1', name: '홍길동', discript:"오늘밤에하기" },
  { id: '2', name: '김철수', discript:"오늘밤에하기" },
  { id: '3', name: '이영희', discript:"오늘밤에하기" },
];

const mateCards = [
  { id: 'm1', name: '룸메 A', discript:"오늘밤에하기" },
  { id: 'm2', name: '룸메 B', discript:"오늘밤에하기2" },
];

export default function MyCalendar() {

  const { height } = useWindowDimensions();

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const [selected, setSelected] = useState(todayISO);
  const [events, setEvents] = useState(initialEvents);
  const [curmonth, setCurMonth] = useState(today.getMonth() + 1);
  const [curyear, setCurYear] = useState(today.getFullYear());

  const Header = (_: any) => (
    <View style={{ width: '100%' }}>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'PretendardSemiBold',
          fontWeight: '600',
          fontSize: 18,
          marginTop: 6,
        }}
      >
        {String(curmonth).padStart(2, '0')}월
      </Text>
      <View style={{ height: 2, backgroundColor: '#111', marginTop: 6 }} />
    </View>
  );

  const listHeader = useMemo(
    () => (
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ height: height * 0.05, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: height * 0.02 }}>캘린더</Text>
        </View>
        <View style={{ height: height * 0.05, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: height * 0.04 }}>{curyear}</Text>
        </View>
        <Calendar
          current={todayISO}
          markingType="multi-dot"
          renderHeader={Header}
          onMonthChange={(m: DateData) => {
            setCurYear(m.year);
            setCurMonth(m.month);
          }}
          markedDates={{
            ...events,
            [selected]: { selected: true, selectedColor: 'black' }, // 원 + selectedDotColor 로 점 보이게
          }}
          onDayPress={(day) => setSelected(day.dateString)}
          monthFormat={'MM월'}
          theme={{
            textMonthFontFamily: 'PretendardSemiBold',
            textDayHeaderFontFamily: 'PretendardSemiBold',
            textDayFontFamily: 'PretendardSemiBold',
            textDayFontWeight: '500',
            todayTextColor: 'blue',
            arrowColor: 'black',
          }}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          style={{ backgroundColor: 'white' }}
        />
      </View>
    ),
    [height, curyear, curmonth, todayISO, selected, events]
  );

  // SectionList: 하나의 스크롤만 사용
  const sections = useMemo(
    () => [
      { title: 'My Puzzle', data: sampleCards, keyPrefix: 'my-' },
      { title: "Mate's Puzzle", data: mateCards, keyPrefix: 'mate-' },
    ],
    []
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => (item.id ? item.id : `${index}`)}
      ListHeaderComponent={
        <>
          {listHeader}
          {/* 섹션 헤더 위의 상단 구분선 */}
          <View style={{ borderTopColor: 'lightgray', borderTopWidth: 2 }} />
        </>
      }
      renderSectionHeader={({ section }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: height * 0.07,
            paddingHorizontal: '5%',
            backgroundColor: 'white',
          }}
        >
          <Text style={{ fontWeight: '400', fontSize: height * 0.03 }}>{section.title}</Text>
          <Text style={{ marginLeft: 'auto', fontWeight: '400', fontSize: height * 0.03 }} onPress={() => console.log(`${section.title} + clicked`)}>
            +
          </Text>
        </View>
      )}
      renderItem={({ item, section }) => (
        <View style={styles.card}>
          <View style={styles.cardMenu}>
            <TouchableOpacity >
              <Text onPress={() => { console.log(1) }}>수정하기</Text>
            </TouchableOpacity>
            <Text> |</Text>

            <TouchableOpacity >
              <Text onPress={() => { console.log(2) }}> 삭제하기</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.title,{fontSize:height*0.025}]}>{item.name}</Text>
          <Text style={styles.discript}>
            {item.discript}
          </Text>
        </View>
      )}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{ paddingBottom: 40, backgroundColor: 'white' }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      SectionSeparatorComponent={() => <View style={{ height: 8, backgroundColor: 'white' }} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    marginHorizontal: '5%',
  },
  cardMenu: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    flexDirection: "row",
    fontWeight:400,
  },
  title:{
    position: 'absolute',
    top: 8,
    padding: 6,
    fontWeight:400,
  },
  discript:{
    position: 'absolute',
    padding: 6,
    fontWeight:400,
    color: '#666', marginTop: 6 
  }
});
