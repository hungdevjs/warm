import { useNavigate } from 'react-router-dom';
import { Box, Typography, alpha } from '@mui/material';
import moment from 'moment';

import { NotificationTypes } from '../../utils/notifications';
import { readNotification } from '../../services/firebase.service';
import useNotificationStore from '../../stores/notification.store';

const Notification = () => {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);

  const onNavigate = (notification) => {
    let path;
    switch (notification.metadata.type) {
      case NotificationTypes.CreateNewPost:
        path = `/home/posts/${notification.metadata.postId}`;
        break;
      case NotificationTypes.CreateNewNote:
        path = `/home/posts/${notification.metadata.noteId}`;
        break;
      case NotificationTypes.CreateNewTodo:
        path = `/home/posts/${notification.metadata.todoId}`;
        break;
      case NotificationTypes.NewPostComment:
        path = `/home/posts/${notification.metadata.postId}`;
        break;
      case NotificationTypes.NewMessage:
        path = `/chat`;
        break;
      default:
        break;
    }
    navigate(path);
    readNotification({ id: notification.id });
  };

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={0.75}>
      <Box p={2} bgcolor="white" display="flex" justifyContent="center" gap={2}>
        <Typography fontWeight={600}>Notifications</Typography>
      </Box>
      <Box
        flex={1}
        overflow="auto"
        display="flex"
        flexDirection="column"
        gap={0.5}
        py={1}
        sx={{
          MsOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            px={2}
            py={1}
            display="flex"
            flexDirection="column"
            bgcolor={notification.isRead ? 'white' : alpha('#3498db', 0.1)}
            sx={{ cursor: 'pointer' }}
            onClick={() => onNavigate(notification)}
          >
            <Typography fontSize={12}>
              {moment(notification.createdAt.toDate()).format(
                'DD/MM/YYYY HH:mm'
              )}
            </Typography>
            <Typography fontWeight={500}>{notification.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Notification;
