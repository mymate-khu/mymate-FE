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
import { fetchMyProfile } from "@/components/apis/profile";
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
    staleTime: 0, // 캐시 무효화
    gcTime: 0, // 캐시 시간 0으로 설정
    queryFn: async () => {
      const page: AccountsPage = await fetchAccounts(params);
      const myProfile = await fetchMyProfile();
      const myId = String(myProfile.memberLoginId || myProfile.id);

      // 디버깅: API 응답 확인
      console.log("=== API 응답 데이터 ===");
      console.log("전체 accounts:", page.accounts);
      console.log("내 ID:", myId);
      
      // 첫 번째 항목만 상세 확인
      if (page.accounts.length > 0) {
        const firstAccount = page.accounts[0];
        console.log("첫 번째 항목 상세:", {
          id: firstAccount.id,
          title: firstAccount.title,
          createdByMemberId: firstAccount.createdByMemberId,
          createdBy: firstAccount.createdBy,
          status: firstAccount.status
        });
      }

      const tagged: (AccountEntity & { author: "me" | "mate" })[] =
        withOwnerTag(page.accounts, myId, ["createdByMemberId", "createdBy", "memberId", "memberLoginId"]);

      // 디버깅: 태그된 데이터 확인
      console.log("태그된 데이터:", tagged);

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