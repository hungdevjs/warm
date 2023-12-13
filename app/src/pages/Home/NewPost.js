import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, alpha } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useSnackbar } from 'notistack';

import useUserStore from '../../stores/user.store';
import { createNewPost } from '../../services/firebase.service';

const NewPost = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [imageURLs, setImageURLs] = useState([]);
  const [isPinned, setIsPinned] = useState(false);

  const create = async () => {
    if (loading || !text || !text.trim()) return;
    setLoading(true);
    try {
      const data = {
        text: text.replaceAll('\n', '<br />'),
        imageURLs,
        isPinned,
      };
      await createNewPost(data);
      navigate('/home/timeline');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box height="100%" bgcolor="white" display="flex" flexDirection="column">
      <Box
        p={2}
        display="flex"
        alignItems="center"
        bgcolor="white"
        sx={{ borderBottom: '1px solid #f2f2f2' }}
      >
        <IconButton onClick={() => navigate('/home/timeline')}>
          <CloseRoundedIcon sx={{ color: 'black' }} />
        </IconButton>
        <Box ml={2} flex={1} display="flex" justifyContent="center">
          <Typography fontSize="18px" fontWeight={700} color="black">
            Create post
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={create}>
            <Typography
              fontWeight={600}
              color={
                !!text.trim() && !loading ? '#fa5f60' : alpha('#fa5f60', 0.4)
              }
            >
              Post
            </Typography>
          </IconButton>
        </Box>
      </Box>
      <Box flex={1} p={2} display="flex" flexDirection="column" gap={2}>
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
            <img src={user.avatarURL} alt="avatar" />
          </Box>
          <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
            <Typography fontWeight={600}>{user.username}</Typography>
          </Box>
          <IconButton onClick={() => !loading && setIsPinned(!isPinned)}>
            {isPinned ? (
              <PushPinIcon sx={{ color: '#fa5f60' }} />
            ) : (
              <PushPinOutlinedIcon />
            )}
          </IconButton>
        </Box>
        <Box
          flex={1}
          sx={{
            '& textarea': {
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 16,
              fontWeight: 500,
            },
          }}
        >
          <textarea
            placeholder="How do you feel today?"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            disabled={loading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NewPost;
