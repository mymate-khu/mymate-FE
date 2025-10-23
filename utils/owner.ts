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
  if (!item || !myId) return false;

  const target =
    item[keys[0]] ?? item[keys[1]] ?? item[keys[2]] ?? undefined;

  return normalizeId(target) === normalizeId(myId);
}

/** 리스트에 author(me/mate) 태그를 주입 */
export function withOwnerTag<T extends Record<string, unknown>>(
  rows: T[],
  myId: string | null | undefined,
  keys?: string[], // 필요 시 키 우선순위 커스텀
): (T & { author: OwnerTag })[] {
  return rows.map((row) => ({
    ...row,
    author: isMine(row, myId, keys) ? "me" : "mate",
  }));
}