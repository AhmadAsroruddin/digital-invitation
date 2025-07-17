import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/eventService';
import { Event } from '../types/types';

const EventSelectionPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan saat mengambil data event.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleSelect = (eventId: number) => {
    navigate(`/guestlist-config/event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-10 space-y-6">
        <h1 className="text-2xl font-bold text-cyan-700 text-center">Pilih Event</h1>

        {loading && <p className="text-center text-gray-700">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && events.length === 0 && (
          <p className="text-center text-gray-500">Belum ada event tersedia.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-cyan-50 cursor-pointer transition"
              onClick={() => handleSelect(event.id)}
            >
              <h3 className="text-lg font-semibold text-cyan-800 mb-1">{event.name}</h3>
              <p className="text-sm text-gray-600">ID: {event.id}</p>
              {/* Bisa tambahkan info lokasi atau tanggal jika ada */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSelectionPage;
