import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import moment from 'moment';
import parse from 'html-react-parser';
import { useSnackbar } from 'notistack';

import usePost from '../../hooks/usePost';
import {
  createComment,
  togglePinnedStatus,
} from '../../services/firebase.service';

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { post, setPost, comments } = usePost(id);
  const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  const sendComment = async () => {
    if (loading || !text || !text.trim()) return;
    setLoading(true);
    try {
      const data = { text, imageURL, postId: id };
      setText('');
      await createComment(data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  const togglePinned = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await togglePinnedStatus({ postId: post.id });
      setPost({ ...post, isPinned: !post.isPinned });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  if (!post) return null;

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box
        p={2}
        display="flex"
        alignItems="center"
        bgcolor="white"
        sx={{ borderBottom: '1px solid #f2f2f2' }}
      >
        <IconButton onClick={() => navigate('/home/timeline')}>
          <ArrowBackIosRoundedIcon sx={{ color: 'black' }} />
        </IconButton>
      </Box>
      <Box flex={1} overflow="auto" display="flex" flexDirection="column">
        <Box bgcolor="#fff" p={2} display="flex" flexDirection="column" gap={2}>
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
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography fontWeight={600}>
                  {post.creator.username}
                </Typography>
              </Box>
              <Typography fontSize={12}>
                {moment(post.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Box>
            <IconButton
              sx={{ alignSelf: 'flex-start' }}
              onClick={() => togglePinned(post.id)}
            >
              {post.isPinned ? (
                <PushPinIcon sx={{ color: '#fa5f60' }} />
              ) : (
                <PushPinOutlinedIcon />
              )}
            </IconButton>
          </Box>
          <Box>{parse(post.text)}</Box>
        </Box>
        <Box py={2} display="flex" flexDirection="column" gap={1}>
          {comments.map((comment) => (
            <Box
              key={comment.id}
              px={2}
              display="flex"
              alignItems="center"
              gap={2}
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
                    objectFit: 'cover',
                    objectPosition: 'center',
                  },
                }}
              >
                <img src={comment.creator.avatarURL} alt="avatar" />
              </Box>
              <Box flex={1} bgcolor="white" py={1} px={2} borderRadius={2}>
                <Typography fontSize={12}>
                  {moment(comment.createdAt.toDate()).format(
                    'DD/MM/YYYY HH:mm'
                  )}
                </Typography>
                <Box>
                  <Typography fontWeight={600}>
                    {comment.creator.username}
                  </Typography>
                </Box>
                <Typography>{parse(comment.text)}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box p={2}>
        <TextField
          fullWidth
          variant="outlined"
          color="error"
          placeholder="Comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendComment()}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => !loading && sendComment()}>
                  <SendRoundedIcon
                    sx={{
                      color: !!text.trim() && !loading ? '#fa5f60' : '#888',
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2, color: '#888' },
          }}
          sx={{
            '& label.Mui-focused': {
              color: '#888',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#888',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#888',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#888',
                borderWidth: '1px',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Post;
