// components/apis/puzzles.ts
import { TokenReq } from "@/components/apis/axiosInstance";

/* ========= 공통 타입 ========= */
type Envelope<T> = {
  isSuccess: boolean;
  code?: string;
  message?: string;
  data: T;
  success?: boolean;
};

/* ========= 유틸 ========= */
function normErr(err: any, fallback = "요청 처리 중 오류가 발생했어요.") {
  const msg = err?.response?.data?.message;
  if (msg) return new Error(msg);
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

/* ========= 도메인 타입 ========= */
export type Puzzle = {
  id: number;
  title: string;
  description: string;
  scheduledDate: string; // "YYYY-MM-DD"
  completedAt?: string | null;
  status: "INPROGRESS" | "DONE";
  memberLoginId: string;
  recurrenceType?: string | null;
  recurrenceEndDate?: string | null;
  parentPuzzleId?: number | null;
  priority?: string | null;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PuzzlesPage = {
  puzzles: Puzzle[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
};

/* ========= 목록 조회 ========= */
/** GET /api/puzzles?pageable.page&…  (스웨거 스키마 맞춤) */
export async function fetchPuzzles({
  page = 0,
  size = 10,
  sort = [],
}: {
  page?: number;
  size?: number;
  sort?: string[];
} = {}): Promise<PuzzlesPage> {
  try {
    const params: any = {
      "pageable.page": page,
      "pageable.size": size,
    };
    if (sort.length) params["pageable.sort"] = sort;

    const { data } = await TokenReq.get<Envelope<PuzzlesPage>>("/api/puzzles", { params });
    if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 목록 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "퍼즐 목록 조회 실패");
  }
}

/* ========= 생성 ========= */
/** POST /api/puzzles */
export type CreatePuzzleReq = {
  title: string;
  description: string;
  scheduledDate: string; // "YYYY-MM-DD"
  priority?: string;
  category?: string;
};

export async function createPuzzle(payload: CreatePuzzleReq): Promise<Puzzle> {
  try {
    const { data } = await TokenReq.post<Envelope<Puzzle>>("/api/puzzles", payload);
    if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 생성 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "퍼즐 생성 실패");
  }
}

/* ========= 단건 조회 ========= */
/** GET /api/puzzles/{id} */
export async function getPuzzle(id: number): Promise<Puzzle> {
  try {
    const { data } = await TokenReq.get<Envelope<Puzzle>>(`/api/puzzles/${id}`);
    if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 조회 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "퍼즐 조회 실패");
  }
}

/* ========= 수정 ========= */
/** PUT /api/puzzles/{id} */
export type UpdatePuzzleReq = Partial<CreatePuzzleReq>;

export async function updatePuzzle(id: number, payload: UpdatePuzzleReq): Promise<Puzzle> {
  try {
    const body = stripUndefined(payload);
    const { data } = await TokenReq.put<Envelope<Puzzle>>(`/api/puzzles/${id}`, body);
    if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 수정 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "퍼즐 수정 실패");
  }
}

/* ========= 상태 업데이트 ========= */
/** PATCH /api/puzzles/{id}/status */
export type UpdatePuzzleStatusReq = {
  status: "INPROGRESS" | "DONE";
};

export async function updatePuzzleStatus(id: number, payload: UpdatePuzzleStatusReq): Promise<Puzzle> {
  try {
    const { data } = await TokenReq.patch<Envelope<Puzzle>>(`/api/puzzles/${id}/status`, payload);
    if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 상태 업데이트 실패");
    return data.data;
  } catch (e) {
    throw normErr(e, "퍼즐 상태 업데이트 실패");
  }
}

/* ========= 삭제 ========= */
/** DELETE /api/puzzles/{id}
 *  - 200(Envelope) 또는 204(No Content) 모두 허용
 */
export async function deletePuzzle(id: number): Promise<{ message?: string }> {
  try {
    const res = await TokenReq.delete<Envelope<null>>(`/api/puzzles/${id}`);
    const env = res?.data as Envelope<null> | undefined;
    if (env && env.isSuccess === false) {
      throw new Error(env.message || "퍼즐 삭제 실패");
    }
    return { message: env?.message };
  } catch (e) {
    throw normErr(e, "퍼즐 삭제 실패");
  }
}