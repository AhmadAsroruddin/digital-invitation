import { GuestlistConfig } from '../types/types';
import { api } from './api';

// Create
export const createGuestlistConfig = async (data: GuestlistConfig) => {
  console.log(data)
  const response = await api.post('/guestlist-config', data);
  return response.data;
};

// Update
export const updateGuestlistConfig = async (data: GuestlistConfig) => {
  const response = await api.put(`/guestlist-config/${data.id}`, data);
  return response.data;
};

// Get all configs by event
export const fetchConfigsByEventId = async (eventId: number): Promise<GuestlistConfig[]> => {
  const response = await api.get(`/event/${eventId}/guestlist-config`);
  return response.data.data.map((config: any) => ({
    ...config,
    filterJson: config.filterJson ? JSON.parse(config.filterJson) : {},
    columnsJson: config.columnsJson ? JSON.parse(config.columnsJson) : [],
  }));
};

// Get single config by id
export const fetchGuestlistConfigByShareCode = async (shareCode: string): Promise<GuestlistConfig> => {
  const response = await api.get(`/guest-list/${shareCode}`);
  const data = response.data.data;

  return {
    ...data,
    filterJson: data.filterJson ? JSON.parse(data.filterJson) : {},
    columnsJson: data.columnsJson ? JSON.parse(data.columnsJson) : [],
  };
};
export const fetchGuestlistConfigById = async (id: number): Promise<GuestlistConfig> => {
  const response = await api.get(`/guestlist-config/${id}`);
  const data = response.data.data;

  return {
    ...data,
    filterJson: data.filterJson ? JSON.parse(data.filterJson) : {},
    columnsJson: data.columnsJson ? JSON.parse(data.columnsJson) : [],
  };
};

// Delete
export const deleteConfigById = async (id: number): Promise<void> => {
  await api.delete(`/guestlist-config/${id}`);
};
