import { Box, TextField, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Header = () => {
  return (
    <Box
      height="80px"
      p={2}
      display="flex"
      alignItems="center"
      gap={2}
      bgcolor="#fa5f60"
    >
      <img src="/logo-white-192.png" width={48} alt="logo" />
      <Box flex={1}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          color="error"
          placeholder="Search..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchRoundedIcon sx={{ color: '#f8f8f8' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 6, color: 'white', borderColor: 'white' },
          }}
          sx={{
            '& label.Mui-focused': {
              color: 'white',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
                borderWidth: '1px',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Header;
