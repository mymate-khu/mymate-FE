// utils/avatar.ts

/**
 * DiceBear API의 다양한 아바타 스타일
 * 각 스타일은 고유한 디자인을 제공합니다
 */
const AVATAR_STYLES = [
  'adventurer',      // 모험가 스타일
  'avataaars',       // 픽사 스타일
  'bottts',          // 로봇 스타일
  'fun-emoji',       // 이모지 스타일
  'lorelei',         // 여성 캐릭터
  'personas',        // 다양한 인물
  'pixel-art',       // 픽셀 아트
  'thumbs',          // 썸네일 스타일
] as const;

/**
 * 문자열을 해시 값으로 변환
 * 같은 입력에 대해 항상 같은 숫자를 반환합니다
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 사용자 정보를 기반으로 랜덤 아바타 URL 생성
 * 같은 사용자에게는 항상 같은 스타일의 아바타를 제공합니다
 * 
 * @param seed - 사용자 이름 또는 ID (고유 식별자)
 * @returns DiceBear 아바타 이미지 URL
 */
export function getRandomAvatarUrl(seed: string | number | null | undefined): string {
  const safeSeed = String(seed ?? 'default');
  const hash = hashString(safeSeed);
  const styleIndex = hash % AVATAR_STYLES.length;
  const style = AVATAR_STYLES[styleIndex];
  
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(safeSeed)}`;
}

