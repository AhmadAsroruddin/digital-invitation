import React from 'react';
import DataTable from 'react-data-table-component';
import GuestEventInfo from '../components/GuestEventInfo';
import { useGuestlistData } from '../services/useGuestListData';
import { getGuestlistColumns } from '../types/guestListColumns';

const GuestListViewPage = () => {
  const { guestlistData, loading, error } = useGuestlistData();
  const columns = getGuestlistColumns(guestlistData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-800">{ guestlistData.configurationName }</h1>

        {guestlistData && <GuestEventInfo event={guestlistData.event} subEvent={guestlistData.subEvent} />}
        {error && <p className="text-red-500">{error}</p>}

        <DataTable
          columns={columns}
          data={guestlistData?.guests || []}
          progressPending={loading}
          noDataComponent="Tidak ada tamu ditemukan."
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </div>
  );
};

export default GuestListViewPage;
