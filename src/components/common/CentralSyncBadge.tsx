import React from 'react';
import { RefreshCw, CheckCircle2, WifiOff, Cloud } from 'lucide-react';
import { useCentralSync } from '../../hooks/useCentralSync';

interface CentralSyncBadgeProps {
  className?: string;
  compact?: boolean;
}

export const CentralSyncBadge: React.FC<CentralSyncBadgeProps> = ({ className = '', compact = false }) => {
  const { isOnline, isSyncing, lastSyncedAt, pendingCount, syncNow } = useCentralSync();

  return (
    <div
      id="central-sync-status-badge"
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
        !isOnline
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : isSyncing
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      } ${className}`}
      title={
        !isOnline
          ? `Offline mode. ${pendingCount} updates queued for auto-sync.`
          : `Connected to Central Database. All devices (mobile & desktop) synchronized.`
      }
    >
      <div className="flex items-center gap-1.5">
        {!isOnline ? (
          <WifiOff className="w-3.5 h-3.5 text-amber-600" />
        ) : isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        ) : (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}

        <span className="font-semibold tracking-tight">
          {!isOnline
            ? pendingCount > 0
              ? `Offline (${pendingCount} queued)`
              : 'Offline Cache'
            : isSyncing
            ? 'Syncing...'
            : compact
            ? 'Live Sync'
            : 'Central DB Active'}
        </span>
      </div>

      {!compact && lastSyncedAt && isOnline && !isSyncing && (
        <span className="text-[10px] text-emerald-700/80 border-l border-emerald-300/60 pl-1.5 hidden sm:inline">
          {new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      )}

      <button
        type="button"
        onClick={() => syncNow()}
        disabled={isSyncing}
        title="Force manual sync with Central Database"
        className="ml-0.5 p-0.5 hover:bg-black/5 rounded transition-colors text-current disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
