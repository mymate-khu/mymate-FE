// src/components/apis/notifications.ts
import { TokenReq } from "@/components/apis/axiosInstance";

export type ApiAction = {
  type: string;
  label: string;     // 예: "수락하기", "거절하기"
  style: string;     // 예: "PRIMARY" | "SECONDARY" 등 (있으면)
  apiUrl: string;    // 예: "/api/invitations/123/accept"
  method: string;    // "GET" | "POST" | "PATCH" | "DELETE"
};
export type ApiNotification = {
  id: number;
  title: string;
  content: string;
  type: string;      // "MATE_INVITE" 등
  status: "UNREAD" | "READ";
  priority: "LOW" | "MEDIUM" | "HIGH";
  senderId: number;
  senderName: string;
  actions?: ApiAction[];
  navigationUrl?: string;
  createdAt: string;
};

type ListRes = {
  isSuccess: boolean;
  data: { content: ApiNotification[] };
  success: boolean;
};

export const fetchNotifications = async (): Promise<ApiNotification[]> => {
  const { data } = await TokenReq.get<ListRes>("/api/notifications");
  return data?.data?.content ?? [];
};

export const markNotificationRead = (id: string | number) =>
  TokenReq.post(`/api/notifications/${id}/read`);

export const fireNotificationAction = async (a: ApiAction) => {
  const m = (a.method || "POST").toUpperCase();
  switch (m) {
    case "GET":    return TokenReq.get(a.apiUrl);
    case "POST":   return TokenReq.post(a.apiUrl);
    case "PATCH":  return TokenReq.patch(a.apiUrl);
    case "PUT":    return TokenReq.put(a.apiUrl);
    case "DELETE": return TokenReq.delete(a.apiUrl);
    default:       return TokenReq.post(a.apiUrl);
  }
};