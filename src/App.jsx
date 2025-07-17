import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import EventSelectionPage from './features/event/pages/eventSelectionPage';
import GuestListConfigPage from './features/guestListConfig/pages/createGuestListConfigPage';
import IndexGuestlistConfigPage from './features/guestListConfig/pages/indexGuestListConfigPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className='min-h-screen min-w-full bg-gray-100'>
        <Routes>
          <Route path='/' element={<Navigate to='/event-selection' replace />} />
          <Route path='/event-selection' element={<EventSelectionPage />} />
          <Route path='/guestlist-config/event/:eventId/create' element={<GuestListConfigPage />} />
          <Route path='/guestlist-config/event/:eventId' element={<IndexGuestlistConfigPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
