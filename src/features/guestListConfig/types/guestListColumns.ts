const COLUMN_LABELS: Record<string, string> = {
  name: 'Name',
  phone: 'Phone',
  guestGroup: 'Guest Group',
  invitedBy: 'Invited By',
  subEvents: 'Sub Events',
  rsvPs: 'RSVPs',
  RSVP: 'RSVP',
  Checkin: 'Check-in',
  ConfirmedPax: 'Confirmed Pax',
};

export const getGuestlistColumns = (guestlistData: any) => {
  if (!guestlistData) return [];

  return guestlistData.columnsJson.map((col: string) => ({
    name: COLUMN_LABELS[col] || col,
    selector: (row: any) => {
      if (col === 'RSVP') return row.rsvp?.status ?? 'No RSVP';
      if (col === 'Name') return row.name ?? '-';
      if (col === 'InvitedBy') return row.invitedBy ?? '-';
      if (col === 'GuestGroup') return row.guestGroup ?? '-';
      if (col === 'Phone') return row.phone ?? '-';
      if (col === 'Checkin') return row.checkIn?.checkedIn ? 'Check-In' : 'Not Checked-In';
      if (col === 'ConfirmedPax') return row.checkIn?.paxActual ?? '0';
      return row[col] || '-';
    },
    sortable: true,
    wrap: true,
  }));
};
