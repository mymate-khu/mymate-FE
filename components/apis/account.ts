// components/apis/account.ts
import { TokenReq } from "@/components/apis/axiosInstance";

/** 서버 요청 바디 */
export type CreateAccountReq = {
  title: string;           // ex) "동숲"
  description: string;     // ex) "동숲 정산"
  expenseDate: string;     // "YYYY-MM-DD"
  category: string;        // "식비" 등
  imageUrl: string | null; // 이미지 업로드 주소(없으면 null)
  totalAmount: number;     // 120000
  receiveAmount: number;   // 100000
  participantIds: number[]; // [1,2,3]
};

/** 서버 응답(문서 기준) */
export type CreateAccountRes = {
  id: number;
  title: string;
  description: string;
  expenseDate: string;
  category: string;
  imageUrl: string | null;
  totalAmount: number;
  receiveAmount: number;
  status: "PENDING" | "COMPLETED" | string;
  groupId: number;
  createdBy: number;
  participants: Array<{
    id: number;
    memberId: number;
    memberName: string;
    paymentAmount: number;
    isPaid: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
};

/** 공통 래퍼(팀원 코드와 동일한 패턴) */
export const createAccount = async (payload: CreateAccountReq) => {
  try {
    const res = await TokenReq.post<{
      isSuccess: boolean;
      code?: string;
      message?: string;
      data: CreateAccountRes;
      success?: boolean; // 혹시 백엔드가 success도 줄 수 있어 대비
    }>("/api/accounts", payload);

    // 백엔드 문서대로면 isSuccess가 true여야 함
    if (res.data?.isSuccess === false) {
      throw new Error(res.data?.message || "정산 등록 실패");
    }
    return res.data.data; // 실제 엔티티 반환
  } catch (err: any) {
    // 네트워크/프리플라이트/CORS 등 에러 메시지 정리
    const msg =
      err?.response?.data?.message ||
      (err?.message?.includes("Network") ? "서버에 연결할 수 없어요." : err?.message) ||
      "알 수 없는 오류";
    throw new Error(msg);
  }
};