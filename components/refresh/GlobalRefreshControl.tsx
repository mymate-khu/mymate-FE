import React, { memo, useCallback } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'> & {
  /** React Query 외에 수동으로 해야 할 작업이 있으면 등록 (선택) */
  onManualRefresh?: () => Promise<any> | void;
};

export default memo(function GlobalRefreshControl({ onManualRefresh, ...rest }: Props) {
  const isFetching = useIsFetching(); // 활성 쿼리 fetching 개수
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    // 1) React Query 전체/활성 쿼리 갱신
    await queryClient.invalidateQueries({ refetchType: 'active' });
    // 2) 추가로 수동 갱신이 필요하면 실행 (선택)
    if (onManualRefresh) await onManualRefresh();
  }, [queryClient, onManualRefresh]);

  return (
    <RefreshControl
      refreshing={isFetching > 0}
      onRefresh={onRefresh}
      {...rest}
    />
  );
});
