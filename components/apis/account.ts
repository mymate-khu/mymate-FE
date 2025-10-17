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
  expenseDate: string;       // "YYYY-MM-DD"
  category: string;
  imageUrl: string | null;
  totalAmount: number;
  receiveAmount: number;
  status: AccountStatus | string;
  groupId: number;
  createdBy: number;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
};

export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code?: string;      // 예: ACCOUNT4001, ACCOUNT4002...
  message?: string;
  data: T;
};

/* ========= 요청 바디 ========= */

export type UpsertAccountReq = {
  title: string;
  description: string;
  expenseDate: string;       // "YYYY-MM-DD"
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
  page?: number;               // default 0
  size?: number;               // default 10
  sort?: string;               // default createdAt
  direction?: "asc" | "desc";  // default desc
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

/** 생성: POST /api/accounts */
export async function createAccount(payload: UpsertAccountReq): Promise<AccountEntity> {
  try {
    const { data } = await TokenReq.post<ApiEnvelope<AccountEntity>>("/api/accounts", payload);
    if (!data?.isSuccess) throw new Error(data?.message || "정산 등록 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 등록 실패");
  }
}

/** 목록: GET /api/accounts?page&size&sort&direction */
export async function fetchAccounts(params?: ListParams): Promise<AccountsPage> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<AccountsPage>>("/api/accounts", { params });
    if (!data?.isSuccess) throw new Error(data?.message || "정산 목록 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 목록 조회 실패");
  }
}

/** 상세: GET /api/accounts/{accountId} */
export async function getAccountDetail(accountId: number): Promise<AccountEntity> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<AccountEntity>>(`/api/accounts/${accountId}`);
    if (!data?.isSuccess) throw new Error(data?.message || "정산 상세 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 상세 조회 실패");
  }
}

/** 수정: PUT /api/accounts/{accountId}  (PENDING 상태에서만 가능) */
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
      // 예) ACCOUNT4002 "이미 완료된 정산입니다."
      throw new Error(data?.message || "정산 수정 실패");
    }
    return data.data;
  } catch (e) {
    throw normErr(e, "정산 수정 실패");
  }
}

/** 삭제: DELETE /api/accounts/{accountId}
 *  - 생성자만 가능
 *  - COMPLETED 상태면 불가
 */
export async function deleteAccount(accountId: number): Promise<{ message?: string }> {
  try {
    const { data } = await TokenReq.delete<ApiEnvelope<null>>(`/api/accounts/${accountId}`);
    if (!data?.isSuccess) throw new Error(data?.message || "정산 삭제 실패");
    return { message: data?.message };
  } catch (e) {
    throw normErr(e, "정산 삭제 실패");
  }
}