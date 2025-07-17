import { Event } from '../types/types';
import { API_BASE_URL } from './config';
import { FetchEventsResponse } from '../types/types';

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${API_BASE_URL}/event`);
  if (!res.ok) {
    throw new Error('Gagal mengambil daftar event');
  }

  const json: FetchEventsResponse = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Gagal mengambil data event');
  }

  return json.data;
};