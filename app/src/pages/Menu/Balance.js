import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { useSnackbar } from 'notistack';

import Main from './components/Main';
import useCoupleStore from '../../stores/couple.store';
import { formatter } from '../../utils/numbers';

const Balance = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const couple = useCoupleStore((state) => state.couple);
  const [loading, setLoading] = useState(false);

  const deposit = async () => {
    enqueueSnackbar('Coming soon!', { variant: 'info' });
  };

  const withdraw = async () => {
    enqueueSnackbar('Coming soon!', { variant: 'info' });
  };

  return (
    <Main>
      <Box
        height="100%"
        p={2}
        bgcolor="white"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box flex={1} py={1} display="flex" flexDirection="column" gap={2}>
          <Box
            height="100px"
            borderRadius={2}
            border="1px solid lightgrey"
            bgcolor="white"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Typography fontSize={20} fontWeight={700}>
              {couple?.balance?.toLocaleString()}
            </Typography>
            <img src="/icons/gold.png" alt="gold" width={32} />
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleOutlineRoundedIcon />}
            sx={{
              flex: 1,
              height: 60,
              boxShadow: 'none',
              bgcolor: '#fa5f60',
              '&:active': {
                boxShadow: 'none',
                bgcolor: '#fa5f60',
              },
              '&:hover': {
                boxShadow: 'none',
                bgcolor: '#fa5f60',
              },
            }}
            disabled={loading}
            onClick={deposit}
          >
            Deposit
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AttachMoneyRoundedIcon />}
            sx={{
              flex: 1,
              height: 60,
              boxShadow: 'none',
              bgcolor: '#2ecc71',
              '&:active': {
                boxShadow: 'none',
                bgcolor: '#2ecc71',
              },
              '&:hover': {
                boxShadow: 'none',
                bgcolor: '#2ecc71',
              },
            }}
            disabled={loading}
            onClick={withdraw}
          >
            Withdraw
          </Button>
        </Box>
      </Box>
    </Main>
  );
};

export default Balance;
