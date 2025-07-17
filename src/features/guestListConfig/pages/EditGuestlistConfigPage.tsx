import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GuestlistConfigForm from '../components/GuestListConfigFormComponent';
import { fetchGuestlistConfigById, updateGuestlistConfig } from '../services/guestlistConfigService';
import { fetchEventById, fetchGuestsByEventId } from '../services/configService';
import { GuestlistConfig } from '../types/types';

const columnOptions = [
  { label: 'Name', value: 'Name' },
  { label: 'Phone', value: 'Phone' },
  { label: 'RSVP Status', value: 'RSVP' },
  { label: 'Guest Group', value: 'GuestGroup' },
  { label: 'Invited By', value: 'InvitedBy' },
];

const EditGuestlistConfig = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<GuestlistConfig | null>(null);
  const [subEvents, setSubEvents] = useState<{ id: number; name: string }[]>([]);
  const [invitedByList, setInvitedByList] = useState<string[]>([]);
  const [brideFamily, setBrideFamily] = useState('');
  const [groomFamily, setGroomFamily] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const config = await fetchGuestlistConfigById(Number(id));
      setForm(config);

      const event = await fetchEventById(config.eventId);
      setSubEvents(event.subEvents || []);
      setBrideFamily(event.brideFamily || 'Bride');
      setGroomFamily(event.groomFamily || 'Groom');

      const guests = await fetchGuestsByEventId(config.eventId);
      const invitedBySet = new Set(guests.map((g) => g.invitedBy).filter(Boolean));
      setInvitedByList(Array.from(invitedBySet));
    };

    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      await updateGuestlistConfig(form);
      navigate(`/guestlist-config/event/${form.eventId}`);
    }
  };

  if (!form) return <p className="text-center mt-10">Loading...</p>;

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
      isEdit={true}
    />
  );
};

export default EditGuestlistConfig;
