// ChatScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "react-native";
import * as Clipboard from "expo-clipboard"; // expo install expo-clipboard
import {API_URL} from "@env"
import Vector from "@/assets/image/home_chattingimg/Vector.svg"

/**
 * Chat UI (Expo friendly)
 * - 아바타 상단 정렬
 * - 채팅 패널 높이 고정 (기본 560)
 * - 메시지 추가/키보드 표시 시 완전 하단까지 자동 스크롤 (여러 프레임에 걸쳐 보정)
 */

export type ChatMessage = {
  id: string;
  text: string;
  createdAt: number;
  sender: "me" | "other";
  avatarUrl?: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "m3",
    text: "좋아! 오늘 7시에 보자",
    createdAt: Date.now() - 1000 * 60 * 2,
    sender: "other",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "m2",
    text: "오케이. 장소는 어디가 좋을까?",
    createdAt: Date.now() - 1000 * 60 * 5,
    sender: "me",
    avatarUrl: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "m1",
    text: "안녕! 오늘 시간 돼?",
    createdAt: Date.now() - 1000 * 60 * 6,
    sender: "other",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "m1",
    text: "안녕! 오늘 시간 돼?",
    createdAt: Date.now() - 1000 * 60 * 6,
    sender: "other",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "m1",
    text: "안녕! 오늘 시간 돼?",
    createdAt: Date.now() - 1000 * 60 * 6,
    sender: "other",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "m1",
    text: "안녕! 오늘 시간 돼?",
    createdAt: Date.now() - 1000 * 60 * 6,
    sender: "other",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "m1",
    text: "안녕! 오늘 시간 돼?",
    createdAt: Date.now() - 1000 * 60 * 6,
    sender: "other",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  },
];

const timeText = (ts: number) => {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const MessageRow = ({ msg, onLongPress }: { msg: ChatMessage; onLongPress: (m: ChatMessage) => void }) => {
  const isMe = msg.sender === "me";
  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
      {/* Avatar */}
      {msg.avatarUrl ? (
        <Image source={{ uri: msg.avatarUrl }} style={[styles.avatar, isMe ? { marginLeft: 8 } : { marginRight: 8 }]} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]} />)
      }

      {/* Bubble */}
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => onLongPress(msg)}
        delayLongPress={250}
        style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
      >
        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{msg.text}</Text>
        <Text style={[styles.time, isMe ? styles.timeMe : styles.timeOther]}>{timeText(msg.createdAt)}</Text>
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
export default function ChatScreen({ fixedHeight = 560 }: { fixedHeight?: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // 시간 오름차순(위=과거, 아래=최신)
  const data = useMemo(() => [...messages].sort((a, b) => a.createdAt - b.createdAt), [messages]);

  // 👉 완전 하단까지 확실히 스크롤시키는 유틸 (여러 프레임 시도)
  const scrollToBottom = (animated = true) => {
    if (!listRef.current) return;
    listRef.current.scrollToEnd({ animated });
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
    setTimeout(() => listRef.current?.scrollToEnd({ animated }), 60);
    InteractionManager.runAfterInteractions(() => listRef.current?.scrollToEnd({ animated }));
  };

  const onSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      text,
      createdAt: Date.now(),
      sender: "me",
      avatarUrl: "https://i.pravatar.cc/100?img=1",
    };
    setMessages((prev) => [...prev, newMsg]);
    // setState 이후 다음 프레임에 하단 고정
    requestAnimationFrame(() => scrollToBottom());
  };

  const onLongPress = async (msg: ChatMessage) => {
    try {
      await Clipboard.setStringAsync(msg.text);
    } catch {}
    if (msg.sender === "me") {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      requestAnimationFrame(() => scrollToBottom());
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
          <FlatList
            ref={listRef}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageRow msg={item} onLongPress={onLongPress} />}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => scrollToBottom(false)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            ListFooterComponent={<View onLayout={() => scrollToBottom(false)} />} // 레이아웃 완료 후 보정
          />

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
  container: { flex: 1 },
  header: {
    height: 52,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "400",fontFamily:"DonerRegularDisplay" },
  listContent: { paddingVertical: 12, paddingHorizontal: 12 },

  // message row
  row: { marginVertical: 6, flexDirection: "row", alignItems: "flex-start" },
  rowOther: { justifyContent: "flex-start" },
  rowMe: { justifyContent: "flex-start", flexDirection: "row-reverse" },

  // avatar
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E5E7EB" },
  avatarFallback: { justifyContent: "center", alignItems: "center" },

  // bubble
  bubble: {
    maxWidth: "74%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMe: { backgroundColor: "rgba(255, 252, 194, 1)", borderTopRightRadius: 4, marginHorizontal: 8 },
  bubbleOther: {
    backgroundColor: "rgba(235, 217, 255, 1)",
    borderTopLeftRadius: 4,
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
});
