import React, { useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export default function MyCalendar() {
  const { height } = useWindowDimensions();

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const [selected, setSelected] = useState(todayISO);
  const [curmonth, setCurMonth] = useState(today.getMonth() + 1); // 1~12
  const [curyear, setCurYear] = useState(today.getFullYear());

  // 헤더(월/화살표) 밑에 선을 그리기 위해 renderHeader 사용
  const Header = (_: any) => (
    <View style={{ width: '100%' }}>
      {/* 월 텍스트 영역(가운데), 좌우 화살표는 라이브러리가 따로 그려줌 */}
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

      {/* 헤더 아래 구분선 */}
      <View style={{ height: 2, backgroundColor: '#111', marginTop: 6 }} />
    </View>
  );

  return (
    <View style={{ backgroundColor: 'white', height:height*1.0 }}>
      <View style={{height:height*0.05,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:height*0.02}}>캘린더</Text>
      </View>
      <View style={{height:height*0.05,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:height*0.04}}>{curyear}</Text>
      </View>
      <Calendar
        // 초기 표시 월
        current={todayISO}

        // 헤더 커스텀 (월/연 표시는 우리가 그리고, 화살표는 기본 제공 사용)
        renderHeader={Header}

        // 달 바뀔 때 연/월 상태를 확실히 동기화 (화살표/스와이프 모두 커버)
        onMonthChange={(m: DateData) => {
          setCurYear(m.year);
          setCurMonth(m.month);
        }}

        // 날짜 선택
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, selectedColor: 'yellow' },
        }}

        monthFormat={'MM월'} // 내부 타이틀은 우리가 헤더에서 직접 보여주지만, 유지해도 무방

        theme={{
          textMonthFontFamily: 'PretendardSemiBold',
          textDayHeaderFontFamily: 'PretendardSemiBold',
          textDayFontFamily: 'PretendardSemiBold',
          textDayFontWeight: '500',
          todayTextColor: 'red',
          arrowColor: 'black',
        }}

        // 화살표 콜백에서는 이동만 수행하고, 상태 갱신은 onMonthChange에 맡김
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        onPressArrowRight={(addMonth) => addMonth()}

        // 높이는 퍼센트가 잘 안 먹는 경우가 있어 기본 높이에 맡기고, 필요 시 scale 사용
        // style={{ height: '70%' }}
        style={{ backgroundColor: 'white' }}
      />

      {/* 하단 빨간 바 */}
      <View
        style={{
          borderTopColor:"lightgray",
          borderTopWidth:1,
          flexDirection: 'row',
          alignItems: 'center',
          height: height * 0.07, // 5vh 느낌
          paddingHorizontal: '5%',
        }}
      >
        <Text style={{ fontWeight: '400', fontSize: height * 0.03, }}>My Puzzle</Text>
        <Text style={{ marginLeft: 'auto', fontWeight: '400', fontSize: height * 0.03 }}>+</Text>
      </View>
    </View>
  );
}
