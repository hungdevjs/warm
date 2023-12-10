import { Box, Typography } from '@mui/material';

const SplashScreen = () => {
  return (
    <Box
      height="100vh"
      width="100vw"
      bgcolor="#fa5f60"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
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
    </Box>
  );
};

export default SplashScreen;
