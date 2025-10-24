// app/home/home_chatting/ChatScreen.tsx
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
  Keyboard,
  InteractionManager,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Vector from "@/assets/image/home_chattingimg/Vector.svg";
import {
  sendMessage,
  getMessages,
  transformToChatMessage,
  deleteMessage,
  getChatRooms,
  type ChatMessage,
  type SendMessageRequest,
} from "@/components/apis/chat";
import { useMyProfile } from "@/hooks/useMyProfile";
import GradientAvatar from "@/components/GradientAvatar";

type Props = {
  fixedHeight?: number;
  onScrollActive?: (active: boolean) => void;
  chatRoomId?: number;         // 선택 입력: 특정 방 지정
  refreshSignal?: number;      // ✅ 부모에서 당김 시 증가하는 시그널
};

const MessageRow = ({
  msg,
  onLongPress,
  myUsername,
}: {
  msg: ChatMessage;
  onLongPress: (m: ChatMessage) => void;
  myUsername?: string;
}) => {
  const isMe = msg.senderName === myUsername;
  return (
    <View style={[styles.row, styles.rowOther]}>
      <View style={[styles.avatar, { marginRight: 8 }]}>
        <GradientAvatar uri={msg.avatarUrl} size={40} />
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => onLongPress(msg)}
        delayLongPress={250}
        style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
      >
        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>
          {msg.content}
        </Text>
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
      <TouchableOpacity
        onPress={send}
        activeOpacity={0.7}
        style={styles.sendBtn}
        disabled={!text.trim()}
      >
        <Vector />
      </TouchableOpacity>
    </View>
  );
};

export default function ChatScreen({
  fixedHeight = 560,
  onScrollActive,
  chatRoomId,
  refreshSignal,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { me, loading: profileLoading } = useMyProfile();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // 실제 사용할 채팅방 ID (prop 없으면 첫 방 선택)
  const [actualChatRoomId, setActualChatRoomId] = useState<number | null>(
    chatRoomId ?? null
  );

  // 하단까지 스크롤(여러 프레임 보정)
  const scrollToBottom = (animated = true) => {
    if (!listRef.current) return;
    listRef.current.scrollToEnd({ animated });
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
    setTimeout(() => listRef.current?.scrollToEnd({ animated }), 60);
    InteractionManager.runAfterInteractions(() => listRef.current?.scrollToEnd({ animated }));
  };

  // 시간 오름차순
  const data = useMemo(() => {
    const sorted = [...messages].sort((a, b) => a.createdAt - b.createdAt);
    return sorted;
  }, [messages]);

  // 채팅방 목록(첫 방 선택)
  const pickFirstRoomIfNeeded = useCallback(async () => {
    if (actualChatRoomId || !me) return null;
    try {
      const response = await getChatRooms();
      if (response.isSuccess && response.data?.length) {
        const firstRoom = response.data[0];
        setActualChatRoomId(firstRoom.id);
        return firstRoom.id;
      }
    } catch (e) {
      console.error("[Chat] 채팅방 목록 로드 실패:", e);
    }
    return null;
  }, [actualChatRoomId, me]);

  // 메시지 로드
  const loadMessages = useCallback(async () => {
    if (!actualChatRoomId || !me) return;
    try {
      setLoading(true);
      const response = await getMessages({ chatRoomId: actualChatRoomId, page: 0, size: 100 });
      if (response.data?.content) {
        const transformed = response.data.content.map((m) => transformToChatMessage(m, me.memberId));
        setMessages(transformed);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("[Chat] 메시지 로드 실패:", error);
      Alert.alert("오류", "메시지를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [actualChatRoomId, me]);

  // 최초/업데이트: 방 선택 후 메시지
  useEffect(() => {
    (async () => {
      if (!me) return;
      let roomId = actualChatRoomId;
      if (!roomId) {
        roomId = await pickFirstRoomIfNeeded();
      }
      if (roomId) await loadMessages();
    })();
  }, [me, actualChatRoomId, pickFirstRoomIfNeeded, loadMessages]);

  // 부모 Pull-to-Refresh 신호 수신 → 방/메시지 재조회
  useEffect(() => {
    if (refreshSignal === undefined) return;
    (async () => {
      if (!me) return;
      if (!actualChatRoomId) {
        const roomId = await pickFirstRoomIfNeeded();
        if (roomId) {
          // state 반영 타이밍 고려해서 약간 뒤에 메시지 로드
          setTimeout(() => loadMessages(), 0);
        }
        return;
      }
      await loadMessages();
    })();
  }, [refreshSignal, me, actualChatRoomId, pickFirstRoomIfNeeded, loadMessages]);

  // 메시지 길이 변하면 하단 보정
  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length]);

  // 키보드 표시/변경 시 하단 보정
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => scrollToBottom());
    const changeSub = Keyboard.addListener("keyboardDidChangeFrame", () => scrollToBottom());
    return () => {
      showSub.remove();
      changeSub.remove();
    };
  }, []);

  // 전송
  const onSend = async (text: string) => {
    if (!actualChatRoomId || !me) {
      Alert.alert("오류", "채팅방 정보가 없습니다.");
      return;
    }
    // 낙관적 업데이트
    const tempMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      content: text,
      messageType: "TEXT",
      createdAt: Date.now(),
      sender: "me",
      senderId: me.memberId,
      senderName: me.nickname || "나",
      chatRoomId: actualChatRoomId,
    };
    setMessages((prev) => [...prev, tempMessage]);
    requestAnimationFrame(() => scrollToBottom());

    try {
      const request: SendMessageRequest = {
        chatRoomId: actualChatRoomId,
        messageType: "TEXT",
        content: text,
      };
      const response = await sendMessage(request);
      if (response.isSuccess && response.data) {
        const serverMessage = transformToChatMessage(response.data, me.memberId);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMessage.id ? serverMessage : m))
        );
      } else {
        throw new Error(response.message || "메시지 전송 실패");
      }
    } catch (e) {
      // 실패 롤백
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      Alert.alert("오류", "메시지 전송에 실패했습니다.");
    }
  };

  // 길게 눌러 복사/삭제
  const onLongPress = async (msg: ChatMessage) => {
    try {
      await Clipboard.setStringAsync(msg.content);
    } catch {}
    if (msg.sender === "me") {
      Alert.alert("메시지 삭제", "이 메시지를 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              // 낙관적 제거
              setMessages((prev) => prev.filter((m) => m.id !== msg.id));
              requestAnimationFrame(() => scrollToBottom());
              // 서버 삭제
              const messageId = parseInt(msg.id);
              if (!isNaN(messageId)) {
                const res = await deleteMessage(messageId);
                if (!res.isSuccess) {
                  // 롤백
                  setMessages((prev) =>
                    [...prev, msg].sort((a, b) => a.createdAt - b.createdAt)
                  );
                  Alert.alert("오류", "메시지 삭제에 실패했습니다.");
                }
              }
            } catch (error) {
              // 롤백
              setMessages((prev) =>
                [...prev, msg].sort((a, b) => a.createdAt - b.createdAt)
              );
              Alert.alert("오류", "메시지 삭제에 실패했습니다.");
            }
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { height: fixedHeight, alignSelf: "stretch" }]}>
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

          {/* 메시지 리스트 */}
          {loading || profileLoading || !actualChatRoomId ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                {profileLoading
                  ? "사용자 정보를 불러오는 중..."
                  : !actualChatRoomId
                  ? "채팅방을 찾는 중..."
                  : "메시지를 불러오는 중..."}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={listRef}
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MessageRow
                  msg={item}
                  onLongPress={onLongPress}
                  myUsername={me?.username}
                />
              )}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => scrollToBottom(false)}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              ListFooterComponent={<View onLayout={() => scrollToBottom(false)} />}
              nestedScrollEnabled

              // 부모 스크롤 잠금/해제
              onScrollBeginDrag={() => onScrollActive?.(true)}
              onMomentumScrollEnd={() => onScrollActive?.(false)}
              onScrollEndDrag={() => onScrollActive?.(false)}

              // 가장자리 바운스 최소화
              bounces={false}
              overScrollMode="never"
            />
          )}

          {/* 입력창 */}
          <ChatInput onSend={onSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "white", width: "100%" },
  flex: { flex: 1 },
  container: { flex: 1 },
  header: {
    marginTop: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "400", fontFamily: "DonerRegularDisplay" },
  listContent: { paddingVertical: 12, paddingHorizontal: 12 },

  row: { marginVertical: 6, flexDirection: "row", alignItems: "flex-start", marginLeft: -10 },
  rowOther: { justifyContent: "flex-start" },
  rowMe: { justifyContent: "flex-start", flexDirection: "row-reverse" },

  avatar: { width: 40, height: 40, borderRadius: 20 },

  bubble: {
    width: 270,
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
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
