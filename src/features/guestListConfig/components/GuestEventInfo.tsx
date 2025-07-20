import React from 'react';

const GuestEventInfo = ({ event }) => {
  if (!event) return null;

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-1">
      <p className="text-lg font-semibold text-gray-800">{event.name}</p>
      <p className="text-sm text-gray-600">
        {new Date(event.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <p className="text-sm text-gray-600">{event.location}</p>
    </div>
  );
};

export default GuestEventInfo;
