import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CalendarCard from '@/components/CalendarCard_modified';
import { router } from 'expo-router';
import { TokenReq } from '@/components/apis/axiosInstance';
import { buildCalendarDots, type PuzzleItem, type CalendarDots } from '../../components/utils/buildCalendarDots';
import { LocaleConfig } from 'react-native-calendars';
import RefreshableSectionList from '@/components/refresh/RefreshableSectionList';

/** ---------- Locale (ko) ---------- */
LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

/** ---------- Utils ---------- */
const pad2 = (n: number) => String(n).padStart(2, '0');
const toLocalYMD = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const lastDayOfMonthYMD = (year: number, month1to12: number) =>
  toLocalYMD(new Date(year, month1to12, 0));
const toKSTYMD = (s?: string | null) => {
  if (!s) return '';
  const d = new Date(s);
  return toLocalYMD(d);
};

/** ---------- Local Types ---------- */
type CardItem = {
  id: string;
  title: string;
  description?: string | null;
  scheduledDate?: string | null;
  ownerKey: string;
  ownerName?: string | null;
};

export default function MyCalendar() {
  const { width, height } = useWindowDimensions();

  const today = new Date();
  const todayYMD = toLocalYMD(today);

  const [currentISO, setCurrentISO] = useState(todayYMD);
  const [selected, setSelected] = useState(todayYMD);
  const [curMonth, setCurMonth] = useState(today.getMonth() + 1);
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [myId, setMyId] = useState<string | undefined>(undefined);

  const [events, setEvents] = useState<CalendarDots>({});
  const [allPuzzles, setAllPuzzles] = useState<PuzzleItem[]>([]);
  const [loading, setLoading] = useState(false);

  const lastFetchId = useRef(0);

  /** ---------- API: 내 로그인 아이디 ---------- */
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

  /** ---------- API: 해당 월 퍼즐 조회 ---------- */
  const fetchMonthPuzzles = useCallback(
    async (myLoginId: string, y: number, m: number, signal?: AbortSignal) => {
      const myFetchId = ++lastFetchId.current;
      try {
        if (!signal?.aborted) setLoading(true);

        const startDate = `${y}-${pad2(m)}-01`;
        const endDate = lastDayOfMonthYMD(y, m);

        const res = await TokenReq.get('/api/puzzles/date/range', {
          params: { startDate, endDate },
          signal,
        });

        if (myFetchId !== lastFetchId.current) return;

        const list: PuzzleItem[] = Array.isArray(res?.data?.data) ? res.data.data : [];
        setAllPuzzles(list);
        const dots = buildCalendarDots(myLoginId, list);
        setEvents(dots);
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
          return;
        }
        console.error('월 데이터 조회 실패 ❌', err);
      } finally {
        if (lastFetchId.current === myFetchId) setLoading(false);
      }
    },
    []
  );

  /** ---------- API: 퍼즐 삭제 ---------- */
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

  /** ---------- boot ---------- */
  useEffect(() => {
    (async () => {
      const id = await fetchMyId();
      if (id) setMyId(id);
    })();
  }, [fetchMyId]);

  /** ---------- myId/연/월 변경 시 조회 ---------- */
  useEffect(() => {
    if (!myId) return;
    const controller = new AbortController();
    fetchMonthPuzzles(myId, curYear, curMonth, controller.signal);
    return () => controller.abort();
  }, [myId, curYear, curMonth, fetchMonthPuzzles]);

  /** ---------- 선택 날짜의 퍼즐 목록 ---------- */
  const selectedDayPuzzles = useMemo(() => {
    return allPuzzles.filter((p) => toKSTYMD(p.scheduledDate) === selected);
  }, [allPuzzles, selected]);

  /** ---------- markedDates ---------- */
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

  /** ---------- 카드 데이터 ---------- */
  const myCards: CardItem[] = useMemo(() => {
    const mineKey = String(myId ?? '');
    return selectedDayPuzzles
      .filter((p) => (p.memberLoginId ?? String(p.memberId ?? '')) === mineKey)
      .map((p) => ({
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
      .filter((p) => (p.memberLoginId ?? String(p.memberId ?? '')) !== mineKey)
      .map((p) => ({
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

  /** ---------- 헤더 ---------- */
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
          onMonthChange={(yy, mm, cursorYMD) => {
            setCurYear(yy);
            setCurMonth(mm);
            setCurrentISO(cursorYMD);
          }}
          style={{ backgroundColor: 'white' }}
        />
      </View>
    ),
    [height, width, selected, markedDates]
  );

  /** ---------- render ---------- */
  return (
    <RefreshableSectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      onManualRefresh={async () => {
        if (loading) return;
        if (!myId) {
          const id = await fetchMyId();
          if (!id) return;
          setMyId(id);
        } else {
          await fetchMonthPuzzles(myId, curYear, curMonth);
        }
      }}
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

            {/* ✅ 제목 */}
            <Text style={[styles.title, { fontSize: height * 0.023 }]}>
              {item.ownerName ? `${item.ownerName} · ` : ''}
              {item.title}
            </Text>

            {/* ✅ 내용 (설명) */}
            {!!item.description && <Text style={styles.discript}>{item.description}</Text>}
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

/** ---------- styles ---------- */
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
    marginTop: 40,
  },
});
