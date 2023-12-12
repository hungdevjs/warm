import { Box, Typography, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Header = () => {
  return (
    <Box
      height="60px"
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      bgcolor="#fa5f60"
    >
      <Box display="flex" alignItems="center" gap={1}>
        <img src="/logo-white-192.png" width={32} alt="logo" />
        <Typography
          fontSize={20}
          fontFamily="'Sigmar One', sans-serif"
          color="white"
          align="center"
        >
          Warm
        </Typography>
      </Box>
      <Box>
        <IconButton>
          <SearchRoundedIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
