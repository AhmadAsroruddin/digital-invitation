// src/services/eventService.ts

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  groomName: string;
  brideName: string;
  groomFamily: string;
  brideFamily: string;
  subEvents: any[]; // kamu bisa definisikan lebih detail kalau subEvents dipakai
}

export interface FetchEventsResponse {
  success: boolean;
  message: string;
  data: Event[];
  errors: any;
}


