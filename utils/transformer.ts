// utils/transformer.ts
import { PaidItem } from "@/app/adjustment/PaidCarousel";
import { UnpaidItem } from "@/app/adjustment/UnpaidCarousel";
import type { AdjustmentCardItem, SettlementStatus } from "@/app/adjustment/AdjustmentListCard";

/** 서버 응답 → PaidCarousel용 변환 */
export const transformToPaidItems = (accounts: any[], myId: number | string): PaidItem[] => {
  return (accounts ?? []).map((a): PaidItem => {
    // ✅ 숫자/문자 섞임 방지를 위해 문자열로 비교
    const isMine = String(a?.createdBy) === String(myId);
    const color: PaidItem["color"] = isMine ? "yellow" : "purple";
    const image: PaidItem["image"] = a?.imageUrl ? { uri: a.imageUrl } : undefined;

    return {
      id: String(a.id),
      title: a.title,
      amount: `-₩${Number(a.totalAmount).toLocaleString("ko-KR")}`,
      color,
      image,
    };
  });
};

/** 서버 응답 → UnpaidCarousel용 변환 */
export const transformToUnpaidItems = (accounts: any[]): UnpaidItem[] => {
  const unpaid = accounts.filter((a) => a.status !== "COMPLETED");
  return unpaid.map((a): UnpaidItem => ({
    id: String(a.id),
    title: a.title,
    amount: `-₩${Number(a.totalAmount).toLocaleString("ko-KR")}`,
  }));
};

/** "2024-01-15" → "24.01.15" */
const toDateLabel = (yyyyMmDd: string) => {
  const [y, m, d] = (yyyyMmDd || "").split("-");
  return `${String(y).slice(2)}.${m}.${d}`;
};

/** /api/accounts → AdjustmentList용 변환 */
export const transformToListItems = (accounts: any[], myId: number) => {
  return (accounts ?? []).map((a): AdjustmentCardItem & { status: SettlementStatus } => ({
    id: String(a.id),
    title: a.title,
    dateLabel: toDateLabel(a.expenseDate),
    prevAmount: `-${new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(a.totalAmount)}`,
    finalAmount: new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(a.receiveAmount),
    imageUri: a.imageUrl ?? undefined,
    avatars: (a.participants ?? []).slice(0, 4).map((p: any) =>
      p.avatarUrl ??
      `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(p.memberName ?? p.memberId)}`
    ),
    status: a.status === "COMPLETED" ? "done" : "todo",
  }));
};