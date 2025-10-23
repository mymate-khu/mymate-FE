// hooks/usePuzzles.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPuzzles, deletePuzzle, type Puzzle } from "@/components/apis/puzzles";
import { fetchMyProfile } from "@/components/apis/profile";
import { storage } from "@/components/apis/storage";

/* UI 카드 타입: id 포함 */
export type StackItem = { id: number; title: string; desc?: string };
export type Mode = "me" | "mate";
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** "YYYY-MM-DD" 또는 ISO 날짜 → 요일 인덱스 */
function dayOf(dateISO: string): DayIndex {
  const d = new Date(dateISO.length > 10 ? dateISO : `${dateISO}T00:00:00`);
  return d.getDay() as DayIndex;
}

/** 로그인 ID 얻기 (storage → API) */
async function getMyLoginId(): Promise<string | null> {
  try {
    const cached = await storage.getItem("memberLoginId");
    if (cached) return cached;

    const me = await fetchMyProfile();
    console.log("✅ 내 프로필 데이터:", me);

    const loginId = (me as any).memberLoginId || null;
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

  /** 최초 1회 내 로그인 아이디 로드 */
  useEffect(() => {
    (async () => setMyLoginId(await getMyLoginId()))();
  }, []);

  /** 목록 조회 */
  const refetch = useCallback(async () => {
    if (!myLoginId) return;
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

  /** 삭제 (낙관적 갱신 + 실패시 롤백) */
  const remove = useCallback(
    async (id: number) => {
      console.log("[usePuzzles.remove] try delete id:", id);
      const prev = rows;
      // 낙관적 업데이트
      setRows(prev.filter(p => p.id !== id));

      try {
        const res = await deletePuzzle(id);
        console.log("[usePuzzles.remove] success:", id, res?.message);
        // 필요하면 서버 상태 재동기화
        // await refetch();
      } catch (e) {
        console.error("[usePuzzles.remove] failed:", e);
        // 롤백
        setRows(prev);
        throw e;
      }
    },
    [rows]
  );

  /** 모드/요일 필터 + 카드 매핑 */
  const { items, mateStatuses } = useMemo(() => {
    const filtered = rows.filter(p =>
      mode === "me" ? p.memberLoginId === myLoginId : p.memberLoginId !== myLoginId
    );
    const byDay = filtered.filter(p => dayOf(p.scheduledDate) === day);

    const items: StackItem[] = byDay.map(p => ({
      id: p.id,
      title: p.title,
      desc: p.description ?? undefined,
    }));

    const mateStatuses = byDay.map(p => (p.status === "DONE" ? "done" : "inprogress"));

    console.log(`🟢[usePuzzles] mode=${mode} day=${day} myLoginId=${myLoginId} → show=${items.length}`);
    return { items, mateStatuses };
  }, [rows, mode, day, myLoginId]);

  return {
    loading,
    mode,
    setMode,
    day,
    setDay,
    items,
    mateStatuses,
    refetch,
    remove,          // ← 컴포넌트에서 onDelete에 연결
  };
}