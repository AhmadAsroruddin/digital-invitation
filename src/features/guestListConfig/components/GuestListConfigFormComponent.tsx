import React, { useEffect } from 'react';
import { GuestlistConfig } from '../types/types';

interface Props {
  form: GuestlistConfig;
  setForm: React.Dispatch<React.SetStateAction<GuestlistConfig>>;
  subEvents: { id: number; name: string }[];
  brideFamily?: string;
  groomFamily?: string;
  invitedByList: string[];
  columnOptions: { label: string; value: string }[];
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isEdit?: boolean;
}

const GuestlistConfigForm = ({
  form,
  setForm,
  subEvents,
  brideFamily,
  groomFamily,
  invitedByList,
  columnOptions,
  onSubmit,
  onBack,
  isEdit = false,
}: Props) => {
  useEffect(() => {
    if (!form.columnsJson) {
      setForm((prev) => ({ ...prev, columnsJson: [] }));
    }

    if (!form.filterJson) {
      setForm((prev) => ({ ...prev, filterJson: {} }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['SubEvent', 'RSVP', 'InvitedBy', 'GuestGroup'].includes(name)) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-300 p-4">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-cyan-700 text-center">
          {isEdit ? 'Update Guestlist Configuration' : 'Create Guestlist Configuration'}
        </h2>

        {/* Sub Event */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Choose Sub Event</label>
          <select
            name="SubEvent"
            value={form.filterJson?.SubEvent || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Choose All Sub Event --</option>
            {subEvents?.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
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
            placeholder="e.g., Groom Family Guest List"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Filter Configuration */}
        <div className="border border-gray-400 p-4 flex flex-col gap-5 rounded-xl">
          <h3 className="mb-3 font-semibold text-gray-800">Filter Configuration</h3>

          {/* Guest Group */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Guest Group</label>
            <select
              name="GuestGroup"
              value={form.filterJson?.GuestGroup || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- No Filter Applied --</option>
              {brideFamily && <option value={brideFamily}>{brideFamily}</option>}
              {groomFamily && <option value={groomFamily}>{groomFamily}</option>}
            </select>
          </div>

          {/* RSVP */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">RSVP</label>
            <select
              name="RSVP"
              value={form.filterJson?.RSVP || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- No Filter Applied --</option>
              <option value="all">All RSVP</option>
              <option value="attending">Attending</option>
              <option value="not attending">Not Attending</option>
            </select>
          </div>

          {/* Invited By */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Invited By</label>
            <select
              name="InvitedBy"
              value={form.filterJson?.InvitedBy || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- No Filter Applied --</option>
              {invitedByList?.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Columns */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Displayed Columns</label>

          {columnOptions && columnOptions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {columnOptions.map((col) => (
                <label key={col.value} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={col.value}
                    checked={form.columnsJson?.includes(col.value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((prev) => ({
                        ...prev,
                        columnsJson: checked
                          ? [...(prev.columnsJson ?? []), col.value]
                          : (prev.columnsJson ?? []).filter((v) => v !== col.value),
                      }));
                    }}
                    className="accent-cyan-600"
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic mt-2">No column options available</p>
          )}
        </div>

        {/* Tombol Submit & Back */}
        <div className="flex gap-5">
          <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded">
            {isEdit ? 'Update' : 'Save'}
          </button>
          <button type="button" onClick={onBack} className="w-full py-2 bg-gray-300 text-gray-700 font-semibold rounded">
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestlistConfigForm;
