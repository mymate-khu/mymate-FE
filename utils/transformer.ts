// utils/transformer.ts
import { PaidItem } from "@/app/adjustment/PaidCarousel";
import { UnpaidItem } from "@/app/adjustment/UnpaidCarousel";
import type { AdjustmentCardItem, SettlementStatus } from "@/app/adjustment/AdjustmentListCard";

/* --------------------------------
 * 공통 유틸: author/owner 판정 & 색상
 * -------------------------------- */
type WithPossibleAuthor = {
  author?: "me" | "mate";
  createdBy?: number | string;
  memberId?: number | string;
  memberLoginId?: number | string;
};

const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();

function authorOf(row: WithPossibleAuthor, myId: number | string): "me" | "mate" {
  if (row?.author === "me" || row?.author === "mate") return row.author;

  const my = norm(myId);
  const cand =
    row?.createdBy ?? row?.memberId ?? row?.memberLoginId ?? undefined;

  return norm(cand) === my ? "me" : "mate";
}

const colorByAuthor = (row: WithPossibleAuthor, myId: number | string): PaidItem["color"] =>
  authorOf(row, myId) === "mate" ? "purple" : "yellow";

/* 통화 포맷 */
const fmtKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);

/* --------------------------------
 * 캐러셀(정산 완료)
 * -------------------------------- */
export const transformToPaidItems = (
  accounts: (WithPossibleAuthor & any)[],
  myId: number | string
): PaidItem[] => {
  return (accounts ?? []).map((a): PaidItem => {
    const color = colorByAuthor(a, myId);
    const image: PaidItem["image"] = a?.imageUrl ? { uri: a.imageUrl } : undefined;

    return {
      id: String(a.id),
      title: a.title,
      amount: `-${fmtKRW(Number(a.totalAmount) || 0)}`,
      color,
      image,
    };
  });
};

/* --------------------------------
 * 캐러셀(미정산)
 *  - UnpaidItem 타입에 color가 없다면 그대로 유지
 * -------------------------------- */
export const transformToUnpaidItems = (accounts: any[]): UnpaidItem[] => {
  const unpaid = (accounts ?? []).filter((a) => String(a.status).toUpperCase() !== "COMPLETED");
  return unpaid.map((a): UnpaidItem => ({
    id: String(a.id),
    title: a.title,
    amount: `-${fmtKRW(Number(a.totalAmount) || 0)}`,
  }));
};

/* --------------------------------
 * 리스트(상세 화면용 카드들)
 * -------------------------------- */
const toDateLabel = (yyyyMmDd: string) => {
  const [y, m, d] = (yyyyMmDd || "").split("-");
  return `${String(y).slice(2)}.${m}.${d}`;
};

// ✅ color는 선택적으로 추가(타입에 없어도 사용처에서 필요시 활용 가능)
export const transformToListItems = (
  accounts: (WithPossibleAuthor & any)[],
  myId: number | string
) => {
  return (accounts ?? []).map((a): (AdjustmentCardItem & { status: SettlementStatus } & { color?: "yellow" | "purple" }) => ({
    id: String(a.id),
    title: a.title,
    dateLabel: toDateLabel(a.expenseDate),
    prevAmount: `-${fmtKRW(Number(a.totalAmount) || 0)}`,
    finalAmount: fmtKRW(Number(a.receiveAmount) || 0),
    imageUri: a.imageUrl ?? undefined,
    avatars: (a.participants ?? []).slice(0, 4).map((p: any) =>
      p?.avatarUrl ??
      `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(p?.memberName ?? p?.memberId)}`
    ),
    status: String(a.status).toUpperCase() === "COMPLETED" ? "done" : "todo",
    category: a.category ?? "",
    color: colorByAuthor(a, myId), // ← 필요 시 리스트 카드에서도 색 분기 가능
  }));
};