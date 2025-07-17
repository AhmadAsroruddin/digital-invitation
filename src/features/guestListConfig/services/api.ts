import { config } from 'process';
import { GuestlistConfig } from '../types/types';

const BASE_URL = 'http://localhost:5000/api/v1';

export async function createGuestlistConfig(data: GuestlistConfig) {
  const res = await fetch('http://localhost:5000/api/v1/guestlist-config', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error('Failed to create guestlist configuration');
  }

  return res.json();
}

export const fetchConfigsByEventId = async (eventId: number): Promise<GuestlistConfig[]> => {
  const res = await fetch(`${BASE_URL}/event/${eventId}/guestlist-config`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch configs');
  return json.data.map((config: any) => ({
    ...config,
    filterJson: config.filterJson ? JSON.parse(config.filterJson) : {},
    columnsJson: config.columnsJson ? JSON.parse(config.columnsJson) : [],
  }));
};

export const deleteConfigById = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/guestlist-config/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal menghapus konfigurasi');
};
