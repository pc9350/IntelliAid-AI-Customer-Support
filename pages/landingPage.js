"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { keyframes } from "@emotion/react";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Color variables
const AIColor = "rgb(54, 74, 201)";
const CustomerColor = "rgb(242, 242, 242)";
const AITextColor = "white";
const CustomerTextColor = "black";


const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

const StyledSignOutButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '100px',
  height: '60px',
  minWidth: 'unset',
  padding: 0,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    transform: 'scale(1.1)',
    animation: `${pulseAnimation} 1.5s infinite`,
  },
  '&::after': {
    content: '"Sign Out"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    transition: 'opacity 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    opacity: 0,
  },
  '@media (max-width: 600px)': {
    width: '50px',
    height: '50px',
    top: '10px',
    right: '10px',
  },
}));


// Styled components
const ChatBox = styled(Box)(({ theme }) => ({
  width: "90vw",
  maxWidth: "500px",
  height: "80vh",
  maxHeight: "700px",
  borderRadius: "25px",
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(to top, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  boxShadow: theme.shadows[5],
  display: "flex",
  flexDirection: "column",
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: AIColor,
  color: AITextColor,
  fontSize: "2rem",
  padding: theme.spacing(4),
  borderRadius: "25px 25px 0 0", // Rounded corners on top
  margin: 0,
  position: "sticky",
  top: 0,
  width: "100%",
  textAlign: "center",
  boxShadow: theme.shadows[2],
}));

const ContentContainer = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  padding: theme.spacing(2),
}));




const MessageBox = styled(Box)(({ role }) => ({
  backgroundColor: role === "assistant" ? AIColor : CustomerColor,
  color: role === "assistant" ? AITextColor : CustomerTextColor,
  borderRadius: "16px",
  padding: "16px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: "16px",
  backgroundColor: CustomerColor,
  color: CustomerTextColor,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: AIColor,
    color: AITextColor,
    boxShadow: theme.shadows[4],
  },
}));

const StyledTextField = styled(TextField)(({ theme, isSelected }) => {
  const borderColor = isSelected ? CustomerColor : AIColor;
  return {
    borderRadius: "16px",
    "& .MuiInputBase-root": {
      borderRadius: "16px",
      border: `2px solid ${borderColor}`,
      boxShadow: theme.shadows[2],
      transition: "border-color 0.3s ease",
      "&:focus": {
        borderColor: AIColor,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: AIColor,
    },
  };
});

const FeedbackModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const FeedbackBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: theme.shadows[5],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "90vw",
  width: "400px",
  textAlign: "center",
}));

export default function Home() {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the TrendyThreads support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(null);
  const contentContainerRef = useRef(null);
  const router = useRouter();


  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = { role: "user", content: message };
  
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setMessage("");
  
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, userMessage]),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
      }
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  
    setIsLoading(false);
  };
  

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleEndChat = () => {
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      const feedbackData = {
        userId: user.uid,
        userName: user.email,
        feedback: feedback,
        rating: feedbackRating,
        timestamp: new Date(),
      };

      // Save feedback to Firestore
      const docRef = await addDoc(collection(db, "feedback"), feedbackData);

      // Close the modal after submission
      setIsFeedbackModalOpen(false);
      setFeedback("");
      setFeedbackRating(null);


      // Resets chat state after ending chat
      localStorage.removeItem("hasIntroduced"); // Resets introduction state
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm the TrendyThreads support assistant. How can I help you today?",
        },
      ]);
    } catch (error) {
      console.error("Error adding feedback: ", error);
    }
  };

  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop =
        contentContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin"); // Redirect to the sign-in page after signing out
    } catch (error) {
      console.error("Error signing out:", error);
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
      <StyledSignOutButton onClick={handleSignOut}>
        <ExitToAppIcon />
      </StyledSignOutButton>
      <ChatBox>
        <Header sx={{ p: 5 }}>TrendyThreads Support</Header>
        <ContentContainer
          direction="column"
          spacing={2}
          ref={contentContainerRef}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
              mb={1}
              position="relative"
            >
              <MessageBox role={message.role}>{message.content}</MessageBox>
            </Box>
          ))}
        </ContentContainer>
        <Stack
          direction="row"
          spacing={2}
          mt={2}
          alignItems="center"
          padding={2}
        >
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
            {isLoading ? "Sending..." : "Send"}
          </SendButton>
          <Button
            variant="contained"
            onClick={handleEndChat}
            color="error"
            sx={{ marginLeft: "auto", borderRadius: "16px" }}
          >
            End Chat
          </Button>
        </Stack>
      </ChatBox>
      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      >
        <FeedbackBox>
          <Typography variant="h6" gutterBottom>
            How was your chat experience?
          </Typography>
          <Box display="flex" justifyContent="center" mb={2}>
            <ThumbUpAltIcon
              onClick={() => setFeedbackRating("up")}
              sx={{
                fontSize: 40,
                color: feedbackRating === "up" ? "green" : "gray",
                cursor: "pointer",
                marginRight: 2,
              }}
            />
            <ThumbDownAltIcon
              onClick={() => setFeedbackRating("down")}
              sx={{
                fontSize: 40,
                color: feedbackRating === "down" ? "red" : "gray",
                cursor: "pointer",
              }}
            />
          </Box>
          <TextField
            label="Leave a feedback"
            multiline
            fullWidth
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleFeedbackSubmit}>
            Submit Feedback
          </Button>
        </FeedbackBox>
      </FeedbackModal>
    </Box>
  );
}
