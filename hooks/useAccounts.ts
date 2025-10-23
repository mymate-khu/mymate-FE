// components/hooks/useAccounts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount, deleteAccount, fetchAccounts, getAccountDetail, updateAccount,
  type AccountsPage, type ListParams, type UpsertAccountReq, type AccountEntity,
} from "@/components/apis/account";
import { getMyId } from "@/components/apis/storage";

// ⬇️ 추가
import { withOwnerTag } from "@/utils/owner";
import {
  transformToListItems,
  transformToPaidItems,
  transformToUnpaidItems,
} from "@/utils/transformer";

const KEY = {
  list: (params?: ListParams) => ["accounts", "list", params] as const,
  detail: (id: number) => ["accounts", "detail", id] as const,
};

export function useAccounts(params?: ListParams) {
  return useQuery({
    queryKey: KEY.list(params),
    queryFn: async () => {
      const page: AccountsPage = await fetchAccounts(params);
      const myIdNum = (await getMyId()) ?? 0;
      const myId = String(myIdNum);         // owner 판정은 문자열 비교로 통일

      // ① author(me/mate) 주입 (정산은 createdBy가 보통 “작성자”)
      const tagged: (AccountEntity & { author: "me" | "mate" })[] =
        withOwnerTag(page.accounts, myId, ["createdBy", "memberId", "memberLoginId"]);

      // ② 변환기들이 색/필드를 쓸 수 있도록 tagged 전달
      const listItems = transformToListItems(tagged, myId);
      const paid      = transformToPaidItems(tagged, myId);
      const unpaid    = transformToUnpaidItems(tagged);

      // 원본 page는 그대로 두고, 화면용 세트만 반환
      return { page, listItems, paid, unpaid };
    },
  });
}