import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, alpha } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import MainComponent from '../../components/MainComponent';
import useProposalStore from '../../stores/proposal.store';
import useCoupleStore from '../../stores/couple.store';

const PendingProposals = () => {
  const navigate = useNavigate();
  const pendingProposals = useProposalStore((state) => state.pendingProposals);
  const couple = useCoupleStore((state) => state.couple);
  const coupleInitialized = useCoupleStore((state) => state.initialized);
  const proposalInitialized = useProposalStore((state) => state.initialized);

  useEffect(() => {
    if (coupleInitialized && proposalInitialized) {
      if (!!couple || !pendingProposals.length) {
        navigate('/home');
      }
    }
  }, [coupleInitialized, proposalInitialized, couple, pendingProposals]);

  return (
    <MainComponent>
      <Box
        minHeight="100%"
        py={2}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Box px={2}>
            <Typography fontSize={20} fontWeight={600}>
              Your pending proposals
            </Typography>
            <Typography fontStyle="italic">
              Choose your partner wisely!
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            {pendingProposals.map((proposal) => (
              <Box key={proposal.id} bgcolor="#f5f5f5" p={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    width="100%"
                    borderRadius={2}
                    overflow="hidden"
                    sx={{
                      aspectRatio: '1/1',
                      backgroundImage: `url(${proposal.sender?.avatarURL})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <Box
                      width="100%"
                      height="100%"
                      bgcolor={alpha('#000', 0.2)}
                      p={2}
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box>
                        <Typography
                          color="white"
                          fontSize={18}
                          fontWeight={600}
                        >
                          {proposal.sender?.username}
                        </Typography>
                        <Typography color="white">
                          {proposal.sender?.email}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={2}>
                        <Button
                          // size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckRoundedIcon />}
                          sx={{ flex: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          // size="small"
                          variant="contained"
                          color="error"
                          startIcon={<CloseRoundedIcon />}
                          sx={{ flex: 1 }}
                        >
                          Decline
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </MainComponent>
  );
};

export default PendingProposals;
