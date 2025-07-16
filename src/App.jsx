import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import GuestListConfigPage from './features/guestListConfig/pages/guestListConfigPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className='min-h-screen min-w-full bg-gray-100'>
        <Routes>
          <Route path='/' element={<Navigate to='/guestlist-config/create' replace />} />
          <Route path='/guestlist-config/create' element={<GuestListConfigPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
