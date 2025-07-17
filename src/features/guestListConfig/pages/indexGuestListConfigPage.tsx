import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable, { TableColumn } from 'react-data-table-component';
import { GuestlistConfig } from '../types/types';
import { fetchConfigsByEventId, deleteConfigById } from '../services/guestlistConfigService';

const filterKeys = ['SubEvent', 'RSVP', 'InvitedBy', 'GuestGroup'];

const IndexGuestlistConfigPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const [configs, setConfigs] = useState<GuestlistConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadConfigs = async () => {
        try {
        const data = await fetchConfigsByEventId(Number(eventId));
        setConfigs(data);
        } catch (err) {
        setError('Gagal memuat konfigurasi.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadConfigs();
    }, [eventId]);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Yakin ingin menghapus konfigurasi ini?');
        if (!confirmDelete) return;

        try {
        await deleteConfigById(id);
        await loadConfigs();
        } catch {
        alert('Gagal menghapus konfigurasi.');
        }
    };

    const filteredConfigs = configs.filter((config) =>
        config.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: TableColumn<GuestlistConfig>[] = [
        {
        name: 'Nama',
        selector: row => row.name,
        sortable: true,
        },
        ...filterKeys.map(key => ({
        name: key,
        selector: (row: GuestlistConfig) => row.filterJson?.[key] ?? '-',
        sortable: true,
        })),
        {
        name: 'Aksi',
        cell: row => (
            <div className="flex gap-2">
            <button
                onClick={() => navigate(`/guestlist-config/event/${eventId}/edit/${row.id}`)}
                className="text-blue-600 hover:underline text-sm"
            >
                Edit
            </button>
            <button
                onClick={() => handleDelete(row.id!)}
                className="text-red-500 hover:underline text-sm"
            >
                Hapus
            </button>
            </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
            <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => navigate('/event-selection')}
                    className="text-cyan-600 hover:text-cyan-800 text-lg"
                    >
                    ←
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Guestlist Configuration</h1>
                </div>
                <button
                    onClick={() => navigate(`/guestlist-config/event/${eventId}/create`)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                >
                    + Buat Baru
                </button>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <DataTable
                    columns={columns}
                    data={filteredConfigs}
                    progressPending={loading}
                    noDataComponent="Tidak ada konfigurasi ditemukan."
                    pagination
                    highlightOnHover
                    responsive
                    subHeader
                    subHeaderComponent={
                        <input
                        type="text"
                        placeholder="Cari..."
                        className="border p-2 rounded w-full max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    }
                />
            </div>
        </div>
    );
};

export default IndexGuestlistConfigPage;
