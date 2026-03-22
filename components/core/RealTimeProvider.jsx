'use client'

import { createContext, useContext, useEffect, useState } from 'react';

const RealTimeContext = createContext({
  latestTelemetry: null,
  latestAlert: null,
  userOrgId: null,
  connected: false
});

export function RealTimeProvider({ children }) {
  const [userOrgId, setUserOrgId] = useState(null);
  const [state, setState] = useState({
    latestTelemetry: null,
    latestAlert: null,
    telemetryHistory: [],
    alertHistory: [],
    deviceCount: 0,
    connected: false
  });

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.orgId) {
        setUserOrgId(data.orgId);
      }
    } catch (err) {
      console.error('Failed to fetch session', err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setState(s => ({ ...s, alertHistory: data }));
      }
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.deviceCount !== undefined) {
        setState(s => ({ ...s, deviceCount: data.deviceCount }));
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    // [SPLA-BOOT] Client-side component registration (Safe for JSX)
    import('@/lib/domain/boot.js').then(m => m.bootClient());

    fetchSession();
    fetchStats();
    fetchAlerts();
    const sse = new EventSource('/api/stream');

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connected') {
        setState(s => ({ ...s, connected: true }));
      } else if (data.type === 'telemetry') {
        const item = { ...data.payload, receivedAt: Date.now() };
        setState(s => ({
          ...s,
          latestTelemetry: item,
          telemetryHistory: [item, ...s.telemetryHistory].filter(t => Date.now() - t.receivedAt < 60000)
        }));
      } else if (data.type === 'alert') {
        const item = { ...data.payload, receivedAt: Date.now() };
        setState(s => ({
          ...s,
          latestAlert: item,
          alertHistory: [item, ...s.alertHistory].slice(0, 100)
        }));
      } else if (data.type === 'stats_update') {
        fetchStats();
      }
    };

    sse.onerror = () => {
      setState(s => ({ ...s, connected: false }));
      sse.close();
    };

    const expiryTimer = setInterval(() => {
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const fiveSecsAgo = now - 5000;

      setState(s => ({
        ...s,
        telemetryHistory: s.telemetryHistory.filter(t => t.receivedAt > fiveSecsAgo),
        alertHistory: s.alertHistory.filter(a => new Date(a.timestamp).getTime() > oneDayAgo)
      }));
    }, 1000);

    return () => {
      sse.close();
      clearInterval(expiryTimer);
    };
  }, []);

  const now = Date.now();
  const fiveSecsAgo = now - 5000;
  const slidingHistory = state.telemetryHistory.filter(t => t.receivedAt > fiveSecsAgo);
  const activeDeviceIds = new Set(slidingHistory.map(t => t.deviceId));

  const value = {
    ...state,
    userOrgId,
    deviceCount: activeDeviceIds.size,
    telemetryPerMinute: slidingHistory.length * 2
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
}

export const useLiveStream = () => useContext(RealTimeContext);
