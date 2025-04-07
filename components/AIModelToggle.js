import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from '@mui/material/CircularProgress';
import { keyframes } from '@emotion/react';

// Add a pulsing animation for the switching state
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Custom styled switch with nice animation and colors
const ModelSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M20 15.31 23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const ModelIndicator = styled(Box)(({ theme, model }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 8px',
  borderRadius: '12px',
  backgroundColor: model === 'openai' ? '#10a37f' : '#232F3E', // OpenAI green vs AWS dark blue
  color: 'white',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  marginLeft: '8px',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

const AIModelToggle = ({ isUsingBedrock, onToggle, isSwitching = false }) => {
  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px',
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        padding: '8px 12px',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transform: 'scale(1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: isSwitching ? 'scale(1)' : 'scale(1.05)',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
        },
        animation: isSwitching ? `${pulse} 1.5s infinite ease-in-out` : 'none',
        opacity: isSwitching ? 0.8 : 1,
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Tooltip title={isSwitching ? "Switching models..." : (isUsingBedrock ? "Switch to OpenAI" : "Switch to AWS Bedrock")}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <ModelSwitch 
                  checked={isUsingBedrock} 
                  onChange={onToggle}
                  disabled={isSwitching}
                />
                {isSwitching && (
                  <CircularProgress
                    size={16}
                    sx={{
                      position: 'absolute',
                      top: -5,
                      right: -8,
                      color: '#ffffff',
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                AI Model
              </Typography>
              <ModelIndicator model={isUsingBedrock ? 'bedrock' : 'openai'}>
                {isUsingBedrock ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SpeedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    AWS
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    OpenAI
                  </Box>
                )}
              </ModelIndicator>
            </Box>
          }
        />
      </FormGroup>
    </Box>
  );
};

export default AIModelToggle; 