import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip } from '@mui/material';

const tabs = [
  { text: 'Timeline', path: '/home/timeline' },
  { text: 'Notes', path: '/home/notes' },
  { text: 'Todos', path: '/home/todos' },
];

const Tabs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Box p={2} bgcolor="#fff" display="flex" alignItems="center" gap={2}>
      {tabs.map((tab) => (
        <Chip
          key={tab.text}
          label={tab.text}
          variant={tab.path === pathname ? 'filled' : 'outlined'}
          onClick={() => {
            pathname !== tab.path && navigate(tab.path);
          }}
          sx={
            tab.path === pathname ? { bgcolor: '#fa5f60', color: 'white' } : {}
          }
        />
      ))}
    </Box>
  );
};

export default Tabs;
