import { Routes, Route, Navigate } from 'react-router-dom';

import GameRoute from './GameRoute';
import ChatRoute from './ChatRoute';
import NotificationRoute from './NotificationRoute';
import MenuRoute from './MenuRoute';
import HomeRoute from './HomeRoute';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/games/*" element={<GameRoute />} />
      <Route path="/chat/*" element={<ChatRoute />} />
      <Route path="/notifications/*" element={<NotificationRoute />} />
      <Route path="/menu/*" element={<MenuRoute />} />
      <Route path="/home/*" element={<HomeRoute />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default MainRoutes;
