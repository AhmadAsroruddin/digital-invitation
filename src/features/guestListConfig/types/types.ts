export interface GuestlistConfig {
  id?: number,
  eventId?: number,
  subEventId?: number,
  name: string;
  filterJson: {
    SubEvent?: string;
    RSVP?: string;
    InvitedBy?: string;
    GuestGroup?: string;
  };
  columnsJson: string[];
}

export enum GuestGroupType {
  BrideFamily = 'BrideFamily',
  GroomFamily = 'GroomFamily'
}

export interface Event {
  id: number;
  name: string;
  brideFamily?: string;
  groomFamily?: string;
  subEvents?: {
    id: number;
    name: string;
  }[];
}

export interface Guest {
  guestId: number;
  name: string;
  phone: string;
  guestGroup: string;
  invitedBy: string;
  subEvents: SubEvent[];
  rsvPs: any[]; // Atur jika kamu punya detail RSVP
}

export interface SubEvent {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
}