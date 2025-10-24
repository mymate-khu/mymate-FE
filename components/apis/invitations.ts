// components/apis/invitations.ts
import { TokenReq } from "./axiosInstance";

export interface Invitation {
  id: number;
  recipientId: number;
  recipientUsername: string;
  recipientName: string;
  inviteeName: string;
  inviteeMemberLoginId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sentAt: string;
  respondedAt?: string;
}

/**
 * 보낸 초대 목록 조회
 */
export async function fetchSentInvitations(status?: string): Promise<Invitation[]> {
  try {
    const params = status ? { status } : {};
    console.log("🔍 fetchSentInvitations 호출, params:", params);
    
    const response = await TokenReq.get("/api/invitations/sent", { params });
    console.log("🔍 API 응답:", response.data);
    
    // Envelope 형태인지 확인
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log("📦 Envelope 형태 응답, data:", response.data.data);
      return response.data.data || [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("❌ fetchSentInvitations 에러:", error);
    throw error;
  }
}

/**
 * 수락 대기 중인 초대 목록 조회
 */
export async function fetchPendingInvitations(): Promise<Invitation[]> {
  return fetchSentInvitations('PENDING');
}

