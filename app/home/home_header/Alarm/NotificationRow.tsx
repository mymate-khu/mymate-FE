// app/notifications/NotificationRow.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ColorValue,
  ActivityIndicator,
} from "react-native";

import AddScheduleIcon from "@/assets/image/alarm/add_schedule.svg";
import MateRequestIcon from "@/assets/image/alarm/mate_request.svg";
import AdjustmentRequestIcon from "@/assets/image/alarm/adjustment_request.svg";
import CommentIcon from "@/assets/image/alarm/comment.svg";
import timeAgo from "@/utils/timeAgo";

export type NotificationType =
  | "schedule"
  | "mate_invite"
  | "settlement"
  | "comment";

export type NotificationRowProps = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string | number | Date;
  unread?: boolean;
  tintColor?: ColorValue;
  onPress?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
};

// 타입별 아이콘 매핑
const TypeIcon: Record<NotificationType, React.FC<{ size?: number }>> = {
  schedule: ({ size = 24 }) => <AddScheduleIcon width={size} height={size} />,
  mate_invite: ({ size = 24 }) => <MateRequestIcon width={size} height={size} />,
  settlement: ({ size = 24 }) => (
    <AdjustmentRequestIcon width={size} height={size} />
  ),
  comment: ({ size = 24 }) => <CommentIcon width={size} height={size} />,
};

export default function NotificationRow({
  id,
  type,
  title,
  message,
  createdAt,
  unread = false,
  tintColor = "#FFF7CC",
  onPress,
  onAccept,
  onDecline,
}: NotificationRowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const Icon = TypeIcon[type];
  const showCTA = type === "mate_invite";
  const safeMessage = message ?? "";

  console.log(`🔍 NotificationRow 렌더링: type=${type}, showCTA=${showCTA}, title=${title}`);

  const handleAccept = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onAccept?.(id);
    } finally {
      // 처리 완료 후에도 버튼을 비활성화 상태로 유지
      // (알림이 목록에서 제거되므로 실제로는 보이지 않음)
    }
  };

  const handleDecline = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onDecline?.(id);
    } finally {
      // 처리 완료 후에도 버튼을 비활성화 상태로 유지
      // (알림이 목록에서 제거되므로 실제로는 보이지 않음)
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(id)}
      disabled={showCTA}
      style={[
        s.wrap,
        unread && s.unread,
        type === "mate_invite" && s.mateInviteBg,
      ]}
    >
      <View style={s.topRow}>
        <View style={s.iconCircle}>
          <Icon size={24} />
        </View>

        <View style={s.textCol}>
          <Text style={s.title} numberOfLines={1}>
            {title}
          </Text>
          {!!safeMessage && (
            <Text style={s.message} numberOfLines={2}>
              {safeMessage}
            </Text>
          )}
        </View>

        <Text style={s.time}>{timeAgo(createdAt)}</Text>
      </View>

      {showCTA && (
        <View style={s.ctaRow}>
          <TouchableOpacity
            style={[s.acceptBtn, isProcessing && s.disabledBtn]}
            activeOpacity={0.9}
            onPress={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#111" />
            ) : (
              <Text style={s.acceptText}>수락하기</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.declineBtn, isProcessing && s.disabledBtn]}
            activeOpacity={0.9}
            onPress={handleDecline}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#111" />
            ) : (
              <Text style={s.declineText}>거절하기</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap: {
    //backgroundColor: "pink",
    paddingHorizontal: "5%",
    paddingVertical: 14,
  },
  unread: {
    backgroundColor: "#FFFDF2",
  },
  mateInviteBg: {
    backgroundColor: "#F4F4F4", // ✅ 연회색 톤
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    //backgroundColor: "red",
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  message: {
    fontSize: 12,
    color: "#797979",
    lineHeight: 18,
  },
  time: {
    marginLeft: 8,
    fontSize: 12,
    color: "#797979",
  },
  ctaRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 35, 
  },
  acceptBtn: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFE600",
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  declineBtn: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  declineText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  disabledBtn: {
    opacity: 0.5,
  },
});