// components/apis/rules.ts
import { TokenReq } from "@/components/apis/axiosInstance";

export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code?: string;
  message?: string;
  data: T;
};

export type Rulebook = {
  id: number;
  title: string;
  content: string;
  groupId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
};

function normErr(e: any, fallback: string): never {
  const msg = e?.response?.data?.message || e?.message || fallback;
  const err: any = new Error(msg);
  err.status = e?.response?.status;
  err.code = e?.response?.data?.code;
  throw err;
}

export async function fetchRulebooks(): Promise<Rulebook[]> {
  try {
    const { data } = await TokenReq.get<ApiEnvelope<Rulebook[]>>("/api/rulebooks");
    if (!data?.isSuccess) throw new Error(data?.message || "룰북 목록 조회 실패");
    return data.data;
  } catch (e) {
    normErr(e, "룰북 목록 조회 실패");
  }
}

export type CreateRulebookReq = { title: string; content: string };
export async function createRulebook(payload: CreateRulebookReq): Promise<Rulebook> {
  try {
    const { data } = await TokenReq.post<ApiEnvelope<Rulebook>>("/api/rulebooks", payload);
    if (!data?.isSuccess) throw new Error(data?.message || "룰북 생성 실패");
    return data.data;
  } catch (e) {
    normErr(e, "룰북 생성 실패");
  }
}

export type UpdateRulebookReq = Partial<CreateRulebookReq>;
export async function updateRulebook(id: number, payload: UpdateRulebookReq): Promise<Rulebook> {
  try {
    const { data } = await TokenReq.put<ApiEnvelope<Rulebook>>(`/api/rulebooks/${id}`, payload);
    if (!data?.isSuccess) throw new Error(data?.message || "룰북 수정 실패");
    return data.data;
  } catch (e) {
    normErr(e, "룰북 수정 실패");
  }
}

export async function deleteRulebook(id: number): Promise<void> {
  try {
    const res = await TokenReq.delete(`/api/rulebooks/${id}`);
    if (res.status === 204) return;
    if (res.status === 200 && (res.data == null || res.data === "")) return;

    const maybe = res.data as ApiEnvelope<null> | undefined;
    if (maybe && typeof maybe.isSuccess === "boolean" && !maybe.isSuccess) {
      throw new Error(maybe.message || "룰북 삭제 실패");
    }
  } catch (e) {
    normErr(e, "룰북 삭제 실패");
  }
}