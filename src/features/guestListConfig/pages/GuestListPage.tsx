    import React, { useEffect, useState, useMemo } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { fetchGuestlistConfigByShareCode } from '../services/guestlistConfigService';
    import DataTable, { TableColumn } from 'react-data-table-component';

    const COLUMN_LABELS: Record<string, string> = {
    name: 'Name',
    phone: 'Phone',
    guestGroup: 'Guest Group',
    invitedBy: 'Invited By',
    subEvents: 'Sub Events',
    rsvPs: 'RSVPs',
    };

    const GuestListViewPage = () => {
    const { shareCode } = useParams();
    const navigate = useNavigate();

    const [guestlistData, setGuestlistData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            if (!shareCode) return;
            const data = await fetchGuestlistConfigByShareCode(shareCode);
            setGuestlistData(data);
        } catch {
            setError('Gagal memuat data tamu.');
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, [shareCode]);

    const columns = useMemo(() => {
        if (!guestlistData) return [];

        return guestlistData.columnsJson.map((col: string): TableColumn<any> => ({
        name: COLUMN_LABELS[col] || col,
        selector: (row: any) => {
            console.log(row)
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
    }, [guestlistData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
            <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">

                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-800">Guestlist View</h1>
                </div>

                {guestlistData && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-1">
                        <p className="text-lg font-semibold text-gray-800">{guestlistData.event.name}</p>
                        <p className="text-sm text-gray-600">
                        {new Date(guestlistData.event.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                        </p>
                        <p className="text-sm text-gray-600">{guestlistData.event.location}</p>
                    </div>
                )}

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
