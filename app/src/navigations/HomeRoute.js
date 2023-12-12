import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Propose from '../pages/Home/Propose';
import SentProposals from '../pages/Home/SentProposals';
import PendingProposals from '../pages/Home/PendingProposals';
import Timeline from '../pages/Home/Timeline';
import Notes from '../pages/Home/Notes';
import Todos from '../pages/Home/Todos';
import NewPost from '../pages/Home/NewPost';

const HomeRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/propose" element={<Propose />} />
      <Route path="/sent-proposals" element={<SentProposals />} />
      <Route path="/pending-proposals" element={<PendingProposals />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/posts" element={<NewPost />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default HomeRoute;
