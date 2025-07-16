import { API_BASE_URL } from '../config/env';

export const apiGet = async (url: string) => {
  const response = await fetch(`${API_BASE_URL}${url}`);
  if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
  return await response.json();
};
