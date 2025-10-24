// components/hooks/useAccounts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  getAccountDetail,
  updateAccount,
  type AccountsPage,
  type ListParams,
  type UpsertAccountReq,
  type AccountEntity,
} from "@/components/apis/account";
import { getMyId } from "@/components/apis/storage";

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

// 목록 + 화면용 데이터 세트
export function useAccounts(params?: ListParams) {
  return useQuery({
    queryKey: KEY.list(params),
    queryFn: async () => {
      const page: AccountsPage = await fetchAccounts(params);
      const myIdNum = (await getMyId()) ?? 0;
      const myId = String(myIdNum);

      // author(me/mate) 태그 주입 (작성자 createdBy 우선)
      const tagged: (AccountEntity & { author: "me" | "mate" })[] =
        withOwnerTag(page.accounts, myId, ["createdBy", "memberId", "memberLoginId"]);

      const listItems = transformToListItems(tagged, myId);
      const paid = transformToPaidItems(tagged, myId);
      const unpaid = transformToUnpaidItems(tagged);

      return { page, listItems, paid, unpaid };
    },
  });
}

// 상세
export function useAccountDetail(accountId: number) {
  return useQuery({
    queryKey: KEY.detail(accountId),
    queryFn: () => getAccountDetail(accountId),
    enabled: !!accountId,
  });
}

// 생성
export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertAccountReq) => createAccount(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts", "list"] });
    },
  });
}

// 수정
export function useUpdateAccount(accountId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<UpsertAccountReq>) => updateAccount(accountId, body),
    onSuccess: (updated: AccountEntity) => {
      qc.invalidateQueries({ queryKey: ["accounts", "list"] });
      qc.setQueryData(KEY.detail(accountId), updated);
    },
  });
}

// 삭제
export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: number) => deleteAccount(accountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts", "list"] });
    },
  });
}