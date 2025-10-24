import React from 'react';
import { SectionList, SectionListProps } from 'react-native';
import GlobalRefreshControl from './GlobalRefreshControl';

type Props<ItemT, SectionT> = SectionListProps<ItemT, SectionT> & {
  /** React Query 외에 이 화면만의 수동 갱신 로직 (선택) */
  onManualRefresh?: () => Promise<any> | void;
};

export default function RefreshableSectionList<ItemT, SectionT>({
  onManualRefresh,
  ...rest
}: Props<ItemT, SectionT>) {
  return (
    <SectionList
      {...rest}
      refreshControl={<GlobalRefreshControl onManualRefresh={onManualRefresh} />}
    />
  );
}
