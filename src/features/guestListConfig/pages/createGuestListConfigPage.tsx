import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuestlistConfig } from '../types/types';
import { createGuestlistConfig } from '../services/guestlistConfigService';
import { fetchEventById, fetchGuestsByEventId } from '../services/configService';


const GuestlistConfigForm = () => {
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
    filterJson: { SubEvent: '', Rspv: '', GuestGroup: '', InvitedBy: '' },
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-cyan-700 text-center">Create Guestlist Configuration</h2>

        {/* Sub Event Selector */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Choose Sub Event</label>
          <select
            name="SubEvent"
            value={form.filterJson.SubEvent}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">-- Choose All Sub Event --</option>
            {subEvents.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        {/* Configuration Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Configuration Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Groom Family Guest List"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        {/* Filter Configuration */}
        <div className="border border-gray-400 p-4 flex flex-col gap-5 rounded-xl">
          <h3 className="mb-3 font-semibold text-gray-800">Filter Configuration</h3>

          {/* Guest Family */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Guest Family</label>
            <select
              name="GuestGroup"
              value={form.filterJson.GuestGroup || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">-- No Filter Applied --</option>
              {brideFamily && <option value={brideFamily}>{brideFamily}</option>}
              {groomFamily && <option value={groomFamily}>{groomFamily}</option>}
            </select>
          </div>

          {/* RSVP Status */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">RSVP Status</label>
            <select
              name="Rspv"
              value={form.filterJson.Rspv}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">-- No Filter Applied --</option>
              <option value="all">All RSVP</option>
              <option value="attending">Attendance</option>
              <option value="not attending">Not Attendance</option>
            </select>
          </div>

          {/* Invited By */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Invited By</label>
            <select
              name="InvitedBy"
              value={form.filterJson.InvitedBy || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">-- No Filter Applied --</option>
              {invitedByList.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Columns */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Displayed Columns</label>
          <div className="grid grid-cols-2 gap-2">
            {columnOptions.map((col) => (
              <label key={col.value} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={col.value}
                  checked={form.columnsJson.includes(col.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      columnsJson: checked
                        ? [...prev.columnsJson, col.value]
                        : prev.columnsJson.filter((v) => v !== col.value),
                    }));
                  }}
                  className="accent-cyan-600"
                />
                <span>{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='flex gap-5'>
          <button
            type="submit"
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded transition-all"
          >
            Save Configuration
          </button>
          <button
            type="submit"
            onClick={handleBack}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded transition-all"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestlistConfigForm;
