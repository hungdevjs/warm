import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Checkbox,
  alpha,
} from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { v4 } from 'uuid';

import useUserStore from '../../stores/user.store';
import {
  createTodo,
  updateTodo,
  removeTodo,
} from '../../services/firebase.service';
import useTodo from '../../hooks/useTodo';
import Loading from '../../components/Loading';

const TodoDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { todo } = useTodo(id);
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);

  const canEdit = !id || todo?.creatorId === user.id;

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setItems(todo.items);
    }
  }, [todo]);

  const updateItem = (id, values) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        return { ...item, ...values };
      })
    );
  };

  const submit = async () => {
    if (loading || !title || !title.trim() || !items || !items.length) return;

    const submitFunction = !!id ? updateTodo : createTodo;
    setLoading(true);
    try {
      const data = {
        id: todo?.id,
        title,
        items,
      };
      await submitFunction(data);
      navigate('/home/todos');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  const remove = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await removeTodo({ id });
      navigate('/home/todos');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setLoading(false);
  };

  if (!!id && !todo) return <Loading loading />;

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
        <IconButton onClick={() => navigate('/home/todos')}>
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
            {!!id ? 'View todo' : 'Create todo'}
          </Typography>
        </Box>
        {canEdit && (
          <Box>
            <IconButton onClick={submit}>
              <Typography
                fontWeight={600}
                color={
                  !!title.trim() && !!items?.length && !loading
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
            ) : todo ? (
              <img src={todo.creator?.avatarURL} alt="avatar" />
            ) : null}
          </Box>
          <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
            <Typography fontWeight={600}>
              {!!id ? todo?.creator?.username : user.username}
            </Typography>
          </Box>
          {!!id && canEdit && (
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<DeleteRoundedIcon sx={{ color: 'white' }} />}
              onClick={remove}
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
            >
              Remove
            </Button>
          )}
        </Box>
        {canEdit && (
          <Box
            p={2}
            borderRadius={2}
            bgcolor="white"
            flex={1}
            display="flex"
            flexDirection="column"
            gap={1}
          >
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
                },
              }}
            >
              <input
                placeholder="Todos title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading || !canEdit}
              />
            </Box>
            <Box
              flex={1}
              sx={{
                '& input': {
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  bgcolor: 'transparent',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 16,
                },
              }}
            >
              {items.map((item) => (
                <Box key={item.id} display="flex" alignItems="center">
                  <Checkbox
                    checked={item.isCompleted}
                    onChange={(e) =>
                      updateItem(item.id, { isCompleted: e.target.checked })
                    }
                  />
                  <input
                    placeholder="Todo text"
                    value={item.text}
                    onChange={(e) =>
                      updateItem(item.id, { text: e.target.value })
                    }
                  />
                </Box>
              ))}
              <Box
                mt={2}
                py={1}
                borderRadius={2}
                border="1px dashed lightgrey"
                onClick={() =>
                  setItems([
                    ...items,
                    { id: v4(), text: '', isCompleted: false },
                  ])
                }
              >
                <Typography align="center">Add todo item</Typography>
              </Box>
            </Box>
          </Box>
        )}
        {!canEdit && !!todo && (
          <Box
            p={2}
            bgcolor={todo.color}
            borderRadius={2}
            display="flex"
            flexDirection="column"
            gap={1}
          >
            <Box>
              <Typography fontSize={12}>
                {moment(todo.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
              </Typography>
              <Typography fontSize={18} fontWeight={700}>
                {todo.title}
              </Typography>
              <Typography fontSize={12}>by {todo.creator.username}</Typography>
            </Box>
            <Box
              p={2}
              borderRadius={2}
              bgcolor="white"
              flex={1}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Box
                flex={1}
                sx={{
                  '& input': {
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    bgcolor: 'transparent',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 16,
                  },
                }}
              >
                {items.map((item) => (
                  <Box key={item.id} display="flex" alignItems="center">
                    <Checkbox checked={item.isCompleted} />
                    <Typography>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TodoDetail;
