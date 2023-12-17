import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from '../pages/Menu';
import Profile from '../pages/Menu/Profile';
import Couple from '../pages/Menu/Couple';
import Balance from '../pages/Menu/Balance';

const MenuRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/couple" element={<Couple />} />
      <Route path="/balance" element={<Balance />} />
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
};

export default MenuRoute;
