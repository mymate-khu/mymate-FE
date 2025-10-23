// hooks/usePuzzles.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPuzzles, type Puzzle } from "@/components/apis/puzzles";
import { fetchMyProfile } from "@/components/apis/profile";
import { storage } from "@/components/apis/storage";

/* UI에서 쓰는 카드 타입 */
// ✅ id 추가!
export type StackItem = { id: number; title: string; desc?: string };
export type Mode = "me" | "mate";
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 요일 인덱스 계산 */
function dayOf(dateISO: string): DayIndex {
  const d = new Date(dateISO.length > 10 ? dateISO : `${dateISO}T00:00:00`);
  return d.getDay() as DayIndex;
}

/** 로그인 아이디 가져오기 (스토리지 -> API 순) */
async function getMyLoginId(): Promise<string | null> {
  try {
    const fromStorage = await storage.getItem("memberLoginId");
    if (fromStorage) return fromStorage;

    const me = await fetchMyProfile();
    console.log("✅ 내 프로필 데이터:", me);

    const loginId = (me as any).memberLoginId || null; // 백엔드 필드명에 맞춰 사용
    if (loginId) {
      await storage.setItem("memberLoginId", loginId);
      return loginId;
    }
    return null;
  } catch (err) {
    console.error("[getMyLoginId] failed:", err);
    return null;
  }
}

export function usePuzzles() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("me");
  const [day, setDay] = useState<DayIndex>(new Date().getDay() as DayIndex);

  const [rows, setRows] = useState<Puzzle[]>([]);
  const [myLoginId, setMyLoginId] = useState<string | null>(null);

  /** 최초 내 로그인 아이디 로드 */
  useEffect(() => {
    (async () => setMyLoginId(await getMyLoginId()))();
  }, []);

  /** 목록 조회 */
  const refetch = useCallback(async () => {
    if (!myLoginId) {
      // 아직 로그인 아이디 모르면 대기
      return;
    }
    setLoading(true);
    try {
      const page = await fetchPuzzles({ page: 0, size: 10 });
      const puzzles = page?.puzzles ?? [];
      console.log("🟡[usePuzzles] fetched:", puzzles.length);
      setRows(puzzles);
    } catch (e) {
      console.error("[usePuzzles] fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [myLoginId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  /** 모드/요일에 맞게 필터 & 매핑 */
  const { items, mateStatuses } = useMemo(() => {
    const filtered = rows.filter((p) =>
      mode === "me" ? p.memberLoginId === myLoginId : p.memberLoginId !== myLoginId
    );

    const byDay = filtered.filter((p) => dayOf(p.scheduledDate) === day);

    // ✅ 카드 변환: id 포함
    const items: StackItem[] = byDay.map((p) => ({
      id: p.id,                     // ← 여기!
      title: p.title,
      desc: p.description ?? undefined,
    }));

    const mateStatuses = byDay.map((p) => (p.status === "DONE" ? "done" : "inprogress"));

    console.log(
      `🟢[usePuzzles] mode=${mode} day=${day} myLoginId=${myLoginId} → show=${items.length}`
    );

    return { items, mateStatuses };
  }, [rows, mode, day, myLoginId]);

  return {
    loading,
    mode,
    setMode,
    day,
    setDay,
    items,          // ← 이제 각 item에 id가 들어있음
    mateStatuses,   // mate 모드에서 상태 뱃지
    refetch,
  };
}