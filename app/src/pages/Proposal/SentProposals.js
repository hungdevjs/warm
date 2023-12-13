import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, alpha } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';

import MainComponent from '../../components/MainComponent';
import Loading from '../../components/Loading';
import useProposalStore from '../../stores/proposal.store';
import { removeProposal } from '../../services/firebase.service';

const SentProposals = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const sentProposals = useProposalStore((state) => state.sentProposals);
  const proposalInitialized = useProposalStore((state) => state.initialized);
  const [loading, setLoading] = useState(false);

  const remove = async (proposalId) => {
    setLoading(true);
    try {
      await removeProposal({ proposalId });
      enqueueSnackbar('Removed proposal', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (proposalInitialized) {
      if (!sentProposals.length) {
        navigate('/');
      }
    }
  }, [proposalInitialized, sentProposals]);

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
          <Box px={2}>
            <Typography fontSize={20} fontWeight={600}>
              Your sent proposals
            </Typography>
            <Typography fontStyle="italic">
              Waiting for them to response...
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            {sentProposals.map((proposal) => (
              <Box key={proposal.id} bgcolor="#f5f5f5" p={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    width="100%"
                    borderRadius={2}
                    overflow="hidden"
                    sx={{
                      aspectRatio: '1/1',
                      backgroundImage: `url(${proposal.receiver?.avatarURL})`,
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
                          {proposal.receiver?.username}
                        </Typography>
                        <Typography color="white">
                          {proposal.receiver?.email}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={2}>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteRoundedIcon />}
                          sx={{ flex: 1 }}
                          onClick={() => remove(proposal.id)}
                          disabled={loading}
                        >
                          Delete proposal
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

export default SentProposals;
