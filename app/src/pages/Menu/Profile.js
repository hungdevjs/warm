import { useState, useEffect, useId, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';

import Main from './components/Main';
import FileInput from '../../components/FileInput';
import useUserStore from '../../stores/user.store';
import useCoupleStore from '../../stores/couple.store';
import { uploadFile, updateUser } from '../../services/firebase.service';

const MAX_FILE_SIZE = 5242880;

const Profile = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((state) => state.user);
  const couple = useCoupleStore((state) => state.couple);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputId = useId();
  const labelRef = useRef();

  const updateData = (values) => {
    setData({ ...(data || {}), ...values });
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE) throw new Error('Max file size is 5MB');
    setFile(file);
  };

  const avatarURL = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return data?.avatarURL || '/images/default-avatar.jpeg';
  }, [data, file]);

  const update = async () => {
    if (loading || !data || !data?.username || !data?.username.trim()) return;
    setLoading(true);

    try {
      if (file) {
        const { url } = await uploadFile({
          storagePath: `/couples/${couple.id}/${user.id}/avatar`,
          file,
        });
        data.avatarURL = url;
      }

      console.log({ data });

      await updateUser(data);
      enqueueSnackbar('Updated profile', { variant: 'success' });
      navigate('/menu');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setData({
        email: user.email,
        username: user.username,
        gender: user.gender,
        avatarURL: user.avatarURL,
      });
    }
  }, [user]);

  return (
    <Main>
      <FileInput
        ref={labelRef}
        inputId={inputId}
        onChange={onFileChange}
        accept="image/*"
      />
      <Box
        height="100%"
        p={2}
        bgcolor="white"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box flex={1} py={1} display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography color="#0009">Avatar</Typography>
            <Box display="flex" gap={2}>
              <Box
                borderRadius={2}
                overflow="hidden"
                width="200px"
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
                <img src={avatarURL} alt="avatar" />
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<UploadRoundedIcon />}
                  sx={{
                    boxShadow: 'none',
                    bgcolor: '#2ecc71',
                    '&:active': {
                      boxShadow: 'none',
                      bgcolor: '#2ecc71',
                    },
                    '&:hover': {
                      boxShadow: 'none',
                      bgcolor: '#2ecc71',
                    },
                  }}
                  disabled={loading}
                  onClick={() => labelRef.current?.click()}
                >
                  Change
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteRoundedIcon />}
                  sx={{
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
                  disabled={loading}
                  onClick={() => {
                    setFile(null);
                    updateData({ avatarURL: null });
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          </Box>
          <TextField
            key={couple?.id}
            fullWidth
            variant="outlined"
            label="Email"
            value={data?.email}
            disabled
          />
          <TextField
            key={couple?.id}
            fullWidth
            variant="outlined"
            label="Username"
            value={data?.username}
            onChange={(e) => updateData({ username: e.target.value })}
            disabled={loading}
          />
          <Box>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Gender
              </FormLabel>
              <RadioGroup
                key={data?.gender}
                row
                value={data?.gender}
                onChange={(e) => updateData({ gender: e.target.value })}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<SaveRoundedIcon />}
            sx={{
              height: 60,
              boxShadow: 'none',
              bgcolor: '#2ecc71',
              '&:active': {
                boxShadow: 'none',
                bgcolor: '#2ecc71',
              },
              '&:hover': {
                boxShadow: 'none',
                bgcolor: '#2ecc71',
              },
            }}
            disabled={
              loading || !data || !data.username || !data.username.trim()
            }
            onClick={update}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    </Main>
  );
};

export default Profile;
