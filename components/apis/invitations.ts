// components/apis/invitations.ts
import { TokenReq } from "./axiosInstance";

export interface Invitation {
  id: number;
  recipientId: number;
  recipientUsername: string;
  recipientName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sentAt: string;
  respondedAt?: string;
}

/**
 * 보낸 초대 목록 조회
 */
export async function fetchSentInvitations(status?: string): Promise<Invitation[]> {
  const params = status ? { status } : {};
  const response = await TokenReq.get<Invitation[]>("/api/invitations/sent", { params });
  return response.data;
}

/**
 * 수락 대기 중인 초대 목록 조회
 */
export async function fetchPendingInvitations(): Promise<Invitation[]> {
  return fetchSentInvitations('PENDING');
}
