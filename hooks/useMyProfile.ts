// src/hooks/useMyProfile.ts
import { useEffect, useState } from "react";
import { fetchMyProfile, Me } from "@/components/apis/profile";

export function useMyProfile() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchMyProfile();
        console.log("✅ 내 프로필 데이터:", data);
        if (mounted) setMe(data);
      } catch (e) {
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { me, loading, error };
}