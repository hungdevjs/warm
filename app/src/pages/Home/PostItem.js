import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import moment from 'moment';
import parse from 'html-react-parser';

import useUserStore from '../../stores/user.store';

const PostItem = ({ post, togglePinned }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  return (
    <Box
      key={post.id}
      bgcolor="#fff"
      p={2}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
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
          <img src={post.creator.avatarURL} alt="avatar" />
        </Box>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography fontWeight={600}>{post.creator.username}</Typography>
          </Box>
          <Typography fontSize={12}>
            {moment(post.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Box>
        {post.creatorId === user.id ? (
          <IconButton
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => togglePinned(post.id, !post.isPinned)}
          >
            {post.isPinned ? (
              <PushPinIcon sx={{ color: '#fa5f60' }} />
            ) : (
              <PushPinOutlinedIcon />
            )}
          </IconButton>
        ) : post.isPinned ? (
          <IconButton sx={{ alignSelf: 'flex-start' }} disabled>
            <PushPinIcon sx={{ color: '#fa5f60' }} />
          </IconButton>
        ) : null}
      </Box>
      <Box onClick={() => navigate(`/home/posts/${post.id}`)}>
        {parse(post.text)}
      </Box>
      <Box>
        <Typography
          color="grey"
          sx={{
            curor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
          onClick={() => navigate(`/home/posts/${post.id}`)}
        >
          {post.numberOfComments} comments
        </Typography>
      </Box>
    </Box>
  );
};

export default PostItem;
