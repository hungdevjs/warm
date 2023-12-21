import { Box } from '@mui/material';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';

import BottomNavs from './BottomNavs';

const Layout = ({ children }) => {
  const isKeyboardOpen = useDetectKeyboardOpen();

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flex={1} overflow="auto" bgcolor="#f8f8f8">
        {children}
      </Box>
      {!isKeyboardOpen && <BottomNavs />}
    </Box>
  );
};

export default Layout;
