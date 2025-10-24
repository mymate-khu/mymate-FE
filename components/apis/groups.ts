// components/apis/groups.ts
import { TokenReq } from "./axiosInstance";

export interface GroupMember {
  memberLoginId: string;
  username: string;
  joinedAt: string;
}

export interface Group {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
}

export interface GroupMemberWithProfile {
  id: number;
  memberId: number;
  joinedAt: string;
  name?: string;
  code?: string;
  photo?: string;
}

/**
 * 내 그룹 목록 조회
 */
export async function fetchMyGroups(): Promise<Group[]> {
  const response = await TokenReq.get<Group[]>("/api/groups/me");
  return response.data;
}

/**
 * 특정 사용자의 프로필 정보 조회
 */
export async function fetchUserProfile(memberId: number): Promise<{
  id: number;
  username: string;
  nickname: string | null;
  memberLoginId?: string;
  profileImageUrl?: string | null;
}> {
  const response = await TokenReq.get(`/api/users/${memberId}/profile`);
  return response.data;
}

/**
 * 그룹 멤버들의 프로필 정보를 한번에 조회
 */
export async function fetchGroupMembersWithProfiles(groupId: number): Promise<GroupMemberWithProfile[]> {
  try {
    const response = await TokenReq.get<GroupMemberWithProfile[]>(`/api/groups/${groupId}/members/profile`);
    return response.data;
  } catch (error) {
    console.error(`그룹 ${groupId} 멤버 프로필 조회 실패:`, error);
    return [];
  }
}

/**
 * 그룹 멤버들의 프로필 정보 조회 (추가 API가 필요할 경우)
 * 현재는 기본 구조만 제공
 */
export async function fetchGroupMembersProfile(groupId: number): Promise<GroupMemberWithProfile[]> {
  // TODO: 실제 API 엔드포인트에 맞춰 구현
  // 예: GET /api/groups/{groupId}/members/profile
  const response = await TokenReq.get<GroupMemberWithProfile[]>(`/api/groups/${groupId}/members/profile`);
  return response.data;
}
