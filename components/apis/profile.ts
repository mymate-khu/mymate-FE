// src/apis/profile.ts
import { TokenReq } from "@/components/apis/axiosInstance";

export type Me = {
  memberId: number;
  username: string;       // 실명
  nickname: string;       // 앱에서 표기할 닉네임
  email: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  signUpCompleted?: boolean;
};

type MeResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: Me;
  success: boolean;
};

export async function fetchMyProfile(): Promise<Me> {
  const { data } = await TokenReq.get<MeResponse>("/api/profile/me");
  return data.data;
}