import { Box, Typography } from '@mui/material';

import useUserStore from '../stores/user.store';
import useCoupleStore from '../stores/couple.store';
import useProposalStore from '../stores/proposal.store';

const MainComponent = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const coupleInitialized = useCoupleStore((state) => state.initialized);
  const proposalInitizlied = useProposalStore((state) => state.initialized);

  if (!user || !coupleInitialized || !proposalInitizlied)
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography align="center">Loading user information...</Typography>
      </Box>
    );

  return children;
};

export default MainComponent;
