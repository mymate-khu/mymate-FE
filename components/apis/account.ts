// components/apis/account.ts
import { TokenReq } from "@/components/apis/axiosInstance";

/* ========= 공통 타입 ========= */

export type AccountStatus = "PENDING" | "COMPLETED";

export type Participant = {
  id: number;
  memberId: number;
  memberName: string;
  paymentAmount: number;
  isPaid: boolean;
};

export type AccountEntity = {
  id: number;
  title: string;
  description: string;
  expenseDate: string;
  category: string;
  imageUrl: string | null;
  totalAmount: number;
  receiveAmount: number;
  status: AccountStatus | string;
  groupId: number;
  createdByMemberId: string;  // API 응답의 createdByMemberId 필드
  createdBy: number;          // 백엔드 응답 키가 다르면 필요에 맞게 바꿔줘도 됨
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
};

export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code?: string;
  message?: string;
  data: T;
};

/* ========= 요청 바디 ========= */

export type UpsertAccountReq = {
  title: string;
  description: string;
  expenseDate: string;
  category: string;
  imageUrl: string | null;
  totalAmount: number;
  receiveAmount: number;
  participantIds: number[];
};

/* ========= 페이징 ========= */

export type AccountsPage = {
  accounts: AccountEntity[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
};

export type ListParams = {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
};

/* ========= 내부 유틸 ========= */

function normErr(err: any, fallback = "요청 처리 중 오류가 발생했어요.") {
  const serverMsg = err?.response?.data?.message;
  if (serverMsg) return new Error(serverMsg);
  if (typeof err?.message === "string" && err.message.includes("Network")) {
    return new Error("서버에 연결할 수 없어요.");
  }
  return new Error(err?.message || fallback);
}

function stripUndefined<T extends object>(obj: T): T {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out as T;
}

/* ========= API ========= */

export async function createAccount(payload: UpsertAccountReq): Promise<AccountEntity> {
  try {
    const { data } = await TokenReq.post<ApiEnvelope<AccountEntity>>("/api/accounts", payload);
    if (!data?.isSuccess) throw new Error(data?.message || "정산 등록 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 등록 실패");
  }
}

export async function fetchAccounts(params?: ListParams): Promise<AccountsPage> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<AccountsPage>>("/api/accounts", { params });
    if (!data?.isSuccess) throw new Error(data?.message || "정산 목록 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 목록 조회 실패");
  }
}

export async function getAccountDetail(accountId: number): Promise<AccountEntity> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<AccountEntity>>(`/api/accounts/${accountId}`);
    if (!data?.isSuccess) throw new Error(data?.message || "정산 상세 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 상세 조회 실패");
  }
}

export async function updateAccount(
  accountId: number,
  payload: Partial<UpsertAccountReq>
): Promise<AccountEntity> {
  try {
    const body = stripUndefined(payload);
    const { data } = await TokenReq.put<ApiEnvelope<AccountEntity>>(
      `/api/accounts/${accountId}`,
      body
    );
    if (!data?.isSuccess) {
      throw new Error(data?.message || "정산 수정 실패");
    }
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 수정 실패");
  }
}

export async function deleteAccount(accountId: number): Promise<{ message?: string }> {
  try {
    const { data } = await TokenReq.delete<ApiEnvelope<null>>(`/api/accounts/${accountId}`);
    if (!data?.isSuccess) throw new Error(data?.message || "정산 삭제 실패");
    return { message: data?.message };
  } catch (e) {
    throw normErr(e, "정산 삭제 실패");
  }
}

/** ✅ 상태 변경: PATCH /api/accounts/{accountId}/status  { status } */
export async function setAccountStatus(
  accountId: number,
  status: AccountStatus
): Promise<AccountEntity> {
  try {
    const { data } = await TokenReq.patch<ApiEnvelope<AccountEntity>>(
      `/api/accounts/${accountId}/status`,
      { status } // PENDING | COMPLETED
    );
    if (!data?.isSuccess) throw new Error(data?.message || "정산 상태 변경 실패");
    return data.data; // 최신 엔티티 반환
  } catch (e) {
    throw normErr(e, "정산 상태 변경 실패");
  }
}

/** ✅ 검색: GET /api/accounts/search?keyword={keyword} */
export async function searchAccounts(keyword: string, params?: ListParams): Promise<AccountsPage> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<AccountsPage>>("/api/accounts/search", {
      params: { ...params, keyword }
    });
    if (!data?.isSuccess) throw new Error(data?.message || "정산 검색 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 검색 실패");
  }
}

/** ✅ 카테고리별 조회: GET /api/accounts/category?category={category} */
export async function getAccountsByCategory(category: string, params?: ListParams): Promise<AccountsPage> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<AccountsPage>>("/api/accounts/category", {
      params: { ...params, category }
    });
    if (!data?.isSuccess) throw new Error(data?.message || "카테고리별 정산 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "카테고리별 정산 조회 실패");
  }
}