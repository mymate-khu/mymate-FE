import React, { useCallback, useState, useMemo } from "react";
import { View, StyleSheet, FlatList, ListRenderItem, TouchableOpacity } from "react-native";
import AdjustmentListCard, {
  AdjustmentCardItem,
  SettlementStatus,          // "settled" | "unsettled"
} from "./AdjustmentListCard";

export type AdjustmentListStackProps = {
  items: (AdjustmentCardItem & { status: SettlementStatus })[];
  overlap?: number;
  onChangeStatus?: (id: string, next: SettlementStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMenuPress?: (id: string) => void; // 메뉴 버튼 클릭 시 카드 펼치기용
};

export default function AdjustmentListStack({
  items,
  overlap = 210,
  onChangeStatus,
  onEdit,
  onDelete,
  onMenuPress,
}: AdjustmentListStackProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedIndex = useMemo(
    () => (expandedId ? items.findIndex((it) => it.id === expandedId) : -1),
    [expandedId, items]
  );

  const handleMenuPress = useCallback((id: string) => {
    setExpandedId(id); // 메뉴 버튼 클릭 시 카드 펼치기
  }, []);

  const renderItem: ListRenderItem<AdjustmentCardItem & { status: SettlementStatus }> = useCallback(
    ({ item, index }) => {
      const isLast = index === items.length - 1;
      const isExpanded = expandedId === item.id;
      const canExpand = !isLast;

      return (
        <View
          style={[
            s.cardWrap,
            {
              marginTop: index === 0 ? 0 : -overlap,
              marginBottom: isExpanded ? overlap + 8 : 0,
              zIndex: isExpanded ? 99999 : index + 1,
              elevation: isExpanded ? 99999 : 6,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={canExpand ? () => setExpandedId(isExpanded ? null : item.id) : undefined}
            activeOpacity={canExpand ? 0.95 : 1}
            style={{ flex: 1 }}
          >
            <AdjustmentListCard
              item={item}
              status={item.status}
              onChangeStatus={onChangeStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onMenuPress={handleMenuPress}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [expandedId, items.length, onChangeStatus, onEdit, onDelete, overlap]
  );

  const paddingBottom = expandedIndex === items.length - 1 && expandedIndex >= 0 ? 32 : 24;

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