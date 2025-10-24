// utils/owner.ts
export type OwnerTag = "me" | "mate";

/** 내부 비교용: null/undefined 방지 + 공백/대소문자 차이 제거 */
function normalizeId(v: unknown): string {
  return String(v ?? "").trim().toLowerCase();
}

/**
 * 아이템이 내 것인지 판별.
 * - 아이템 안에서 어떤 키를 사용할지 우선순위대로 확인합니다.
 * - 기본: memberLoginId → memberId → createdBy
 */
export function isMine(
  item: Record<string, unknown>,
  myId: string | null | undefined,
  keys: string[] = ["memberLoginId", "memberId", "createdBy"],
): boolean {
  if (!item || !myId) {
    console.log("isMine - item 또는 myId가 없음:", { item: !!item, myId });
    return false;
  }

  const target =
    item[keys[0]] ?? item[keys[1]] ?? item[keys[2]] ?? undefined;

  console.log("isMine - 비교 데이터:", {
    myId: myId,
    target: target,
    normalizedMyId: normalizeId(myId),
    normalizedTarget: normalizeId(target),
    keys: keys,
    itemKeys: Object.keys(item)
  });

  const result = normalizeId(target) === normalizeId(myId);
  console.log("isMine - 결과:", result);
  return result;
}

/** 리스트에 author(me/mate) 태그를 주입 */
export function withOwnerTag<T extends Record<string, unknown>>(
  rows: T[],
  myId: string | null | undefined,
  keys?: string[], // 필요 시 키 우선순위 커스텀
): (T & { author: OwnerTag })[] {
  console.log("=== withOwnerTag 시작 ===");
  console.log("받은 rows:", rows);
  console.log("받은 myId:", myId);
  console.log("받은 keys:", keys);
  
  return rows.map((row, index) => {
    const isMineResult = isMine(row, myId, keys);
    const author = isMineResult ? "me" : "mate";
    
    console.log(`항목 ${index} - isMine:`, isMineResult, "author:", author);
    console.log(`항목 ${index} - row 데이터:`, {
      id: row.id,
      title: row.title,
      createdByMemberId: row.createdByMemberId,
      createdBy: row.createdBy
    });
    
    return {
      ...row,
      author,
    };
  });
}