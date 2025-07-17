export interface GuestlistConfig {
  id: number,
  eventId: number;
  name: string;
  filterJson: {
    SubEvent?: string;
    Rspv?: string;
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
  id: number;
  name: string;
  invitedBy: string;
}
