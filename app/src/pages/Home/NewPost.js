import { useState, useId, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, IconButton, Typography, alpha } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import ImageIcon from '@mui/icons-material/Image';
import { useSnackbar } from 'notistack';
import { v4 } from 'uuid';

import useUserStore from '../../stores/user.store';
import useCoupleStore from '../../stores/couple.store';
import { createNewPost, uploadFile } from '../../services/firebase.service';
import Loading from '../../components/Loading';
import FileInput from '../../components/FileInput';

const MAX_FILE_SIZE = 5242880;

const NewPost = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((state) => state.user);
  const couple = useCoupleStore((state) => state.couple);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [files, setFiles] = useState([]);
  const inputId = useId();
  const labelRef = useRef();

  const onFileChange = (e) => {
    try {
      for (const file of e.target.files) {
        if (file.size > MAX_FILE_SIZE) throw new Error('Max file size is 5MB');
      }
      setFiles(
        [...e.target.files].map((item) => ({
          id: v4(),
          file: item,
        }))
      );
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const create = async () => {
    if (loading || !text || !text.trim()) return;
    setLoading(true);
    try {
      let images = [];
      if (!!files.length) {
        images = await Promise.all(
          files.map((item) =>
            uploadFile({
              storagePath: `/couples/${couple.id}/posts/${item.id}`,
              file: item.file,
            })
          )
        );
      }
      const data = {
        text: text.replaceAll('\n', '<br />'),
        images,
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
    <Box minHeight="100%" bgcolor="white" display="flex" flexDirection="column">
      <FileInput
        ref={labelRef}
        inputId={inputId}
        onChange={onFileChange}
        accept="image/*"
        multiple
      />
      <Loading loading={loading} />
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
                height: '100%',
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
          display="flex"
          sx={{
            '& textarea': {
              width: '100%',
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
        {!!files.length && (
          <Box>
            <Grid container spacing={1}>
              {files.map((item) => (
                <Grid key={item.id} item xs={6}>
                  <Box
                    width="100%"
                    borderRadius={2}
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
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt="attachments"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => labelRef.current?.click()}>
            <ImageIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NewPost;
