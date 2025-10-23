import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import CalendarCard from '@/components/CalendarCard_modified';
import { router } from 'expo-router';
import { TokenReq } from '@/components/apis/axiosInstance';
import { buildCalendarDots, type PuzzleItem, type CalendarDots } from "../../components/utils/buildCalendarDots";



const initialEvents = {
  "2025-10-05":{
    dots:[{key:"m1",color:"rgba(255, 230, 0, 1)",selectedDotColor:"black"},
      {key:"m2",color:"rgba(255, 230, 0, 1)",selectedDotColor:"black"},
      {key:"m3",color:"rgba(255, 230, 0, 1)",selectedDotColor:"black"}
    ]
  }
};

const sampleCards = [
  { id: '1', name: '홍길동', discript: "양치하기" },
  { id: '2', name: '김철수', discript: "세수하기" },
  { id: '3', name: '이영희', discript: "그림그리기" },
];

const mateCards = [
  { id: 'm1', name: '룸메 A', discript: "청소하기" },
  { id: 'm2', name: '룸메 B', discript: "샤워하기" },

];

LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function MyCalendar() {


  const { width, height } = useWindowDimensions();

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const [current, setcurrent] = useState(todayISO)

  const [selected, setSelected] = useState(todayISO);
  const [events, setEvents] = useState<CalendarDots>(initialEvents);
  const [curmonth, setCurMonth] = useState(today.getMonth() + 1);
  const [curyear, setCurYear] = useState(today.getFullYear());
  const [myId, setMyId] = useState<string | undefined>(undefined);

  const getcurmonthdata = async (myid: string) => {
    try {
      const startDate = `${curyear}-${pad2(curmonth)}-01`;
      const endDate = `${curyear}-${pad2(curmonth)}-31`;
      const res = await TokenReq.get<PuzzleItem[]>("/api/puzzles/date/range", {
        params: { startDate, endDate },
      });
      console.log("월 데이터받기성공 ✅", res.data);

      const mapped = buildCalendarDots(myid, res.data);
      setEvents(mapped);


    }
    catch (err) {
      console.error("월 데이터 조회 실패 ❌");
      console.error(err)
    }
  }


  const getmyid = async (): Promise<string | undefined> => {
    try {
      const res = await TokenReq.get(
        `api/profile/me`
      )
      console.log("데이터받기성공", res)
      return res.data.data.memberId
    }
    catch (err) {
      console.error("Myid가져오기 실패")
      console.error(err)
    }
  }

  useEffect(() => {
    (async () => {
      const id = await getmyid();
      setMyId(id);
      if (id) await getcurmonthdata(id);
    })();
  }, []);

  useEffect(() => {
    if (myId) getcurmonthdata(myId);
  }, [curyear, curmonth, myId]); // 달/연도 바뀔 때 재조회


  const Header = (_: any) => (
    <View style={{ backgroundColor: "" }}>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'PretendardSemiBold',
          fontWeight: '500',
          fontSize: width * 0.06,
        }}
      >
        {String(curmonth).padStart(2, '0')}월
      </Text>

    </View>
  );

  const markedDates = useMemo(() => {
    const base = events ?? {};
    const prevDots = base[selected]?.dots ?? [];

    return {
      ...base,
      [selected]: {
        ...(base[selected] ?? {}),
        dots: prevDots,
        selected: true,
        selectedColor: "black",
      },
    };
  }, [events, selected]);



const listHeader = useMemo(
  () => (
    <View style={{ backgroundColor: 'white' }}>
      <View style={{ height: height * 0.05, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: width * 0.04, fontFamily: "PretendardSemiBold", fontWeight: 500 }}>캘린더</Text>
      </View>

      <CalendarCard
        value={selected}                 // 현재 선택된 날짜
        markedDates={markedDates}        // 기존 multi-dot 결과 그대로
        onChange={(dateString) => {      // 날짜 탭
          setSelected(dateString);
          setcurrent(dateString);        // '+' 눌러 calendar_add로 보낼 때 쓰던 current 유지
        }}
        onMonthChange={(yy, mm, cursorISO) => {  // 월 바뀔 때 기존 로직 유지
          setCurYear(yy);
          setCurMonth(mm);
          setcurrent(cursorISO);         // 'YYYY-MM-01'
          // getcurmonthdata는 이미 useEffect([curyear, curmonth, myId])에서 호출됨
        }}
        style={{ backgroundColor: 'white' }}
      />
    </View>
  ),
  [height, curyear, curmonth, selected, markedDates]
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
          {section.title === "My Puzzle" &&
            <Text style={{ marginLeft: 'auto', fontWeight: '400', fontSize: height * 0.03 }}
              onPress={() => {
                setEvents({});
                console.log(current);
                router.push({ pathname: "calendar_add", params: { date: current } })
              }}>
              +
            </Text>
          }
        </View>
      )}
      renderItem={({ item, section }) => {
        const bgColor =
          section.title === "My Puzzle" ? "rgba(255, 230, 0, 1)" : "rgba(211, 169, 255, 1)";

        return (
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.cardMenu}>
              <TouchableOpacity >
                <Text onPress={() => { console.log(1) }}>수정하기</Text>
              </TouchableOpacity>
              <Text> |</Text>

              <TouchableOpacity >
                <Text onPress={() => { console.log(2) }}> 삭제하기</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.title, { fontSize: height * 0.025 }]}>{item.name}</Text>
            <Text style={styles.discript}>
              {item.discript}
            </Text>
          </View>
        )

      }}
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
    fontWeight: 400,
  },
  title: {
    position: 'absolute',
    top: 8,
    padding: 6,
    fontWeight: 400,
    left: 8,
  },
  discript: {
    position: 'absolute',
    padding: 6,
    left: 8,
    fontWeight: 400,
    color: '#666', marginTop: 6
  }
});
