// ChatScreen.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Keyboard,
  InteractionManager,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard"; // expo install expo-clipboard
import {API_URL} from "@env"
import Vector from "@/assets/image/home_chattingimg/Vector.svg"
import { sendMessage, getMessages, transformToChatMessage, deleteMessage, getChatRooms, type ChatMessage, type SendMessageRequest } from "@/components/apis/chat";
import { useMyProfile } from "@/hooks/useMyProfile";
import GradientAvatar from "@/components/GradientAvatar";

/**
 * Chat UI (Expo friendly)
 * - 아바타 상단 정렬
 * - 채팅 패널 높이 고정 (기본 560)
 * - 메시지 추가/키보드 표시 시 완전 하단까지 자동 스크롤 (여러 프레임에 걸쳐 보정)
 */

type Props = {
  fixedHeight?: number;
  onScrollActive?: (active: boolean) => void;
  chatRoomId?: number; // 채팅방 ID (GroupId와 동일) - 선택적
};

const timeText = (ts: number) => {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const MessageRow = ({ msg, onLongPress, myUsername }: { msg: ChatMessage; onLongPress: (m: ChatMessage) => void; myUsername?: string }) => {
  // senderName이 내 username과 같은지 확인
  const isMe = msg.senderName === myUsername;
  return (
    <View style={[styles.row, styles.rowOther]}>
      {/* Avatar */}
      <View style={[styles.avatar, { marginRight: 8 }]}>
        <GradientAvatar uri={msg.avatarUrl} size={40} />
      </View>

      {/* Bubble */}
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => onLongPress(msg)}
        delayLongPress={250}
        style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
      >
        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{msg.content}</Text>
      </TouchableOpacity>
    </View>
  );
};

const ChatInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <View style={styles.inputBar}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="메시지를 입력하세요"
        placeholderTextColor={"rgba(153, 153, 153, 1)"}
        style={styles.textInput}
        returnKeyType="send"
        onSubmitEditing={send}
        blurOnSubmit={false}
      />
      <TouchableOpacity onPress={send} activeOpacity={0.7} style={styles.sendBtn} disabled={!text.trim()}>
        <Vector></Vector>
      </TouchableOpacity>
    </View>
  );
};

/**
 * fixedHeight: 전체 ChatScreen 높이 (기본 560)
 * 리스트는 남는 공간을 차지하고, 넘치면 스크롤됨.
 */
export default function ChatScreen({ fixedHeight = 560, onScrollActive, chatRoomId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { me, loading: profileLoading } = useMyProfile();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  
  // 실제 채팅방 ID 로드
  const [actualChatRoomId, setActualChatRoomId] = useState<number | null>(chatRoomId || null);

  // 시간 오름차순(위=과거, 아래=최신)
  const data = useMemo(() => {
    const sorted = [...messages].sort((a, b) => a.createdAt - b.createdAt);
    console.log('📊 메시지 데이터:', { 
      total: messages.length, 
      sorted: sorted.length,
      messages: sorted.map(m => ({ id: m.id, content: m.content, sender: m.sender }))
    });
    return sorted;
  }, [messages]);

  // 👉 완전 하단까지 확실히 스크롤시키는 유틸 (여러 프레임 시도)
  const scrollToBottom = (animated = true) => {
    if (!listRef.current) return;
    listRef.current.scrollToEnd({ animated });
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
    setTimeout(() => listRef.current?.scrollToEnd({ animated }), 60);
    InteractionManager.runAfterInteractions(() => listRef.current?.scrollToEnd({ animated }));
  };

  // 사용자 정보 로드 완료 확인
  useEffect(() => {
    if (me) {
      console.log('👤 사용자 정보 로드 완료:', { memberId: me.memberId, nickname: me.nickname });
    }
  }, [me]);

  // 채팅방 목록 로드 (chatRoomId가 없을 때)
  useEffect(() => {
    const loadChatRooms = async () => {
      if (actualChatRoomId || !me) return;
      
      try {
        console.log('🔄 채팅방 목록 로드 시작');
        const response = await getChatRooms();
        console.log('📨 채팅방 목록 응답:', response);
        
        if (response.isSuccess && response.data && response.data.length > 0) {
          const firstRoom = response.data[0];
          console.log('✅ 첫 번째 채팅방 선택:', firstRoom);
          setActualChatRoomId(firstRoom.id);
        } else {
          console.log('📭 사용 가능한 채팅방이 없습니다');
        }
      } catch (error) {
        console.error('💥 채팅방 목록 로드 실패:', error);
      }
    };

    loadChatRooms();
  }, [me, actualChatRoomId]);

  // 메시지 로드
  const loadMessages = useCallback(async () => {
    if (!actualChatRoomId) {
      console.log('❌ chatRoomId 없음');
      return;
    }
    
    if (!me) {
      console.log('❌ 사용자 정보 없음');
      return;
    }
    
    console.log('🔄 메시지 로드 시작:', { chatRoomId: actualChatRoomId, memberId: me.memberId });
    
    try {
      setLoading(true);
      const response = await getMessages({ chatRoomId: actualChatRoomId, page: 0, size: 100 });
      console.log('📨 메시지 조회 응답:', response);
      
      if (response.data && response.data.content) {
        console.log('📋 받은 메시지 개수:', response.data.content.length);
        const transformedMessages = response.data.content.map(msg => 
          transformToChatMessage(msg, me.memberId)
        );
        console.log('🔄 변환된 메시지들:', transformedMessages);
        setMessages(transformedMessages);
      } else {
        console.log('📭 메시지 없음');
        setMessages([]);
      }
    } catch (error) {
      console.error('💥 메시지 로드 실패:', error);
      Alert.alert('오류', '메시지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [actualChatRoomId, me]);

  // 초기 메시지 로드 및 컴포넌트 마운트 시 메시지 로드
  useEffect(() => {
    if (actualChatRoomId && me) {
      console.log('🔄 컴포넌트 마운트/업데이트 시 메시지 로드');
      loadMessages();
    }
  }, [loadMessages]);

  // 컴포넌트가 포커스를 받을 때마다 메시지 새로고침
  useEffect(() => {
    const handleFocus = () => {
      if (actualChatRoomId && me) {
        console.log('🔄 화면 포커스 시 메시지 새로고침');
        loadMessages();
      }
    };

    // 컴포넌트가 마운트될 때와 포커스를 받을 때 메시지 로드
    handleFocus();
    
    // 포커스 이벤트 리스너 (React Navigation 사용 시)
    const unsubscribe = () => {}; // 필요시 포커스 이벤트 리스너 추가
    
    return unsubscribe;
  }, [actualChatRoomId, me]);

  const onSend = async (text: string) => {
    console.log('🚀 메시지 전송 시작:', { text, chatRoomId: actualChatRoomId, memberId: me?.memberId });
    
    if (!actualChatRoomId || !me) {
      console.error('❌ 채팅방 정보 없음:', { chatRoomId: actualChatRoomId, me });
      Alert.alert('오류', '채팅방 정보가 없습니다.');
      return;
    }

    // 낙관적 업데이트
    const tempMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      content: text,
      messageType: 'TEXT',
      createdAt: Date.now(),
      sender: 'me',
      senderId: me.memberId,
      senderName: me.nickname || '나',
      chatRoomId: actualChatRoomId,
    };
    
    console.log('📝 임시 메시지 추가:', tempMessage);
    setMessages((prev) => {
      const newMessages = [...prev, tempMessage];
      console.log('📋 메시지 목록 업데이트:', newMessages.length);
      return newMessages;
    });
    requestAnimationFrame(() => scrollToBottom());

    try {
      const request: SendMessageRequest = {
        chatRoomId: actualChatRoomId,
        messageType: 'TEXT',
        content: text,
      };

      console.log('🌐 API 요청:', request);
      const response = await sendMessage(request);
      console.log('📨 API 응답:', response);
      
      if (response.isSuccess && response.data) {
        console.log('✅ 서버 응답 성공, 메시지 업데이트');
        // 서버 응답으로 메시지 업데이트
        const serverMessage = transformToChatMessage(response.data, me.memberId);
        console.log('🔄 서버 메시지로 변환:', serverMessage);
        setMessages((prev) => 
          prev.map(msg => 
            msg.id === tempMessage.id ? serverMessage : msg
          )
        );
      } else {
        console.error('❌ 서버 응답 실패:', response);
        throw new Error(response.message || '메시지 전송 실패');
      }
    } catch (error) {
      console.error('💥 메시지 전송 실패:', error);
      // 실패 시 임시 메시지 제거
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
      Alert.alert('오류', '메시지 전송에 실패했습니다.');
    }
  };

  const onLongPress = async (msg: ChatMessage) => {
    try {
      await Clipboard.setStringAsync(msg.content);
    } catch {}
    
    if (msg.sender === "me") {
      // 메시지 삭제 확인 다이얼로그
      Alert.alert(
        '메시지 삭제',
        '이 메시지를 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '삭제',
            style: 'destructive',
            onPress: async () => {
              try {
                // 낙관적 업데이트: 먼저 UI에서 제거
                setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                requestAnimationFrame(() => scrollToBottom());
                
                // 서버에 삭제 요청
                const messageId = parseInt(msg.id);
                if (!isNaN(messageId)) {
                  const response = await deleteMessage(messageId);
                  if (!response.isSuccess) {
                    // 실패 시 롤백
                    setMessages((prev) => [...prev, msg].sort((a, b) => a.createdAt - b.createdAt));
                    Alert.alert('오류', '메시지 삭제에 실패했습니다.');
                  }
                }
              } catch (error) {
                console.error('메시지 삭제 실패:', error);
                // 실패 시 롤백
                setMessages((prev) => [...prev, msg].sort((a, b) => a.createdAt - b.createdAt));
                Alert.alert('오류', '메시지 삭제에 실패했습니다.');
              }
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    // 초기/변경 시에도 한번 더 보정
    scrollToBottom(false);
  }, [messages.length]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => scrollToBottom());
    const changeSub = Keyboard.addListener("keyboardDidChangeFrame", () => scrollToBottom());
    return () => {
      showSub.remove();
      changeSub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { height: fixedHeight, alignSelf: "stretch" }]}> {/* 고정 높이 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 8, android: 0 })}
        style={styles.flex}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>REPLY</Text>
          </View>

          {/* Message list (스크롤 영역) */}
          {loading || profileLoading || !actualChatRoomId ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                {profileLoading ? '사용자 정보를 불러오는 중...' : 
                 !actualChatRoomId ? '채팅방을 찾는 중...' : 
                 '메시지를 불러오는 중...'}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={listRef}
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MessageRow msg={item} onLongPress={onLongPress} myUsername={me?.username} />}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => scrollToBottom(false)}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              ListFooterComponent={<View onLayout={() => scrollToBottom(false)} />}
              nestedScrollEnabled

              // 👇 드래그 시작/끝에 부모 스크롤 잠금/해제
              onScrollBeginDrag={() => onScrollActive?.(true)}
              onMomentumScrollEnd={() => onScrollActive?.(false)}
              onScrollEndDrag={() => onScrollActive?.(false)}

              // 👇 가장자리에서 부모 스크롤로 넘어가는 걸 줄임
              bounces={false}                 // iOS 탄성 제거
              overScrollMode="never"          // Android 오버스크롤 제거
            />
          )}

          {/* Input */}
          <ChatInput onSend={onSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "white", width: "100%" },
  flex: { flex: 1 },
  container: { flex: 1},
  header: {
    marginTop:20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "400",fontFamily:"DonerRegularDisplay" },
  listContent: { paddingVertical: 12, paddingHorizontal: 12 },

  // message row
  row: { marginVertical: 6, flexDirection: "row", alignItems: "flex-start", marginLeft: -10 },
  rowOther: { justifyContent: "flex-start" },
  rowMe: { justifyContent: "flex-start", flexDirection: "row-reverse" },

  // avatar
  avatar: { width: 40, height: 40, borderRadius: 20 },

  // bubble
  bubble: {
    width: 270,
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  bubbleMe: { backgroundColor: "rgba(255, 252, 194, 1)", marginHorizontal: 8 },
  bubbleOther: {
    backgroundColor: "rgba(235, 217, 255, 1)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E3E8EF",
    marginHorizontal: 8,
  },
  msgText: { fontSize: 16, lineHeight: 22 },
  msgTextMe: { color: "black" },
  msgTextOther: { color: "#111827" },
  time: { fontSize: 11, marginTop: 4, alignSelf: "flex-end" },
  timeMe: { color: "black" },
  timeOther: { color: "#64748B" },

  // input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 18,
    fontSize: 16,
  },
  sendBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },
  sendLabel: { color: "#FFFFFF", fontWeight: "600" },
  
  // loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748B",
    fontFamily: "DonerRegularDisplay",
  },
});
