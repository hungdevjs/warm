import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from '../pages/Menu';

const MenuRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
};

export default MenuRoute;
