import { TokenReq } from "@/components/apis/axiosInstance";

export type Me = {
  id: number;             // 서버에서 오는 실제 필드명
  memberId: number;        // 호환성을 위한 별칭
  username: string;        // 실명
  nickname: string | null; // 앱에서 표기할 닉네임 (null 가능)
  email: string;
  memberLoginId?: string;  // ✅ 추가: 로그인 아이디 (ex. sw1111)
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
  const response = await TokenReq.get<MeResponse>("/api/profile/me");
  console.log("🔍 fetchMyProfile 응답:", response.data);
  
  if (response.data.isSuccess && response.data.data) {
    const data = response.data.data;
    // id 필드를 memberId로도 매핑
    return {
      ...data,
      memberId: data.id, // 호환성을 위해 id를 memberId로도 설정
    };
  } else {
    throw new Error(response.data.message || '프로필 조회 실패');
  }
}