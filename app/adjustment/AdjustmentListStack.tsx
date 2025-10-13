// app/adjustment/AdjustmentListStack.tsx
import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import AdjustmentListCard, {
  AdjustmentCardItem,
  SettlementStatus,
} from "./AdjustmentListCard";

export type AdjustmentListStackProps = {
  items: (AdjustmentCardItem & { status: SettlementStatus })[];
  overlap?: number;
  onChangeStatus?: (id: string, next: SettlementStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function AdjustmentListStack({
  items,
  overlap = 210,
  onChangeStatus,
  onEdit,
  onDelete,
}: AdjustmentListStackProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedIndex = useMemo(
    () => (expandedId ? items.findIndex((it) => it.id === expandedId) : -1),
    [expandedId, items]
  );

  const renderItem: ListRenderItem<
    AdjustmentCardItem & { status: SettlementStatus }
  > = useCallback(
    ({ item, index }) => {
      const isLast = index === items.length - 1;
      const isExpanded = expandedId === item.id;
      const canExpand = !isLast; // 마지막 카드는 펼치지 않음

      return (
        <View
          style={[
            s.cardWrap,
            {
              marginTop: index === 0 ? 0 : -overlap,
              // ✅ 펼쳐진 카드 “바로 아래”에만 여백을 추가해서 다른 카드들이 밀려 내려가도록 함
              marginBottom: isExpanded ? overlap + 8 : 0,
              zIndex: isExpanded ? 99999 : index + 1,
              elevation: isExpanded ? 99999 : 6,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={
              canExpand
                ? () => setExpandedId(isExpanded ? null : item.id)
                : undefined
            }
            activeOpacity={canExpand ? 0.95 : 1}
            style={{ flex: 1 }}
          >
            <AdjustmentListCard
              item={item}
              status={item.status}
              onChangeStatus={onChangeStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [expandedId, items.length, onChangeStatus, onEdit, onDelete, overlap]
  );

  // ✅ 리스트 바닥 여백은 작게 유지 (과한 스크롤 방지)
  //   필요하면 "마지막 카드가 펼쳐진 경우"만 아주 소폭 추가
  const paddingBottom =
    expandedIndex === items.length - 1 && expandedIndex >= 0 ? 32 : 24;

  return (
    <View style={s.outer}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={[s.container, { paddingBottom }]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  outer: { overflow: "visible", flex: 1 },
  container: { paddingHorizontal: 10, paddingTop: 4 },
  cardWrap: { overflow: "visible" },
});