import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGuestlistConfigByShareCode } from '../services/guestlistConfigService';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { API_BASE_URL } from './config';


export const useGuestlistData = () => {
  const { shareCode } = useParams();
  const [guestlistData, setGuestlistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (!shareCode) return;
      const data = await fetchGuestlistConfigByShareCode(shareCode);
      setGuestlistData(data);
      setError(null);
    } catch {
      setError('Gagal memuat data tamu.');
    } finally {
      setLoading(false);
    }
  }, [shareCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!guestlistData?.event?.id) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5000/guestListHub`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    let isMounted = true;

    connection.start()
      .then(() => {
        if (!isMounted) return;
        connection.invoke("JoinGroup", `event_${guestlistData.event.id}`);
        connection.invoke("TriggerManual");

        connection.on("RSVPUpdated", (data) => {
          console.log("[SignalR] RSVPUpdated received", data);
          fetchData();
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("SignalR connection error", err);
      });

    return () => {
      isMounted = false;
      connection.off("RSVPUpdated");
      connection.stop();
    };
  }, [guestlistData?.event?.id, fetchData]);

  return { guestlistData, loading, error };
};
