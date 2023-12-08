import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { signInWithGoogle } from '../../services/firebase.service';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const login = async () => {
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      if (!err.message.includes('popup-closed-by-user')) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }

    setLoading(false);
  };
  return (
    <Box
      height="100vh"
      width="100vw"
      p={2}
      bgcolor="#fa5f60"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={4}
      >
        <Typography fontSize={28} color="white" align="center">
          Do fun things. Together.
        </Typography>
        <Box>
          <Box display="flex" justifyContent="center">
            <img src="/logo-white-192.png" alt="logo" width={92} />
          </Box>
          <Typography
            fontSize={48}
            fontFamily="'Sigmar One', sans-serif"
            color="white"
            align="center"
          >
            Warm
          </Typography>
        </Box>
      </Box>
      <Box width="100%">
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<img src="/icons/google.png" alt="google" width={32} />}
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
          onClick={login}
        >
          Login with Google
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
