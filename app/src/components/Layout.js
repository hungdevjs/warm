import { Box } from '@mui/material';

import BottomNavs from './BottomNavs';

const Layout = ({ children }) => {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flex={1} overflow="auto">
        {children}
      </Box>
      <BottomNavs />
    </Box>
  );
};

export default Layout;
