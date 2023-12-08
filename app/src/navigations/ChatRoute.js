import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';

const ChatRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
};

export default ChatRoute;
