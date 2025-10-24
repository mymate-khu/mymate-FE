// src/utils/buildCalendarDots.ts
export type PuzzleItem = {
  id: number;
  title: string;
  description: string;
  scheduledDate: string; // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss"
  completedAt: string | null;
  status: "PENDING" | "DONE" | string;

  /** ✅ 새 스키마 */
  memberLoginId?: string;

  /** (구버전 호환) */
  memberId?: number | string;

  recurrenceType?: string;
  recurrenceEndDate?: string | null;
  parentPuzzleId?: number | null;
  priority?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
};

export type CalendarDots = {
  [date: string]: {
    dots: Array<{ key: string; color: string; selectedDotColor: string }>;
  };
};

const MINE_COLOR = "rgba(255, 230, 0, 1)";
const OTHERS_COLOR = "rgba(211, 169, 255, 1)";

/** "YYYY-MM-DD"만 안전하게 추출 */
const ymd = (s: string | undefined | null) => (s ?? "").slice(0, 10);

/** 항목의 “소유자 키”를 통일된 문자열로 뽑기: 새 스키마 우선, 구스키마 폴백 */
const ownerKey = (it: PuzzleItem): string =>
  String(it.memberLoginId ?? it.memberId ?? "");

/**
 * 서버 배열 -> Calendar markedDates 포맷으로 변환
 * @param myKey  내 로그인 아이디(권장) 또는 과거 memberId(문자열로)
 */
export function buildCalendarDots(
  myKey: string,
  items: PuzzleItem[] | undefined | null
): CalendarDots {
  const result: CalendarDots = {};
  if (!items || items.length === 0) return result;

  // 날짜별로 묶기
  const byDate: Record<string, PuzzleItem[]> = {};
  for (const it of items) {
    const date = ymd(it.scheduledDate);
    if (!date) continue;
    (byDate[date] ??= []).push(it);
  }

  // 날짜마다 "내 항목 먼저" 정렬 후 dot 생성
  for (const date of Object.keys(byDate)) {
    const arr = byDate[date].slice().sort((a, b) => {
      const aMine = ownerKey(a) === myKey;
      const bMine = ownerKey(b) === myKey;
      if (aMine !== bMine) return aMine ? -1 : 1; // 내 것 먼저

      // 동률이면 createdAt(있으면) 또는 id 오름차순
      const ac = a.createdAt ?? "";
      const bc = b.createdAt ?? "";
      if (ac && bc && ac !== bc) return ac < bc ? -1 : 1;
      return a.id - b.id;
    });

    const dots = arr.map((it) => {
      const mine = ownerKey(it) === myKey;
      return {
        key: `${it.id}-${date}`, // 날짜+id로 유니크 보장
        color: mine ? MINE_COLOR : OTHERS_COLOR,
        selectedDotColor: "white",
      };
    });

    result[date] = { dots };
  }

  return result;
}
