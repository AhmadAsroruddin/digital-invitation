import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import EventSelectionPage from './features/event/pages/eventSelectionPage';
import CreateGuestlistConfig from './features/guestListConfig/pages/CreateGuestListConfigPage';
import EditGuestlistConfig from './features/guestListConfig/pages/EditGuestlistConfigPage';
import GuestListViewPage from './features/guestListConfig/pages/GuestListPage';
import IndexGuestlistConfigPage from './features/guestListConfig/pages/IndexGuestListConfigPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className='min-h-screen min-w-full bg-gray-100'>
        <Routes>
          <Route path='/' element={<Navigate to='/event-selection' replace />} />
          <Route path='/event-selection' element={<EventSelectionPage />} />
          <Route
            path='/guestlist-config/event/:eventId/create'
            element={<CreateGuestlistConfig />}
          />
          <Route path='/guestlist-config/event/:eventId' element={<IndexGuestlistConfigPage />} />
          <Route
            path='/guestlist-config/event/:eventId/edit/:id'
            element={<EditGuestlistConfig />}
          />
          <Route path='/guest-list/:shareCode' element={<GuestListViewPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
