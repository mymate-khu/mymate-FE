// components/hooks/useAccounts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  getAccountDetail,
  updateAccount,
  setAccountStatus,          // ⬅️ 추가
  type AccountsPage,
  type ListParams,
  type UpsertAccountReq,
  type AccountEntity,
  type AccountStatus,        // ⬅️ 추가
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

export function useAccounts(params?: ListParams) {
  return useQuery({
    queryKey: KEY.list(params),
    queryFn: async () => {
      const page: AccountsPage = await fetchAccounts(params);
      const myIdNum = (await getMyId()) ?? 0;
      const myId = String(myIdNum);

      const tagged: (AccountEntity & { author: "me" | "mate" })[] =
        withOwnerTag(page.accounts, myId, ["createdBy", "memberId", "memberLoginId"]);

      const listItems = transformToListItems(tagged, myId);
      const paid = transformToPaidItems(tagged, myId);
      const unpaid = transformToUnpaidItems(tagged);

      return { page, listItems, paid, unpaid };
    },
  });
}

export function useAccountDetail(accountId: number) {
  return useQuery({
    queryKey: KEY.detail(accountId),
    queryFn: () => getAccountDetail(accountId),
    enabled: !!accountId,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertAccountReq) => createAccount(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts", "list"] });
    },
  });
}

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

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: number) => deleteAccount(accountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts", "list"] });
    },
  });
}

/** ✅ 상태 변경 훅 */
export function useSetAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AccountStatus }) =>
      setAccountStatus(id, status),
    onSuccess: (updated) => {
      // 목록 다시 불러오고, 상세 캐시도 최신값으로
      qc.invalidateQueries({ queryKey: ["accounts", "list"] });
      qc.setQueryData(KEY.detail(updated.id), updated);
    },
  });
}