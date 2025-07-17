import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuestlistConfig } from '../types/types';
import { createGuestlistConfig } from '../services/guestlistConfigService';
import { fetchEventById, fetchGuestsByEventId } from '../services/configService';
import GuestlistConfigForm from '../components/GuestListConfigFormComponent';

const CreateGuestlistConfig = () => {
  const columnOptions = [
    { label: 'Name', value: 'Name' },
    { label: 'Phone', value: 'Phone' },
    { label: 'RSVP Status', value: 'RSVP' },
    { label: 'Guest Group', value: 'GuestGroup' },
    { label: 'Invited By', value: 'InvitedBy' },
  ];
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [guests, setGuests] = useState<any[]>([]);
  const [brideFamily, setBrideFamily] = useState('');
  const [groomFamily, setGroomFamily] = useState('');
  const [subEvents, setSubEvents] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState<GuestlistConfig>({
    id: null,
    eventId: Number(eventId),
    name: '',
    filterJson: { SubEvent: '', RSVP: '', GuestGroup: '', InvitedBy: '' },
    columnsJson: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['SubEvent', 'Rspv', 'InvitedBy', 'GuestGroup'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        filterJson: { ...prev.filterJson, [name]: value },
      }));
    } else if (name === 'columnsJson') {
      const columns = value.split(',').map((col) => col.trim());
      setForm((prev) => ({ ...prev, columnsJson: columns }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBack = () => {
    navigate('/guestlist-config/event/'+eventId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createGuestlistConfig(form);
      
      alert('Guestlist Configuration Created');
      navigate('/guestlist-config/event/'+eventId)
    } catch (err) {
      alert('Failed to create guestlist configuration');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;

      try {
        const event = await fetchEventById(Number(eventId));
        setBrideFamily(event.brideFamily || '');
        setGroomFamily(event.groomFamily || '');
        setSubEvents(event.subEvents || []);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }

      try {
        const data = await fetchGuestsByEventId(Number(eventId));
        setGuests(data);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };

    loadData();
  }, [eventId]);

  const invitedByList = Array.from(new Set(guests.map((g) => g.invitedBy).filter(Boolean)));

  return (
    <GuestlistConfigForm
      form={form}
      setForm={setForm}
      subEvents={subEvents}
      invitedByList={invitedByList}
      brideFamily={brideFamily}
      groomFamily={groomFamily}
      columnOptions={columnOptions}
      onSubmit={handleSubmit}
      onBack={() => navigate(-1)}
      isEdit={false}
    />
  );
};

export default CreateGuestlistConfig;
