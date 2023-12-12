import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip, Typography } from '@mui/material';

import useCoupleStore from '../../../stores/couple.store';

const tabs = [
  { text: 'Timeline', path: '/home/timeline' },
  { text: 'Notes', path: '/home/notes' },
  { text: 'Todos', path: '/home/todos' },
];

export const formatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 3,
});

const Tabs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const couple = useCoupleStore((state) => state.couple);

  return (
    <Box p={2} bgcolor="#fff" display="flex" alignItems="center" gap={2}>
      <Box
        py={0.5}
        px={2}
        border="1px solid lightgrey"
        borderRadius={4}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Typography fontSize={18} fontWeight={800}>
          {formatter.format(couple?.balance)}
        </Typography>
        <img src="/icons/gold.png" alt="gold" width={24} />
      </Box>
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
