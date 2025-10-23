// components/apis/puzzles.ts
import { TokenReq } from "@/components/apis/axiosInstance";

/** 공통 래퍼 */
type Envelope<T> = {
  isSuccess: boolean;
  code?: string;
  message?: string;
  data: T;
  success?: boolean;
};

/* ---------- 퍼즐 타입 ---------- */
export type Puzzle = {
  id: number;
  title: string;
  description: string;
  scheduledDate: string; // YYYY-MM-DD
  completedAt?: string | null;
  status: "PENDING" | "DONE";
  memberLoginId: string;
  recurrenceType?: string | null;
  recurrenceEndDate?: string | null;
  parentPuzzleId?: number | null;
  priority?: string | null;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
};

/* ---------- 목록 조회 ---------- */
export type PuzzlesPage = {
  puzzles: Puzzle[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
};

export async function fetchPuzzles({
  page = 0,
  size = 10,
  sort = [],
}: {
  page?: number;
  size?: number;
  sort?: string[];
} = {}): Promise<PuzzlesPage> {
  const params: any = {
    "pageable.page": page,
    "pageable.size": size,
  };
  if (sort.length) params["pageable.sort"] = sort;

  const { data } = await TokenReq.get<Envelope<PuzzlesPage>>("/api/puzzles", { params });
  if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 목록 조회 실패");
  return data.data;
}

/* ---------- 생성 ---------- */
export type CreatePuzzleReq = {
  title: string;
  description: string;
  scheduledDate: string;
  priority?: string;
  category?: string;
};

export async function createPuzzle(payload: CreatePuzzleReq): Promise<Puzzle> {
  const { data } = await TokenReq.post<Envelope<Puzzle>>("/api/puzzles", payload);
  if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 생성 실패");
  return data.data;
}

/* ---------- 단건 조회 ---------- */
export async function getPuzzle(id: number): Promise<Puzzle> {
  const { data } = await TokenReq.get<Envelope<Puzzle>>(`/api/puzzles/${id}`);
  if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 조회 실패");
  return data.data;
}

/* ---------- 수정 ---------- */
export type UpdatePuzzleReq = Partial<CreatePuzzleReq>;

export async function updatePuzzle(id: number, payload: UpdatePuzzleReq): Promise<Puzzle> {
  const { data } = await TokenReq.put<Envelope<Puzzle>>(`/api/puzzles/${id}`, payload);
  if (!data?.isSuccess) throw new Error(data?.message || "퍼즐 수정 실패");
  return data.data;
}