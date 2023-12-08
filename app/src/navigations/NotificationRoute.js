import { Routes, Route, Navigate } from 'react-router-dom';

import Notification from '../pages/Notification';

const NotificationRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Notification />} />
      <Route path="*" element={<Navigate to="/notification" replace />} />
    </Routes>
  );
};

export default NotificationRoute;
