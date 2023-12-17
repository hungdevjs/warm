import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import useUserStore from '../../stores/user.store';
import useCoupleStore from '../../stores/couple.store';
import { logOut } from '../../services/firebase.service';

const items = [
  {
    text: 'Balance',
    icon: '/icons/gold.png',
    path: '/menu/balance',
    color: '#2ecc71',
    textColor: 'white',
  },
  {
    text: 'Pricing plan',
    icon: '/icons/pricing-plan.png',
    path: '/menu/pricing-plan',
    color: '#f39c12',
    textColor: 'white',
  },
  {
    text: 'Storage',
    icon: '/icons/storage.png',
    path: '/menu/storage',
    color: '#16a085',
    textColor: 'white',
  },
  {
    text: 'Settings',
    icon: '/icons/settings.png',
    path: '/menu/settings',
    color: '#34495e',
    textColor: 'white',
  },
];

const Menu = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const couple = useCoupleStore((state) => state.couple);

  return (
    <Box height="100%" p={2} display="flex" flexDirection="column" gap={2}>
      <Box
        p={2}
        bgcolor="#fa5f60"
        borderRadius={2}
        display="flex"
        alignItems="center"
        gap={2}
        onClick={() => navigate('/menu/profile')}
      >
        <Box
          width="60px"
          borderRadius="50%"
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
          <img src={user.avatarURL} alt="avatar" />
        </Box>
        <Typography fontWeight={600} color="white">
          {user.username}
        </Typography>
      </Box>
      <Box
        p={2}
        bgcolor="#3498db"
        borderRadius={2}
        display="flex"
        alignItems="center"
        gap={2}
        onClick={() => navigate('/menu/couple')}
      >
        <img src="/icons/hearts.png" alt="heart" width={60} />
        <Typography fontWeight={600} color="white" align="center">
          {couple?.name}
        </Typography>
      </Box>
      <Box flex={1}>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={6}>
              <Box
                p={2}
                borderRadius={2}
                bgcolor={item.color}
                display="flex"
                flexDirection="column"
                gap={1}
                onClick={() => navigate(item.path)}
              >
                <img src={item.icon} alt="icon" width={40} />
                <Typography fontWeight={600} color={item.textColor}>
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutRoundedIcon />}
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
          onClick={logOut}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Menu;
