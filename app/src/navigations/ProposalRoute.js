import { Routes, Route, Navigate } from 'react-router-dom';

import Proposal from '../pages/Proposal';
import Propose from '../pages/Proposal/Propose';
import SentProposals from '../pages/Proposal/SentProposals';
import PendingProposals from '../pages/Proposal/PendingProposals';

const ProposalRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Proposal />} />
      <Route path="/propose" element={<Propose />} />
      <Route path="/sent-proposals" element={<SentProposals />} />
      <Route path="/pending-proposals" element={<PendingProposals />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ProposalRoute;
