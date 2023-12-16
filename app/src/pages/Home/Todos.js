import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Masonry from '@mui/lab/Masonry';

import Main from './components/Main';
import useTodoList from '../../hooks/useTodoList';
import moment from 'moment';

const Todos = () => {
  const navigate = useNavigate();
  const { todos } = useTodoList();

  return (
    <Main>
      <Box
        height="100%"
        overflow="auto"
        position="relative"
        display="flex"
        flexDirection="column"
        gap={0.75}
      >
        <Box
          position="fixed"
          right={16}
          bottom={90}
          width="60px"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#fa5f60"
          sx={{ aspectRatio: '1/1' }}
        >
          <IconButton onClick={() => navigate('/home/todos/new')}>
            <AddRoundedIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
        <Box p={1} display="flex" justifyContent="center">
          <Masonry columns={1} spacing={2}>
            {todos.map((todo) => (
              <Box
                key={todo.id}
                p={2}
                bgcolor="white"
                borderRadius={2}
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/home/todos/${todo.id}`)}
              >
                <Box>
                  <Typography fontSize={12} color={todo.textColor}>
                    {moment(todo.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                  <Typography
                    fontSize={18}
                    fontWeight={700}
                    color={todo.textColor}
                  >
                    {todo.title}
                  </Typography>
                  <Typography fontSize={12} color={todo.textColor}>
                    by {todo.creator.username}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Masonry>
        </Box>
      </Box>
    </Main>
  );
};

export default Todos;
