import { Box, IconButton, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Masonry from '@mui/lab/Masonry';
import parse from 'html-react-parser';

import Main from './components/Main';
import useNote from '../../hooks/useNote';
import moment from 'moment';

const Notes = () => {
  const { notes } = useNote();

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
          <IconButton>
            <AddRoundedIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
        <Box p={1} display="flex" justifyContent="center">
          <Masonry columns={2} spacing={2}>
            {notes.map((note) => (
              <Box
                key={note.id}
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
                  <Typography
                    fontSize={18}
                    fontWeight={700}
                    color={note.textColor}
                  >
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
            ))}
          </Masonry>
        </Box>
      </Box>
    </Main>
  );
};

export default Notes;
