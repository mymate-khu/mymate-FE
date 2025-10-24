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

export interface ReceivedInvitation {
  id: number;
  groupId: number;
  groupName: string;
  inviterId: number;
  inviterName: string;
  inviteeId: number;
  inviteeMemberLoginId?: string | null;
  inviteeName?: string | null;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
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

/**
 * 내가 받은 초대 목록 조회
 */
export async function fetchMyInvitations(): Promise<ReceivedInvitation[]> {
  const response = await TokenReq.get("/api/invitations/me");
  const data = response.data?.data ?? [];
  return data;
}

/**
 * 초대 수락
 */
export async function acceptInvitation(invitationId: number): Promise<void> {
  await TokenReq.post(`/api/invitations/${invitationId}/accept`);
}

/**
 * 초대 거절
 */
export async function rejectInvitation(invitationId: number): Promise<void> {
  await TokenReq.post(`/api/invitations/${invitationId}/reject`);
}
