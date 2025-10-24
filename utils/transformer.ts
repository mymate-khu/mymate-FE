// utils/transformer.ts
import { PaidItem } from "@/app/adjustment/PaidCarousel";
import { UnpaidItem } from "@/app/adjustment/UnpaidCarousel";
import type { AdjustmentCardItem, SettlementStatus } from "@/app/adjustment/AdjustmentListCard";

/* --------------------------------
 * 공통 유틸: author/owner 판정 & 색상
 * -------------------------------- */
type WithPossibleAuthor = {
  author?: "me" | "mate";
  createdByMemberId?: number | string; // API 응답의 createdByMemberId 필드
  createdBy?: number | string;
  memberId?: number | string;
  memberLoginId?: number | string;
};

const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();

function authorOf(row: WithPossibleAuthor, myId: number | string): "me" | "mate" {
  if (row?.author === "me" || row?.author === "mate") {
    console.log("authorOf - 이미 태그된 author 사용:", row.author);
    return row.author;
  }

  const my = norm(myId);
  // API 응답의 createdByMemberId 필드 사용
  const cand =
    row?.createdByMemberId ?? row?.createdBy ?? row?.memberId ?? row?.memberLoginId ?? undefined;

  console.log("authorOf - 비교 데이터:", {
    myId: my,
    candidate: norm(cand),
    createdByMemberId: row?.createdByMemberId,
    createdBy: row?.createdBy,
    memberId: row?.memberId,
    memberLoginId: row?.memberLoginId
  });

  const result = norm(cand) === my ? "me" : "mate";
  console.log("authorOf - 결과:", result);
  return result;
}

const colorByAuthor = (row: WithPossibleAuthor, myId: number | string): PaidItem["color"] => {
  const author = authorOf(row, myId);
  const color = author === "mate" ? "purple" : "yellow";
  console.log("colorByAuthor - author:", author, "color:", color);
  return color;
};

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
  console.log("=== transformToPaidItems 시작 ===");
  console.log("받은 accounts:", accounts);
  console.log("받은 myId:", myId);
  
  return (accounts ?? []).map((a): PaidItem => {
    // 디버깅: 각 항목의 데이터 확인
    console.log("transformToPaidItems - 항목 데이터:", {
      id: a.id,
      title: a.title,
      createdByMemberId: a.createdByMemberId,
      author: a.author,
      myId: myId
    });
    
    const color = colorByAuthor(a, myId);
    console.log("결정된 색상:", color);
    
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
    accountId: Number(a.id), // API 호출을 위한 실제 account ID 추가
    title: a.title,
    dateLabel: toDateLabel(a.expenseDate),
    prevAmount: `-${fmtKRW(Number(a.totalAmount) || 0)}`,
    finalAmount: fmtKRW(Number(a.receiveAmount) || 0),
    imageUri: a.imageUrl ?? undefined,
    avatars: (a.participants ?? []).slice(0, 4).map((p: any) =>
      p?.avatarUrl ??
      `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(p?.memberName ?? p?.memberId)}`
    ),
    status: String(a.status).toUpperCase() === "COMPLETED" ? "settled" : "unsettled", // 올바른 상태 매핑
    category: a.category ?? "",
    color: colorByAuthor(a, myId), // ← 필요 시 리스트 카드에서도 색 분기 가능
  }));
};