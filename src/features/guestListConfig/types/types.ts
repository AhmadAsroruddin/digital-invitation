export interface GuestlistConfig {
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

