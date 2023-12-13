import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button, alpha } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

import { useSnackbar } from 'notistack';

import MainComponent from '../../components/MainComponent';
import Loading from '../../components/Loading';
import useProposalStore from '../../stores/proposal.store';
import {
  acceptProposal,
  declineProposal,
} from '../../services/firebase.service';

const PendingProposals = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const pendingProposals = useProposalStore((state) => state.pendingProposals);
  const proposalInitialized = useProposalStore((state) => state.initialized);
  const [loading, setLoading] = useState(false);

  const accept = async (proposalId) => {
    setLoading(true);
    try {
      await acceptProposal({ proposalId });
      enqueueSnackbar('Accepted proposal', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  const decline = async (proposalId) => {
    setLoading(true);
    try {
      await declineProposal({ proposalId });
      enqueueSnackbar('Declined proposal', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (proposalInitialized) {
      if (!pendingProposals.length) {
        navigate('/home');
      }
    }
  }, [proposalInitialized, pendingProposals]);

  return (
    <MainComponent>
      <Loading loading={loading} />
      <Box
        height="100vh"
        overflow="auto"
        py={2}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Box px={2} display="flex" alignItems="center">
            <IconButton onClick={() => navigate('/')}>
              <ArrowBackIosRoundedIcon sx={{ color: 'black' }} />
            </IconButton>
            <Box px={2}>
              <Typography fontSize={20} fontWeight={600}>
                Your pending proposals
              </Typography>
              <Typography fontStyle="italic">
                Choose your partner wisely!
              </Typography>
            </Box>
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
                          onClick={() => accept(proposal.id)}
                          disabled={loading}
                        >
                          Accept
                        </Button>
                        <Button
                          // size="small"
                          variant="contained"
                          color="error"
                          startIcon={<CloseRoundedIcon />}
                          sx={{ flex: 1 }}
                          onClick={() => decline(proposal.id)}
                          disabled={loading}
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
