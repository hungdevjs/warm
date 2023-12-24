import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, alpha } from '@mui/material';

import useNotificationStore from '../stores/notification.store';

const BottomNavs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasNewNotifications = useNotificationStore(
    (state) => state.hasNewNotifications
  );
  const setHasNewNotifications = useNotificationStore(
    (state) => state.setHasNewNotifications
  );

  const isActive = (path) => path === pathname || pathname.includes(path);

  const navs = [
    { text: 'Games', path: '/games', icon: '/icons/game.png' },
    { text: 'Chat', path: '/chat', icon: '/icons/message.png' },
    { text: 'Home', path: '/home', icon: '/icons/home.png' },
    {
      text: 'Notifications',
      path: '/notifications',
      icon: '/icons/notification.png',
      isNotice: hasNewNotifications,
      onClick: () => setHasNewNotifications(false),
    },
    { text: 'Menu', path: '/menu', icon: '/icons/menu.png' },
  ];

  return (
    <Box
      height="80px"
      display="flex"
      justifyContent="space-between"
      p={1}
      bgcolor="#fa5f60"
    >
      {navs.map((nav) => (
        <Box
          key={nav.text}
          position="relative"
          width="20%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
          px={2}
          py={0.5}
          borderRadius={2}
          bgcolor={isActive(nav.path) ? alpha('#fff', 0.1) : 'transparent'}
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            if (nav.path !== pathname) {
              navigate(nav.path);
            }

            nav.onClick?.();
          }}
        >
          {nav.isNotice && (
            <Box
              position="absolute"
              top="25%"
              left="56%"
              bgcolor="#e74c3c"
              width="10px"
              borderRadius="50%"
              sx={{ aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
            />
          )}
          <img src={nav.icon} alt="icon" width={24} />
          <Typography
            fontSize={10}
            fontWeight={600}
            color={isActive(nav.path) ? 'white' : 'lightgrey'}
            align="center"
          >
            {nav.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BottomNavs;
