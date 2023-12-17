import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import useCoupleStore from '../../../stores/couple.store';
import { formatter } from '../../../utils/numbers';

const tabs = [
  { text: 'Timeline', path: '/home/timeline' },
  { text: 'Notes', path: '/home/notes' },
  { text: 'Todos', path: '/home/todos' },
];

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
        <Box
          key={tab.text}
          px={1}
          py={0.75}
          border="1px solid #ddd"
          borderRadius={6}
          bgcolor={tab.path === pathname ? '#fa5f60' : 'white'}
          onClick={() => {
            pathname !== tab.path && navigate(tab.path);
          }}
        >
          <Typography
            fontWeight={500}
            fontSize={14}
            color={tab.path === pathname ? 'white' : 'grey'}
          >
            {tab.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Tabs;
