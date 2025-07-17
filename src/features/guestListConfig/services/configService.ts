import { Event, Guest, GuestlistConfig } from '../types/types';
import { API_BASE_URL } from './config';

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE_URL}/event`);
  const json = await res.json();
  return json.data;
}

export async function fetchEventById(id: number): Promise<Event> {
  const res = await fetch(`${API_BASE_URL}/event/${id}`);
  const json = await res.json();
  return json.data;
}

export async function fetchGuestsByEventId(eventId: number): Promise<Guest[]> {
  const res = await fetch(`${API_BASE_URL}/event/${eventId}/guest`);
  const json = await res.json();
  return json.data;
}
