'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';

// Color variables
const AIColor = 'rgb(54, 74, 201)';
const CustomerColor = 'rgb(242, 242, 242)';
const AITextColor = 'white';
const CustomerTextColor = 'black';

// Styled components
const ChatBox = styled(Box)(({ theme }) => ({
  width: '90vw',
  maxWidth: '500px',
  height: '80vh',
  maxHeight: '700px',
  borderRadius: '25px',
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(to top, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  boxShadow: theme.shadows[5],
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: AIColor,
  color: AITextColor,
  fontSize: '2rem',
  padding: theme.spacing(4),
  borderRadius: '25px 25px 0 0', // Rounded corners on top
  margin: 0,
  position: 'sticky',
  top: 0,
  width: '100%',
  textAlign: 'center',
  boxShadow: theme.shadows[2],
}));


const ContentContainer = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MessageBox = styled(Box)(({ role }) => ({
  backgroundColor: role === 'assistant' ? AIColor : CustomerColor,
  color: role === 'assistant' ? AITextColor : CustomerTextColor,
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  
})); 

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: CustomerColor,
  color: CustomerTextColor,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: AIColor,
    color: AITextColor,
    boxShadow: theme.shadows[4],
  },
}));

const StyledTextField = styled(TextField)(({ theme, isSelected }) => {
  const borderColor = isSelected ? CustomerColor : AIColor;
  return {
    borderRadius: '16px',
    '& .MuiInputBase-root': {
      borderRadius: '16px',
      border: `2px solid ${borderColor}`,
      boxShadow: theme.shadows[2],
      transition: 'border-color 0.3s ease',
      '&:focus': {
        borderColor: AIColor,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: AIColor,
    },
  };
});

export default function Home() {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the TrendyThreads support assistant. How can I help you today?",
    }
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const contentContainerRef = useRef(null);

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
  
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = contentContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
        <Header>
          TrendyThreads Support
        </Header>
        <ContentContainer direction="column" spacing={2} ref={contentContainerRef}>
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
              mb={1}
            >
              <MessageBox role={message.role}  >
                {message.content}
              </MessageBox>
            </Box>
          ))}
        </ContentContainer>
        <Stack direction="row" spacing={2} mt={2} alignItems="center" padding={2}>
          <StyledTextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            onFocus={() => setIsTextFieldFocused(true)}
            onBlur={() => setIsTextFieldFocused(false)}
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
