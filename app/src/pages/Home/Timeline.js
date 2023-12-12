import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import moment from 'moment';
import parse from 'html-react-parser';

import Main from './components/Main';
import useUserStore from '../../stores/user.store';
import useCoupleStore from '../../stores/couple.store';
import useTimeline from '../../hooks/useTimeline';

const Timeline = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const couple = useCoupleStore((state) => state.couple);
  const { posts } = useTimeline();

  if (!couple) return null;

  return (
    <Main>
      <Box display="flex" flexDirection="column" gap={0.75}>
        <Box bgcolor="#fff" p={2} display="flex" alignItems="center" gap={2}>
          <Box
            width="60px"
            borderRadius="50%"
            overflow="hidden"
            sx={{
              aspectRatio: '1/1',
              '& img': {
                display: 'block',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              },
            }}
          >
            <img src={user.avatarURL} alt="avatar" />
          </Box>
          <Box flex={1} onClick={() => navigate('/home/posts')}>
            <Typography fontSize="18px" color="#555">
              How do you feel today?
            </Typography>
          </Box>
          <IconButton>
            <ImageIcon
              sx={{ cursor: 'pointer', fontSize: '32px', color: '#fa5f60' }}
            />
          </IconButton>
        </Box>
        {posts.map((post) => (
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
                    objectFit: 'cover',
                    objectPosition: 'center',
                  },
                }}
              >
                <img src={post.creator.avatarURL} alt="avatar" />
              </Box>
              <Box flex={1}>
                <Typography fontWeight={600}>
                  {post.creator.username}
                </Typography>
                <Typography fontSize={12}>
                  {moment(post.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
                </Typography>
              </Box>
              <IconButton sx={{ alignSelf: 'flex-start' }}>
                <MoreHorizRoundedIcon />
              </IconButton>
            </Box>
            <Box>{parse(post.text)}</Box>
            <Box>
              <Typography
                color="grey"
                sx={{
                  curor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
                onClick={() => navigate(`/home/posts/${post.id}/comments`)}
              >
                {post.numberOfComments} comments
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Main>
  );
};

export default Timeline;
