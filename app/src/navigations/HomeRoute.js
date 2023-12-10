import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Propose from '../pages/Home/Propose';
import SentProposals from '../pages/Home/SentProposals';
import PendingProposals from '../pages/Home/PendingProposals';

const HomeRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/propose" element={<Propose />} />
      <Route path="/sent-proposals" element={<SentProposals />} />
      <Route path="/pending-proposals" element={<PendingProposals />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default HomeRoute;
