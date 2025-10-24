import { TokenReq } from './axiosInstance';

// API 공통 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
  success: boolean;
}

// 채팅 메시지 데이터 타입 (API 응답 구조에 맞게 수정)
export interface ChatMessageData {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  content: string;
  createdAt: string;
  isDeleted: boolean;
  senderProfileImageUrl?: string; // 발신자 프로필 이미지 URL 추가
}

// 채팅 메시지 타입 (UI에서 사용)
export interface ChatMessage {
  id: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  createdAt: number; // timestamp로 변환
  sender: 'me' | 'other';
  senderId: number;
  senderName: string;
  avatarUrl?: string;
  chatRoomId: number;
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  chatRoomId: number;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  content: string;
}

// 메시지 전송 응답 타입
export type SendMessageResponse = ApiResponse<ChatMessageData>;

// 채팅방 타입 정의
export interface ChatRoom {
  id: number;
  groupId: number;
  name: string;
  type: 'GROUP' | 'PRIVATE';
  isActive: boolean;
  participantCount: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
}

// 채팅방 목록 조회 응답 (실제 API 응답에 맞게 수정)
export interface GetChatRoomsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: ChatRoom[];
  success: boolean;
}

// 채팅방 상세 조회 응답
export type GetChatRoomDetailResponse = ApiResponse<ChatRoom>;

// 채팅방 메시지 조회 요청
export interface GetMessagesRequest {
  chatRoomId: number;
  page?: number;
  size?: number;
}

// 페이지네이션 정보
export interface PageInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 채팅방 메시지 조회 응답 (실제 API 응답에 맞게 수정)
export interface GetMessagesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    content: ChatMessageData[];
  };
  success: boolean;
}

// 메시지 삭제 응답
export type DeleteMessageResponse = ApiResponse<{}>;

/**
 * 서버 응답을 UI용 ChatMessage로 변환하는 헬퍼 함수
 */
export function transformToChatMessage(
  data: ChatMessageData, 
  myUserId?: number
): ChatMessage {
  return {
    id: data.id.toString(),
    content: data.content,
    messageType: data.messageType,
    createdAt: new Date(data.createdAt).getTime(),
    sender: myUserId && data.senderId === myUserId ? 'me' : 'other',
    senderId: data.senderId,
    senderName: data.senderName,
    chatRoomId: data.chatRoomId,
    avatarUrl: data.senderProfileImageUrl, // 프로필 이미지 URL 설정
  };
}

/**
 * 채팅방 목록 조회
 */
export async function getChatRooms(): Promise<GetChatRoomsResponse> {
  const response = await TokenReq.get('/api/chat/rooms');
  return response.data;
}

/**
 * 채팅방 상세 조회
 */
export async function getChatRoomDetail(chatRoomId: number): Promise<GetChatRoomDetailResponse> {
  const response = await TokenReq.get(`/api/chat/rooms/${chatRoomId}`);
  return response.data;
}

/**
 * 채팅 메시지 전송
 */
export async function sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await TokenReq.post('/api/chat/messages', data);
  return response.data;
}

/**
 * 채팅방 메시지 조회
 */
export async function getMessages(params: GetMessagesRequest): Promise<GetMessagesResponse> {
  const { chatRoomId, page = 0, size = 20 } = params;
  const response = await TokenReq.get(`/api/chat/rooms/${chatRoomId}/messages`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
}

/**
 * 메시지 삭제
 */
export async function deleteMessage(messageId: number): Promise<DeleteMessageResponse> {
  const response = await TokenReq.delete(`/api/chat/messages/${messageId}`);
  return response.data;
}
