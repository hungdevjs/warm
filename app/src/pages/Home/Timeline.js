import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import moment from 'moment';
import parse from 'html-react-parser';
import { useSnackbar } from 'notistack';

import Main from './components/Main';
import useUserStore from '../../stores/user.store';
import useCoupleStore from '../../stores/couple.store';
import useTimeline from '../../hooks/useTimeline';
import { togglePinnedStatus } from '../../services/firebase.service';

const Timeline = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((state) => state.user);
  const couple = useCoupleStore((state) => state.couple);
  const { posts } = useTimeline();
  const [loadingIds, setLoadingIds] = useState([]);

  const togglePinned = async (postId, isPinned) => {
    if (loadingIds.includes(postId)) return;
    setLoadingIds((prev) => [...prev, postId]);
    try {
      await togglePinnedStatus({ postId, isPinned });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoadingIds((prev) => prev.filter((item) => item !== postId));
  };

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
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              },
            }}
          >
            <img src={user.avatarURL} alt="avatar" />
          </Box>
          <Box flex={1} onClick={() => navigate('/home/posts')}>
            <Typography fontSize={14} color="#888">
              Today is{' '}
              {moment().diff(moment(couple.startDate.toDate()), 'days')} days
              since your first day. How do you feel?
            </Typography>
          </Box>
          {/* TODO: implement upload image later */}
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
                  <Typography fontWeight={600}>
                    {post.creator.username}
                  </Typography>
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
        ))}
      </Box>
    </Main>
  );
};

export default Timeline;
