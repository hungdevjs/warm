import { Routes, Route, Navigate } from 'react-router-dom';

import Game from '../pages/Game';

const GameRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="*" element={<Navigate to="/game" replace />} />
    </Routes>
  );
};

export default GameRoute;
