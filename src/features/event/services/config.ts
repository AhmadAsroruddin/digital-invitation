// Konfigurasi endpoint API agar fleksibel saat pindah environment

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
