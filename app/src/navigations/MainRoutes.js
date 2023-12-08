import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import GameRoute from './GameRoute';
import ChatRoute from './ChatRoute';
import NotificationRoute from './NotificationRoute';
import MenuRoute from './MenuRoute';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/games/*" element={<GameRoute />} />
      <Route path="/chat/*" element={<ChatRoute />} />
      <Route path="/notifications/*" element={<NotificationRoute />} />
      <Route path="/menu/*" element={<MenuRoute />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MainRoutes;
