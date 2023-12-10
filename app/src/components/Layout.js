import { Box } from '@mui/material';

import Header from './Header';
import BottomNavs from './BottomNavs';

const Layout = ({ children }) => {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* <Header /> */}
      <Box flex={1} overflow="auto">
        {children}
      </Box>
      <BottomNavs />
    </Box>
  );
};

export default Layout;
