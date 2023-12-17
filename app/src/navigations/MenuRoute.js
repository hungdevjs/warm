import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from '../pages/Menu';
import Profile from '../pages/Menu/Profile';

const MenuRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
};

export default MenuRoute;
