// app/rules/hooks/useRulebooks.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchRulebooks,
  createRulebook,
  updateRulebook,
  deleteRulebook,
  type Rulebook,
  type CreateRulebookReq,
  type UpdateRulebookReq,
} from "@/components/apis/rules";
import { getMyId } from "@/components/apis/storage";

/** UI 카드 타입 (RuleCardItem) */
export type RuleCardItem = {
  id: number;
  order: number;                 // 화면에서 계산
  title: string;
  description: string;           // = content
  author: "me" | "mate";         // 화면에서 계산(createdBy 기준)
};

/** 서버 응답 → 화면 카드로 변환 (정렬 후 인덱스 기반 order, createdBy로 author 계산) */
function toCards(rows: Rulebook[], myId: number | null): RuleCardItem[] {
  // 최신순(내림차순) 정렬 보강
  const sorted = [...rows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted.map((r, idx) => ({
    id: r.id,
    order: idx + 1,
    title: r.title,
    description: r.content,
    author: myId && r.createdBy === myId ? "me" : "mate",
  }));
}

export function useRulebooks() {
  const [list, setList] = useState<RuleCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<unknown>(null);
  const [myId, setMyId] = useState<number | null>(null);

  // 내 memberId 로드
  useEffect(() => {
    (async () => setMyId(await getMyId()))();
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchRulebooks();
      setList(toCards(rows, myId));
      setErr(null);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [myId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  /** 생성: { title, content } 만 보냄 */
  const create = useCallback(
    async (payload: CreateRulebookReq) => {
      await createRulebook({ title: payload.title, content: payload.content });
      // 생성 후 전체 새로고침이 가장 간단하고 정확
      await refetch();
    },
    [refetch]
  );

  /** 수정: { title?, content? } 만 보냄 */
  const update = useCallback(
    async (id: number, payload: UpdateRulebookReq) => {
      await updateRulebook(id, payload);
      await refetch();
    },
    [refetch]
  );

  /** 삭제: 낙관적 업데이트 후 실패 시 롤백하거나, 간단히 새로고침 */
  const remove = useCallback(
    async (id: number) => {
      // 낙관적: 일단 필터링 + order 재계산
      const snapshot = list;
      setList(prev => prev.filter(it => it.id !== id).map((it, idx) => ({ ...it, order: idx + 1 })));
      try {
        await deleteRulebook(id);
        // 서버 정합성 보장 위해 한 번 더 동기화
        await refetch();
      } catch (e) {
        setList(snapshot);
        throw e;
      }
    },
    [list, refetch]
  );

  /** 다음 order (UI 표기용) — 리스트 길이에 기반 */
  const nextOrder = useMemo(() => list.length + 1, [list]);

  return { list, loading, error, refetch, create, update, remove, nextOrder };
}