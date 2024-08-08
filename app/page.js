'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

// Styled components
const ChatBox = styled(Box)(({ theme }) => ({
  width: '90vw',
  maxWidth: '500px',
  height: '80vh',
  maxHeight: '700px',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(to top, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const MessageBox = styled(Box)(({ theme, role }) => ({
  backgroundColor: role === 'assistant' ? theme.palette.primary.main : theme.palette.secondary.main,
  color: theme.palette.common.white,
  borderRadius: '16px',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  borderRadius: '16px',
  '& .MuiInputBase-root': {
    borderRadius: '16px',
  },
}));

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the TrendyThreads support assistant. How can I help you today?",
    }
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
      padding={2}
    >
      <ChatBox>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
              mb={1}
            >
              <MessageBox role={message.role}>
                {message.content}
              </MessageBox>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          <StyledTextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <SendButton
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </SendButton>
        </Stack>
      </ChatBox>
    </Box>
  );
}
