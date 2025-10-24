// app/home/home_mate_overview/HomeMateOverview.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import PuzzleLogo from "@/assets/image/home/puzzle_logo.svg";
import ArrowRight from "@/assets/image/home/arrow_right.svg";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useGroups } from "@/hooks/useGroups";
import AvatarStack from "@/components/AvatarStack";

type Mate = { id: string; name?: string; photo?: string };

type Props = {
  style?: ViewStyle;
  userName?: string;    // 폴백용 (API 실패/로딩일 때)
  mates?: Mate[];
  /** ✅ 부모가 주는 새로고침 트리거 */
  refreshSignal?: number;
};

const DEFAULT_MATES: Mate[] = [
  { id: "m1", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=480&auto=format&fit=crop" },
  { id: "m2", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=480&auto=format&fit=crop" },
  { id: "m3", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop" },
];

export default function HomeMateOverview({
  style,
  userName = "...",
  mates = DEFAULT_MATES,
  refreshSignal,
}: Props) {
  const router = useRouter();

  // ✅ refetch 꺼내쓰기 (React Query라면 기본 제공)
  const { me, loading, refetch: refetchProfile } = useMyProfile();
  const { otherMembers, loading: groupsLoading, refetch: refetchGroups } = useGroups();

  // ✅ 부모 Pull-to-Refresh 시 다시 불러오기
  React.useEffect(() => {
    if (refreshSignal !== undefined) {
      refetchProfile?.();
      refetchGroups?.();
    }
  }, [refreshSignal, refetchProfile, refetchGroups]);

  const displayName = loading ? "..." : (me?.username || userName);

  // 실제 그룹 멤버들로 아바타 생성 (사진 없으면 랜덤 아바타)
  const mateAvatars = (otherMembers || []).slice(0, 3).map(member => ({
    uri: member.photo,
    seed: member.code || member.name || member.id, // 랜덤 아바타 생성용 seed
  }));

  const handleNavigateToManage = () => {
    router.push("/home/home_mate_overview/MateManage/MateManagement");
  };

  return (
    <View style={[s.container, style]}>
      <View style={s.logoWrap}>
        <PuzzleLogo width="100%" height="100%" />
      </View>

      <View style={s.rightCol}>
        <View>
          <Text style={s.hello1}>안녕하세요!</Text>
          <Text style={s.hello2}>{displayName} 님!</Text>
        </View>

        <Text style={s.sectionTitle}>MyMate</Text>
        
        <View style={s.matesRow}>
          {mateAvatars.length > 0 ? (
            <AvatarStack
              avatars={mateAvatars}
              size={40}
              overlap={10}
            />
          ) : (
            <View style={s.emptySpace} />
          )}
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.85} style={s.nextBtn} onPress={handleNavigateToManage}>
        <ArrowRight width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 5,
  },
  logoWrap: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
    gap: 12,
  },
  hello1: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    lineHeight: 40,
  },
  hello2: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    lineHeight: 40,
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#222",
  },
  matesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptySpace: {
    height: 40, // AvatarStack과 동일한 높이
    width: 1, // 최소 너비
  },
  nextBtn: {
    position: "absolute",
    right: 0,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 36,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
});
