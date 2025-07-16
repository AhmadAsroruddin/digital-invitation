import { GuestlistConfig } from '../types/types';

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
