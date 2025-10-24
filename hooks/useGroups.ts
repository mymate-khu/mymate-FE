// hooks/useGroups.ts
import { useEffect, useState } from "react";
import { fetchMyGroups, Group, GroupMember } from "@/components/apis/groups";
import { fetchPendingInvitations, Invitation } from "@/components/apis/invitations";
import { useMyProfile } from "./useMyProfile";

export interface MateFromGroup {
  id: string;
  name: string;
  code: string;
  photo?: string;
  memberLoginId: string;
  joinedAt: string;
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const { me } = useMyProfile();

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        setLoading(true);
        
        // 그룹 데이터와 수락 대기 중인 요청을 병렬로 가져오기
        const [groupsData, invitationsData] = await Promise.allSettled([
          fetchMyGroups(),
          fetchPendingInvitations().catch(err => {
            console.warn("수락 대기 중인 요청 조회 실패:", err);
            return [];
          })
        ]);
        
        const groupsResult = groupsData.status === 'fulfilled' ? groupsData.value : [];
        const invitationsResult = invitationsData.status === 'fulfilled' ? invitationsData.value : [];
        
        console.log("✅ 그룹 데이터:", groupsResult);
        console.log("✅ 수락 대기 중인 요청:", invitationsResult);
        console.log("🔍 초대 데이터 개수:", invitationsResult.length);
        
        if (mounted) {
          setGroups(groupsResult);
          setPendingInvitations(invitationsResult);
        }
      } catch (e) {
        console.error("❌ 데이터 조회 실패:", e);
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);


  // 현재 사용자를 제외한 모든 그룹의 멤버들을 반환
  const getOtherMembers = (): MateFromGroup[] => {
    if (!me) return [];

    const allMembers: MateFromGroup[] = [];
    
    groups.forEach(group => {
      group.members.forEach((member, index) => {
        // 현재 사용자가 아닌 멤버만 추가 (username과 memberLoginId 모두 확인)
        const isCurrentUser = member.memberLoginId === me.username || 
                             member.username === me.username ||
                             member.memberLoginId === me.memberLoginId;
        
        if (!isCurrentUser) {
          allMembers.push({
            id: `member_${group.id}_${index}`,
            name: member.username,
            code: member.memberLoginId,
            photo: undefined, // 기본 프로필 이미지 사용
            memberLoginId: member.memberLoginId,
            joinedAt: member.joinedAt,
          });
        }
      });
    });

    return allMembers;
  };

  // 수락 대기 중인 요청을 Mate 형태로 변환
  const getPendingMates = (): MateFromGroup[] => {
    console.log("🔍 getPendingMates 호출, pendingInvitations:", pendingInvitations);
    
    if (!pendingInvitations || !Array.isArray(pendingInvitations)) {
      console.log("❌ pendingInvitations가 없거나 배열이 아님");
      return [];
    }
    
    const result = pendingInvitations.map(invitation => ({
      id: `invitation_${invitation.id}`,
      name: invitation.inviteeName || invitation.recipientName,
      code: invitation.inviteeMemberLoginId || invitation.recipientUsername,
      photo: undefined, // 기본 프로필 이미지 사용
      memberLoginId: invitation.inviteeMemberLoginId || invitation.recipientUsername,
      joinedAt: invitation.sentAt,
    }));
    
    console.log("✅ 변환된 pendingMates:", result);
    return result;
  };



  return {
    groups,
    loading,
    error,
    otherMembers: getOtherMembers(),
    pendingMates: getPendingMates(),
  };
}
