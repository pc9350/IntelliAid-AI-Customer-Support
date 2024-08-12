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
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Background3D from "@/components/Background3D";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// Color variables
const AIColor = "rgba(52, 152, 219, 0.8)"; // Slightly transparent blue
const CustomerColor = "rgba(200, 200, 200, 0.8)"; // Slightly transparent orange
const AITextColor = "#FFFFFF";
const CustomerTextColor = "#2D3436";
const BackgroundColor = "rgba(236, 240, 241, 0.05)";

const typingAnimation = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const Dot = styled(Box)(({ theme }) => ({
  display: "inline-block",
  width: "8px",
  height: "8px",
  margin: "0 4px",
  backgroundColor: "white",
  borderRadius: "50%",
  animation: `${typingAnimation} 1.4s infinite ease-in-out both`,
  "&:nth-of-type(1)": { animationDelay: "-0.32s" },
  "&:nth-of-type(2)": { animationDelay: "-0.16s" },
}));


const TypingIndicator = () => (
  <Box display="flex" alignItems="center">
    <Dot />
    <Dot />
    <Dot />
  </Box>
);

// const glowingBorder = keyframes`
//   0% {
//     box-shadow: 0 0 10px #FF416C, 0 0 20px #FF4B2B, 0 0 30px #FF416C, 0 0 40px #FF4B2B;
//   }
//   50% {
//     box-shadow: 0 0 30px #FF416C, 0 0 40px #FF4B2B, 0 0 50px #FF416C, 0 0 60px #FF4B2B;
//   }
//   100% {
//     box-shadow: 0 0 10px #FF416C, 0 0 20px #FF4B2B, 0 0 30px #FF416C, 0 0 40px #FF4B2B;
//   }
// `;

const AnimatedButton = styled(Button)(({ theme, customcolor }) => ({
  borderRadius: '20px',
  padding: '10px 20px',
  color: '#FFFFFF',
  backgroundColor: customcolor || '#3498db', // Use customcolor to set the background
  boxShadow: `0 3px 5px 2px rgba(0, 0, 0, 0.2)`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 6px 10px 4px rgba(0, 0, 0, 0.3)`,
  },
  '&:active': {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 7px 3px rgba(0, 0, 0, 0.3)`,
  },
}));

const buttonStyles = {
  height: '50px', // Set a fixed height for both buttons
  padding: '10px 20px', // Ensure consistent padding
  borderRadius: '20px', // Consistent border-radius for both
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
`;

const SendButton = ({ onClick, disabled }) => (
  <AnimatedButton
    onClick={onClick}
    disabled={disabled}
    customcolor="#3498db" // Solid blue color
    sx={{
      ...buttonStyles,
      animation: disabled ? 'none' : `${pulseAnimation} 2s infinite`,
    }}
    endIcon={<SendIcon />}
  >
    Send
  </AnimatedButton>
);

const EndChatButton = ({ onClick }) => (
  <AnimatedButton
    onClick={onClick}
    customcolor="#c0392b" // Solid red color
    sx={buttonStyles}
    endIcon={<CloseIcon />}
  >
    End Chat
  </AnimatedButton>
);

const SignOutButton = ({ onClick }) => (
  <AnimatedButton
    onClick={onClick}
    customcolor="#8e44ad" // Solid purple color
    sx={{
      position: 'absolute',
      top: '20px',
      right: '20px',
    }}
  >
    <p style={{ paddingRight: '5px' }}>Sign Out</p>
    <ExitToAppIcon />
  </AnimatedButton>
);

// Styled components
const ChatBox = styled(Box)(({ theme }) => ({
  width: '90vw',
  maxWidth: '500px',
  height: '80vh',
  maxHeight: '700px',
  borderRadius: '25px',
  background: BackgroundColor,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1)',
  },
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(52, 152, 219, 0.9)", // Matching AIColor but more opaque
  color: AITextColor,
  fontSize: "2rem",
  padding: theme.spacing(4),
  borderRadius: "25px 25px 0 0",
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

// const messageAnimation = keyframes`
//   0% { opacity: 0; transform: translateY(20px) scale(0.9); }
//   100% { opacity: 1; transform: translateY(0) scale(1); }
// `;

const MessageBox = styled(Box)(({ role }) => ({
  backgroundColor: role === "assistant" ? AIColor : CustomerColor,
  color: role === "assistant" ? AITextColor : CustomerTextColor,
  borderRadius: "16px",
  padding: "16px",
  maxWidth: "80%",
  alignSelf: role === "assistant" ? "flex-start" : "flex-end",
  marginBottom: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
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
      "& input": {
        color: "white", // Set the typing text color to black
      },
      "&:focus": {
        borderColor: "#FFFFFF",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#FFFFFF",
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

const DarkBackground = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(135deg, #1f1c2c, #928DAB)", // Dark purple to light purple gradient
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  position: "relative", // Ensures particles stay within bounds
  overflow: "hidden",
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
    <DarkBackground>
      {/* <Particle style={{ top: "10%", left: "20%" }} />
  <Particle style={{ top: "50%", left: "60%" }} />
  <Particle style={{ top: "80%", left: "30%" }} /> */}
  <Background3D />

      <SignOutButton onClick={handleSignOut} />
      {/* <StyledSignOutButton onClick={handleSignOut}>
        <ExitToAppIcon />
      </StyledSignOutButton> */}
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
            >
              <MessageBox role={message.role}>{message.content}</MessageBox>
            </Box>
          ))}

          {isLoading && (
            <Box display="flex" justifyContent="flex-start" mb={1}>
              <TypingIndicator />
            </Box>
          )}
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
          <SendButton onClick={sendMessage} disabled={isLoading} />
          <EndChatButton onClick={handleEndChat} />
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
    </DarkBackground>
  );
}
