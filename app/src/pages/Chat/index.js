import { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useSnackbar } from 'notistack';

import useCoupleStore from '../../stores/couple.store';
import useUserStore from '../../stores/user.store';
import useMessage from '../../hooks/useMessage';
import { createMessage } from '../../services/firebase.service';

const Chat = () => {
  const user = useUserStore((state) => state.user);
  const couple = useCoupleStore((state) => state.couple);
  const { messages } = useMessage();
  const { enqueueSnackbar } = useSnackbar();
  const [text, setText] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = async () => {
    if (!text || !text.trim()) return;
    // setLoading(true);
    try {
      const data = { text };
      setText('');
      await createMessage(data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    // setLoading(false);
  };

  if (!couple) return null;

  const partner =
    couple.users[Object.keys(couple.users).find((key) => key !== user.id)];

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={0.75}>
      <Box p={2} bgcolor="white" display="flex" justifyContent="center" gap={2}>
        <Typography fontWeight={600}>{partner.username}</Typography>
      </Box>
      <Box
        flex={1}
        overflow="auto"
        bgcolor="white"
        display="flex"
        flexDirection="column"
        gap={0.5}
        p={1}
        sx={{
          MsOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            display="flex"
            justifyContent={
              message.creatorId === user.id ? 'flex-end' : 'flex-start'
            }
          >
            <Box
              px={2}
              py={1}
              maxWidth="80%"
              borderRadius={2}
              bgcolor={message.creatorId === user.id ? '#fe415b' : '#f2f2f2'}
            >
              <Typography
                color={message.creatorId === user.id ? 'white' : 'black'}
              >
                {message.text}
              </Typography>
            </Box>
          </Box>
        ))}
        <Box ref={bottomRef} />
      </Box>
      <Box
        bgcolor="white"
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          '& input': {
            flex: 1,
            p: 2,
            border: 'none',
            outline: 'none',
            bgcolor: 'transparent',
          },
        }}
      >
        <input
          placeholder="Your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        />
        <IconButton disabled={!text || !text.trim()}>
          <SendRoundedIcon
            sx={{ color: !text || !text.trim() ? 'lightgrey' : '#fe415b' }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
