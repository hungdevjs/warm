import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box
      height={60}
      p={2}
      bgcolor="#fa5f60"
      display="flex"
      // justifyContent="center"
      alignItems="center"
      gap={1}
    >
      <img src="/logo-white-192.png" alt="logo" width="32" />
      <Typography fontFamily="'Sigmar One', sans-serif" color="white">
        Warm
      </Typography>
    </Box>
  );
};

export default Header;
