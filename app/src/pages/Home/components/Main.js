import { Box } from '@mui/material';

import Header from './Header';
import Tabs from './Tabs';

const Main = ({ children }) => {
  return (
    <Box height="100%" display="flex" flexDirection="column" gap={0.75}>
      <Header />
      <Tabs />
      <Box flex={1} overflow="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Main;
