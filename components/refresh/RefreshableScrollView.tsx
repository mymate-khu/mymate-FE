import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import GlobalRefreshControl from './GlobalRefreshControl';

export default function RefreshableScrollView({
  contentContainerStyle,
  ...rest
}: ScrollViewProps & { onManualRefresh?: () => Promise<any> | void }) {
  return (
    <ScrollView
      {...rest}
      // 내용이 적어도 당겨서 새로고침 가능하도록
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      refreshControl={<GlobalRefreshControl onManualRefresh={rest.onManualRefresh} />}
    />
  );
}
