import { Routes, Route, Navigate } from 'react-router-dom';

import Timeline from '../pages/Home/Timeline';
import Notes from '../pages/Home/Notes';
import Todos from '../pages/Home/Todos';
import NewPost from '../pages/Home/NewPost';
import Post from '../pages/Home/Post';
import NoteDetail from '../pages/Home/NoteDetail';

const HomeRoute = () => {
  return (
    <Routes>
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/new" element={<NoteDetail />} />
      <Route path="/notes/:id" element={<NoteDetail />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/posts" element={<NewPost />} />
      <Route path="/posts/:id" element={<Post />} />
      <Route path="*" element={<Navigate to="/home/timeline" replace />} />
    </Routes>
  );
};

export default HomeRoute;
