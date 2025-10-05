// app/adjustment/AdjustmentListStack.tsx
import React, { useCallback } from "react";
import { View, StyleSheet, FlatList, ListRenderItem } from "react-native";
import AdjustmentListCard, {
  AdjustmentCardItem,
  SettlementStatus,
} from "./AdjustmentListCard";

export type AdjustmentListStackProps = {
  items: (AdjustmentCardItem & { status: SettlementStatus })[];
  overlap?: number; // 겹치는 높이 (기본 18)
  onChangeStatus?: (id: string, next: SettlementStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function AdjustmentListStack({
  items,
  overlap = 230,
  onChangeStatus,
  onEdit,
  onDelete,
}: AdjustmentListStackProps) {
  const renderItem: ListRenderItem<AdjustmentCardItem & { status: SettlementStatus }> = useCallback(
    ({ item, index }) => (
      <View
        style={[
          s.cardWrap,
          {
            // 첫 카드만 정상 간격, 이후부터는 위 카드와 겹치도록 음수 마진
            marginTop: index === 0 ? 0 : -overlap,
            // 아래 카드 위에 포개지도록 인덱스가 클수록 앞으로
            zIndex: index + 1,
            // 안드로이드에서 zIndex 보완
            elevation: 6,
          },
        ]}
        pointerEvents="box-none"
      >
        <AdjustmentListCard
          item={item}
          status={item.status}
          onChangeStatus={onChangeStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </View>
    ),
    [onChangeStatus, onEdit, onDelete, overlap]
  );

  return (
    <View style={s.outer}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={[s.container, { paddingBottom: 24 + overlap }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    // 겹칠 때 그림자/모서리가 잘리지 않도록
    overflow: "visible",
  },
  container: {
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  cardWrap: {
    // 각 카드 래퍼도 잘리지 않게
    overflow: "visible",
  },
});