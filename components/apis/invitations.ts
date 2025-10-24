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

export interface ReceivedInvitation {
  id: number;
  groupId: number;
  groupName: string;
  inviterId: number;
  inviterName: string;
  inviteeId: number;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
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

/**
 * 받은 초대 목록 조회
 */
export async function fetchReceivedInvitations(): Promise<ReceivedInvitation[]> {
  try {
    console.log("🔍 fetchReceivedInvitations 호출");
    
    const response = await TokenReq.get("/api/invitations/me");
    console.log("🔍 API 응답:", response.data);
    
    // Envelope 형태인지 확인
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log("📦 Envelope 형태 응답, data:", response.data.data);
      return response.data.data || [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("❌ fetchReceivedInvitations 에러:", error);
    throw error;
  }
}

/**
 * 초대 수락
 */
export async function acceptInvitation(invitationId: number): Promise<void> {
  try {
    console.log("🔍 acceptInvitation 호출, invitationId:", invitationId);
    
    const response = await TokenReq.post(`/api/invitations/${invitationId}/accept`);
    console.log("🔍 수락 API 응답:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("❌ acceptInvitation 에러:", error);
    throw error;
  }
}

