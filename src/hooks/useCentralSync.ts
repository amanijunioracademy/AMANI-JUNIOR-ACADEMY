import { useEffect, useState, useCallback } from 'react';
import { syncService, SyncState } from '../services/syncService';

export function useCentralSync(onDataChange?: () => void) {
  const [syncState, setSyncState] = useState<SyncState>(syncService.getState());

  useEffect(() => {
    // Start background sync polling if not already active
    syncService.init();

    const unsubSync = syncService.subscribe((state) => {
      setSyncState(state);
    });

    let unsubData: (() => void) | undefined;
    if (onDataChange) {
      unsubData = syncService.onDataChange(() => {
        onDataChange();
      });
    }

    return () => {
      unsubSync();
      if (unsubData) unsubData();
    };
  }, [onDataChange]);

  const triggerManualSync = useCallback(async () => {
    return await syncService.syncNow();
  }, []);

  return {
    ...syncState,
    syncNow: triggerManualSync,
  };
}
