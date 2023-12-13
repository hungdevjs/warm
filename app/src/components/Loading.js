import { Box, alpha } from '@mui/material';

const Loading = ({ loading }) => {
  if (!loading) return null;

  return (
    <Box
      width="100vw"
      height="100vh"
      position="fixed"
      top={0}
      left={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={alpha('#000', 0.4)}
      zIndex={999}
    >
      <img src="/icons/loading.gif" alt="loading" width={48} />
    </Box>
  );
};

export default Loading;
