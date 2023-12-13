import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import MainComponent from '../../components/MainComponent';
import useProposalStore from '../../stores/proposal.store';
import { searchUser, sendProposal } from '../../services/firebase.service';

const Propose = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const proposalInitialized = useProposalStore((state) => state.initialized);
  const sentProposals = useProposalStore((state) => state.sentProposals);
  const pendingProposals = useProposalStore((state) => state.pendingProposals);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    if (proposalInitialized) {
      if (!!sentProposals.length) {
        navigate('/sent-proposals');
      }
    }
  }, [proposalInitialized, sentProposals]);

  const submitSearch = async () => {
    setLoading(true);
    try {
      const result = await searchUser(search);
      setPartner(result);
      if (!result) throw new Error('User not found');
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  const submitProposal = async () => {
    setLoading(true);
    try {
      await sendProposal({ receiverId: partner.id });
      enqueueSnackbar('Sent proposal', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  return (
    <MainComponent>
      <Box
        height="100vh"
        overflow="auto"
        p={2}
        bgcolor="#fa5f60"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {partner ? (
            <>
              <Box width="100%" pb={2}>
                <Typography color="white" fontSize={18} fontWeight={600}>
                  {partner.username}
                </Typography>
                <Typography color="white">{partner.email}</Typography>
              </Box>
              <Box
                width="100%"
                borderRadius={2}
                overflow="hidden"
                sx={{
                  aspectRatio: '1/1',
                  '& img': {
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  },
                }}
              >
                <img src={partner.avatarURL} alt="avatar" />
              </Box>
              <Box width="100%" pt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    flex: 1,
                    boxShadow: 'none',
                    '&:active': {
                      boxShadow: 'none',
                    },
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                  onClick={() => setPartner(null)}
                  disabled={loading}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    flex: 1,
                    boxShadow: 'none',
                    '&:active': {
                      boxShadow: 'none',
                    },
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                  disabled={loading}
                  onClick={submitProposal}
                >
                  Send proposal
                </Button>
              </Box>
            </>
          ) : (
            <>
              <img src="/logo-white-192.png" alt="logo" width={92} />
              <Typography
                fontSize={48}
                fontFamily="'Sigmar One', sans-serif"
                color="white"
                align="center"
              >
                Warm
              </Typography>
              <Typography color="white" align="center" fontStyle="italic">
                Do fun things. Together.
              </Typography>
            </>
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          gap={2}
          color="white"
        >
          <Typography color="white" align="center" fontStyle="italic">
            Propose your partner to start using Warm!
          </Typography>
          {!!pendingProposals.length && (
            <Typography
              color="white"
              align="center"
              fontStyle="italic"
              sx={{
                '& span': {
                  textDecoration: 'underline',
                  cursor: 'pointer',
                },
              }}
              onClick={() => navigate('/pending-proposals')}
            >
              You have <span>{pendingProposals.length} pending proposals</span>
            </Typography>
          )}
          <TextField
            label="Your partner email or username"
            variant="filled"
            color="error"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ '& *': { color: 'white !important' } }}
          />
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={submitSearch}
            sx={{
              height: 60,
              boxShadow: 'none',
              bgcolor: '#fe415b',
              '&:active': {
                boxShadow: 'none',
                bgcolor: '#fe415b',
              },
              '&:hover': {
                boxShadow: 'none',
                bgcolor: '#fe415b',
              },
            }}
          >
            Search user
          </Button>
        </Box>
      </Box>
    </MainComponent>
  );
};

export default Propose;
