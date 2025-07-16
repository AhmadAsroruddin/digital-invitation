import React, { useEffect, useState } from 'react';
import { GuestlistConfig } from '../types/types';
import { createGuestlistConfig } from '../services/api';

type Event = {
    id: number;
    name: string;
    brideFamily?: string;
    groomFamily?: string;
};
type Guest = {
    id: number;
    name: string;
    invitedBy: string;
};
const columnOptions = [
  { label: 'Name', value: 'Name' },
  { label: 'Phone', value: 'Phone' },
  { label: 'RSVP Status', value: 'RSVP' },
  { label: 'Guest Group', value: 'GuestGroup' },
  { label: 'Invited By', value: 'InvitedBy' },
];


const GuestlistConfigForm = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [groomFamily, setGroomFamily] = useState<string>('');
    const [brideFamily, setBrideFamily] = useState<string>('');
    const [subEvents, setSubEvents] = useState<{ id: number; name: string }[]>([]);
    const [form, setForm] = useState<GuestlistConfig>({
        eventId: 0,
        name: '',
        filterJson: { SubEvent: '', Rspv: '', GuestGroup: '' },
        columnsJson: [],
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/event')
        .then((res) => res.json())
            .then((data) => {
                console.log(data.data)
                setEvents(data.data);
            })
            .catch((err) => console.error('Error fetching events:', err));
    }, []);

    useEffect(() => {
        if (!form.eventId) return;
        fetch('http://localhost:5000/api/v1/event/3/guest')
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data)
                setGuests(data.data);
            })
    })
        
    useEffect(() => {
        if (!form.eventId) return;
        fetch(`http://localhost:5000/api/v1/event/${form.eventId}`)
            .then((res) => res.json())
            .then((data) => {
                setBrideFamily(data.data.brideFamily)
                setGroomFamily(data.data.groomFamily)
                setSubEvents(data.data.subEvents || []);
            })
            .catch((err) => console.error('Error fetching sub events:', err));
    }, [form.eventId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (['SubEvent', 'Rspv', 'InvitedBy', 'GuestGroup'].includes(name)) {
        setForm({ ...form, filterJson: { ...form.filterJson, [name]: value } });
        } else if (name === 'columnsJson') {
        const columns = value.split(',').map((col) => col.trim());
        setForm({ ...form, columnsJson: columns });
        } else {
        setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const response = await createGuestlistConfig(form);
        console.log('Created:', response);
        alert('Guestlist Configuration Created');
        } catch (err) {
        alert('Failed to create guestlist configuration');
        }
    };

    const invitedByList = Array.from(
        new Set(guests.map((g) => g.invitedBy).filter(Boolean))
    );    
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-10 space-y-6"
            >
                <h2 className="text-2xl font-bold text-cyan-700 text-center">
                Create Guestlist Configuration
                </h2>

                {/* Event Selector */}
                <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Choose Event</label>
                <select
                    name="eventId"
                    value={form.eventId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                >
                    <option value="">-- Choose Event --</option>
                    {events.map((event) => (
                    <option key={event.id} value={event.id}>
                        {event.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Sub Event Selector */}
                <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Choose Sub Event</label>
                <select
                    name="SubEvent"
                    value={form.filterJson.SubEvent}
                    onChange={(e) =>
                    setForm((prev) => ({
                        ...prev,
                        filterJson: { ...prev.filterJson, SubEvent: e.target.value },
                    }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="">-- Choose All Sub Event --</option>
                    {subEvents.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                        {sub.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Name */}
                <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Configuration Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Daftar Tamu Keluarga Pria"
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
                        onChange={(e) =>
                            setForm((prev) => ({
                            ...prev,
                            filterJson: { ...prev.filterJson, GuestGroup: e.target.value },
                            }))
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                        <option value="">-- No Filter Applied --</option>
                        <option value={brideFamily}>{brideFamily}</option>
                        <option value={groomFamily}>{groomFamily}</option>
                        
                        </select>
                    </div>

                    {/* RSVP Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Status RSVP</label>
                        <select
                        name="Rspv"
                        value={form.filterJson.Rspv}
                        onChange={(e) =>
                            setForm((prev) => ({
                            ...prev,
                            filterJson: { ...prev.filterJson, Rspv: e.target.value },
                            }))
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                        <option value="">-- No Filter Applied --</option>
                        <option value="all">All RSVP</option>
                        <option value="attending">Attendance</option>
                        <option value="not attending">Not Attendance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Invited By</label>
                        <select
                            name="InvitedBy"
                            value={form.filterJson.InvitedBy || ''}
                            onChange={(e) =>
                                setForm((prev) => ({
                                ...prev,
                                filterJson: { ...prev.filterJson, InvitedBy: e.target.value },
                                }))
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                            <option value="">-- No Filter Applied --</option>
                            {invitedByList.map((name, idx) => (
                                <option key={idx} value={name}>
                                {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Columns */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Displayed Column
                    </label>
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

                {/* Submit */}
                <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded transition-all"
                >
                Save Configuration
                </button>
            </form>
        </div>
    );
};

export default GuestlistConfigForm;
