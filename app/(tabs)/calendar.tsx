import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet, SectionList, Alert } from 'react-native';
import CalendarCard from '@/components/CalendarCard_modified';
import { router } from 'expo-router';
import { TokenReq } from '@/components/apis/axiosInstance';
import { buildCalendarDots, type PuzzleItem, type CalendarDots } from '../../components/utils/buildCalendarDots';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const pad2 = (n: number) => String(n).padStart(2, '0');
const toISODate = (d: Date) => d.toISOString().split('T')[0];
const lastDayOfMonthISO = (year: number, month1to12: number) =>
  toISODate(new Date(year, month1to12, 0)); // month+1의 0일 = 해당 월 말일

type CardItem = {
  id: string;
  title: string;
  description?: string | null;
  scheduledDate?: string | null;
  /** 소유자 식별자(로그인 아이디) */
  ownerKey: string;
  ownerName?: string | null;
};
const ymd = (s?: string | null) => (s ?? '').slice(0, 10);

export default function MyCalendar() {
  const { width, height } = useWindowDimensions();

  const today = new Date();
  const todayISO = toISODate(today);

  const [currentISO, setCurrentISO] = useState(todayISO);
  const [selected, setSelected] = useState(todayISO);

  const [curMonth, setCurMonth] = useState(today.getMonth() + 1);
  const [curYear, setCurYear] = useState(today.getFullYear());

  /** 내 로그인 아이디(memberLoginId) */
  const [myId, setMyId] = useState<string | undefined>(undefined);

  const [events, setEvents] = useState<CalendarDots>({});
  const [allPuzzles, setAllPuzzles] = useState<PuzzleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ---- API helpers ---------------------------------------------------------
  /** /api/profile/me 에서 내 로그인 아이디 가져오기 */

  const selectedDayPuzzles = useMemo(() => {
  return allPuzzles.filter(p => ymd(p.scheduledDate) === selected);
}, [allPuzzles, selected]);


  const fetchMyId = useCallback(async (): Promise<string | undefined> => {
    try {
      const res = await TokenReq.get('/api/profile/me');
      const loginId = res?.data?.data?.memberLoginId ?? res?.data?.data?.loginId;
      if (typeof loginId === 'string' && loginId.length > 0) return loginId;
      return undefined;
    } catch (err) {
      console.error('MyId 가져오기 실패', err);
      return undefined;
    }
  }, []);

  /** 해당 월 퍼즐 가져와서 달력 도트/리스트 반영 */
  const fetchMonthPuzzles = useCallback(
    async (myLoginId: string, y: number, m: number) => {
      try {
        setLoading(true);
        const startDate = `${y}-${pad2(m)}-01`;
        const endDate = lastDayOfMonthISO(y, m);
        const res = await TokenReq.get('/api/puzzles/date/range', {
          params: { startDate, endDate },
        });

        // ✅ 응답 언래핑: data: [...]
        const list: PuzzleItem[] = Array.isArray(res?.data?.data) ? res.data.data : [];
        setAllPuzzles(list);

        const dots = buildCalendarDots(myLoginId, list);
        setEvents(dots);
      } catch (err) {
        console.error('월 데이터 조회 실패 ❌', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removePuzzle = useCallback(
    async (puzzleId: string | number) => {
      try {
        await TokenReq.delete(`/api/puzzles/${puzzleId}`);
        if (myId) {
          await fetchMonthPuzzles(myId, curYear, curMonth);
        }
      } catch (err) {
        console.error('퍼즐 삭제 실패', err);
        Alert.alert('삭제 실패', '네트워크 상태를 확인해 주세요.');
      }
    },
    [myId, curYear, curMonth, fetchMonthPuzzles]
  );

  // ---- boot ---------------------------------------------------------------
  useEffect(() => {
    (async () => {
      const id = await fetchMyId();
      if (id) {
        setMyId(id);
        await fetchMonthPuzzles(id, curYear, curMonth);
      }
    })();
  }, [fetchMyId, fetchMonthPuzzles, curYear, curMonth]);

  // 월/연도 바뀔 때 재조회
  useEffect(() => {
    if (myId) fetchMonthPuzzles(myId, curYear, curMonth);
  }, [myId, curYear, curMonth, fetchMonthPuzzles]);

  // ---- UI memo ------------------------------------------------------------
  const markedDates = useMemo(() => {
    const base = events ?? {};
    const prevDots = base[selected]?.dots ?? [];
    return {
      ...base,
      [selected]: {
        ...(base[selected] ?? {}),
        dots: prevDots,
        selected: true,
        selectedColor: 'black',
      },
    };
  }, [events, selected]);

  /** 퍼즐 → 카드 아이템으로 매핑 (memberLoginId 기준) */
  const myCards: CardItem[] = useMemo(() => {
  const mineKey = String(myId ?? '');
  return selectedDayPuzzles
    .filter(p => (p.memberLoginId ?? String(p.memberId ?? '')) === mineKey)
    .map(p => ({
      id: String(p.id),
      title: p.title ?? '(제목 없음)',
      description: p.description ?? null,
      scheduledDate: p.scheduledDate ?? null,
      ownerKey: String(p.memberLoginId ?? p.memberId ?? ''),
      ownerName: '나',
    }));
}, [selectedDayPuzzles, myId]);

  const mateCards: CardItem[] = useMemo(() => {
  const mineKey = String(myId ?? '');
  return selectedDayPuzzles
    .filter(p => (p.memberLoginId ?? String(p.memberId ?? '')) !== mineKey)
    .map(p => ({
      id: String(p.id),
      title: p.title ?? '(제목 없음)',
      description: p.description ?? null,
      scheduledDate: p.scheduledDate ?? null,
      ownerKey: String(p.memberLoginId ?? p.memberId ?? ''),
      ownerName: '룸메이트',
    }));
}, [selectedDayPuzzles, myId]);

  const sections = useMemo(
    () => [
      { title: 'My Puzzle', data: myCards, keyPrefix: 'my-' },
      { title: "Mate's Puzzle", data: mateCards, keyPrefix: 'mate-' },
    ],
    [myCards, mateCards]
  );

  const listHeader = useMemo(
    () => (
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ height: height * 0.05, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: width * 0.04, fontFamily: 'PretendardSemiBold', fontWeight: '500' }}>
            캘린더
          </Text>
        </View>

        <CalendarCard
          value={selected}
          markedDates={markedDates}
          onChange={(dateString) => {
            setSelected(dateString);
            setCurrentISO(dateString);
          }}
          onMonthChange={(yy, mm, cursorISO) => {
            setCurYear(yy);
            setCurMonth(mm);
            setCurrentISO(cursorISO); // YYYY-MM-01
          }}
          style={{ backgroundColor: 'white' }}
          // 필요하면 CalendarCard 내부에서 loading 표시를 처리하게 prop을 내려도 됨
          // loading={loading}
        />
      </View>
    ),
    [height, width, selected, markedDates]
  );

  // ---- render -------------------------------------------------------------
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          {listHeader}
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
          {section.title === 'My Puzzle' && (
            <Text
              style={{ marginLeft: 'auto', fontWeight: '400', fontSize: height * 0.03 }}
              onPress={() => {
                router.push('/home/home_puzzle/PuzzleCreate');
              }}
            >
              +
            </Text>
          )}
        </View>
      )}
      renderItem={({ item, section }) => {
        const bgColor = section.title === 'My Puzzle' ? 'rgba(255, 230, 0, 1)' : 'rgba(211, 169, 255, 1)';
        return (
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.cardMenu}>
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: '/home/home_puzzle/PuzzleEdit', params: { id: item.id } });
                }}
              >
                <Text>수정하기</Text>
              </TouchableOpacity>
              <Text> |</Text>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert('삭제', '정말로 삭제할까요?', [
                    { text: '취소', style: 'cancel' },
                    { text: '삭제', style: 'destructive', onPress: () => removePuzzle(item.id) },
                  ]);
                }}
              >
                <Text> 삭제하기</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.title, { fontSize: height * 0.023 }]}>
              {item.ownerName ? `${item.ownerName} · ` : ''}
              {item.title}
            </Text>
            {!!item.description && <Text style={styles.discript}>{item.description}</Text>}
            {!!item.scheduledDate && (
              <Text style={[styles.discript, { marginTop: 30 }]}>{item.scheduledDate}</Text>
            )}
          </View>
        );
      }}
      ListEmptyComponent={
        !loading ? (
          <View style={{ padding: 24, alignItems: 'center', backgroundColor: 'white' }}>
            <Text>해당 월에 등록된 퍼즐이 없어요.</Text>
          </View>
        ) : null
      }
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
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    position: 'absolute',
    top: 8,
    left: 8,
    padding: 6,
    fontWeight: '400',
  },
  discript: {
    position: 'absolute',
    left: 8,
    padding: 6,
    fontWeight: '400',
    color: '#666',
    marginTop: 6,
  },
});
