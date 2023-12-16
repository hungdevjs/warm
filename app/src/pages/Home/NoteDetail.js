import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, Typography, alpha } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import parse from 'html-react-parser';

import useUserStore from '../../stores/user.store';
import {
  createNewNote,
  updateNote,
  removeNote,
} from '../../services/firebase.service';
import useNote from '../../hooks/useNote';
import Loading from '../../components/Loading';

const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#ecf0f1'];

const textColors = ['#000000', '#ffffff'];

const NoteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { note } = useNote(id);
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [textColor, setTextColor] = useState(textColors[0]);
  const [imageURLs, setImageURLs] = useState([]);

  const canEdit = !id || note?.creatorId === user.id;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content.replaceAll('<br />', '\n'));
      setColor(note.color);
      setTextColor(note.textColor);
      setImageURLs(note.imageURLs);
    }
  }, [note]);

  const submit = async () => {
    if (loading || !title || !title.trim() || !content || !content.trim())
      return;

    const submitFunction = !!id ? updateNote : createNewNote;
    setLoading(true);
    try {
      const data = {
        id: note?.id,
        title,
        content: content.replaceAll('\n', '<br />'),
        imageURLs,
        color,
        textColor,
      };
      await submitFunction(data);
      navigate('/home/notes');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  const remove = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await removeNote({ id });
      navigate('/home/notes');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  if (!!id && !note) return <Loading loading />;

  return (
    <Box height="100%" bgcolor="white" display="flex" flexDirection="column">
      <Loading loading={loading} />
      <Box
        p={2}
        position="relative"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="white"
        sx={{ borderBottom: '1px solid #f2f2f2' }}
      >
        <IconButton onClick={() => navigate('/home/notes')}>
          {!!id ? (
            <ArrowBackIosRoundedIcon sx={{ color: 'black' }} />
          ) : (
            <CloseRoundedIcon sx={{ color: 'black' }} />
          )}
        </IconButton>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          display="flex"
          justifyContent="center"
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography fontSize="18px" fontWeight={700} color="black">
            {!!id ? 'View note' : 'Create note'}
          </Typography>
        </Box>
        {canEdit && (
          <Box>
            <IconButton onClick={submit}>
              <Typography
                fontWeight={600}
                color={
                  !!title.trim() && !!content.trim() && !loading
                    ? '#fa5f60'
                    : alpha('#fa5f60', 0.4)
                }
              >
                {!!id ? 'Update' : 'Add'}
              </Typography>
            </IconButton>
          </Box>
        )}
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
            {!id ? (
              <img src={user.avatarURL} alt="avatar" />
            ) : note ? (
              <img src={note.creator?.avatarURL} alt="avatar" />
            ) : null}
          </Box>
          <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
            <Typography fontWeight={600}>
              {!!id ? note?.creator?.username : user.username}
            </Typography>
          </Box>
        </Box>
        {canEdit && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Box>
              <Typography fontWeight={600}>Note color</Typography>
              <Box display="flex" gap={2}>
                {colors.map((c) => (
                  <Box
                    key={c}
                    width="30px"
                    borderRadius="50%"
                    border="1px solid lightgrey"
                    bgcolor={c}
                    sx={{ aspectRatio: '1/1', cursor: 'pointer' }}
                    onClick={() => !loading && setColor(c)}
                  />
                ))}
              </Box>
            </Box>
            <Box>
              <Typography fontWeight={600}>Text color</Typography>
              <Box display="flex" gap={2}>
                {textColors.map((c) => (
                  <Box
                    key={c}
                    width="30px"
                    borderRadius="50%"
                    border="1px solid lightgrey"
                    bgcolor={c}
                    sx={{ aspectRatio: '1/1', cursor: 'pointer' }}
                    onClick={() => !loading && setTextColor(c)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}
        {canEdit && (
          <Box
            position="relative"
            p={2}
            borderRadius={2}
            bgcolor={color}
            flex={1}
            display="flex"
            flexDirection="column"
            gap={1}
          >
            {!!id && canEdit && (
              <Box position="absolute" top={8} right={8}>
                <IconButton onClick={remove}>
                  <DeleteRoundedIcon sx={{ color: 'tomato' }} />
                </IconButton>
              </Box>
            )}
            <Box
              sx={{
                '& input': {
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  bgcolor: 'transparent',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: textColor,
                },
              }}
            >
              <input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading || !canEdit}
              />
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
                  color: textColor,
                },
              }}
            >
              <textarea
                placeholder="Note content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                disabled={loading || !canEdit}
              />
            </Box>
          </Box>
        )}
        {!canEdit && !!note && (
          <Box
            p={2}
            bgcolor={note.color}
            borderRadius={2}
            display="flex"
            flexDirection="column"
            gap={1}
          >
            <Box>
              <Typography fontSize={12} color={note.textColor}>
                {moment(note.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
              </Typography>
              <Typography fontSize={18} fontWeight={700} color={note.textColor}>
                {note.title}
              </Typography>
              <Typography fontSize={12} color={note.textColor}>
                by {note.creator.username}
              </Typography>
            </Box>
            <Typography fontSize={14} color={note.textColor}>
              {parse(note.content)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NoteDetail;
