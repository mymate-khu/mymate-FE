// utils/timeAgo.ts
export default function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;

  // 7일 이상일 때는 날짜 표시 (예: 2025.10.14)
  return target.toISOString().slice(0, 10).replace(/-/g, ".");
}