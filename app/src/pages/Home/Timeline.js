import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, alpha } from '@mui/material';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import ImageIcon from '@mui/icons-material/Image';
import moment from 'moment';
import { useSnackbar } from 'notistack';

import Main from './components/Main';
import PostItem from './PostItem';
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
        <Box
          sx={{
            aspectRatio: '5/2',
            backgroundImage: `url(${couple.coverURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            width="100%"
            height="100%"
            bgcolor={alpha('#000', 0.3)}
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems="center"
            justifyContent="center"
          >
            <Box>
              <Typography
                fontSize={18}
                fontWeight={600}
                color="white"
                align="center"
              >
                {couple.name}
              </Typography>
              <Typography
                fontSize={24}
                fontWeight={700}
                color="white"
                align="center"
              >
                {moment().diff(moment(couple.startDate.toDate()), 'days') + 1}{' '}
                days together
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              {Object.values(couple.users).map((user) => (
                <Box
                  key={user.id}
                  position="relative"
                  width={60}
                  borderRadius="50%"
                  overflow="hidden"
                  sx={{
                    aspectRatio: '1/1',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    },
                  }}
                >
                  <img src={user.avatarURL} alt="avatar" />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
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
              How do you feel today?
            </Typography>
          </Box>
          {/* TODO: implement upload image later */}
          {/* <IconButton>
            <ImageIcon
              sx={{ cursor: 'pointer', fontSize: '32px', color: '#fa5f60' }}
            />
          </IconButton> */}
        </Box>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} togglePinned={togglePinned} />
        ))}
      </Box>
    </Main>
  );
};

export default Timeline;
