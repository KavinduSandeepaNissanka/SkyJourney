import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';

interface Message {
  sender: 'assistant' | 'user';
  text: string;
  time: string;
}

const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I'm your SkyJourney AI Guardian. I've loaded details for flight SJ-101. How can I help you today?",
      time: getTime(),
    }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Where is my bag?",
    "How do I walk to Gate 4?",
    "Status of SJ-101?",
    "Travel tips for LA",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || thinking) return;
    setMessages(prev => [...prev, { sender: 'user', text: textToSend, time: getTime() }]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const normalized = textToSend.toLowerCase();
      let responseText: string;

      if (normalized.includes('bag') || normalized.includes('baggage')) {
        responseText = "Your bag (tag BG-998877) is IN_TRANSIT in the Plane Cargo Hold. Upon landing at LAX, it will be directed to Baggage Claim Carousel 4. Estimated delivery: 20 min after landing.";
      } else if (normalized.includes('gate') || normalized.includes('walk') || normalized.includes('directions')) {
        responseText = "Your flight SJ-101 departs from T8-Gate 4. From Security Control, it's a 3-minute walk (240 meters) straight past the Duty Free shops. Follow the cyan signs for Terminal 8.";
      } else if (normalized.includes('status') || normalized.includes('flight') || normalized.includes('sj-101')) {
        responseText = `Flight SJ-101 is currently BOARDING at T8-Gate 4. Departure is scheduled for ${new Date(Date.now() + 3 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please proceed to your gate now.`;
      } else if (normalized.includes('los angeles') || normalized.includes('lax') || normalized.includes('travel') || normalized.includes('tips')) {
        responseText = "Los Angeles is currently sunny and 24°C ☀️. Security at LAX is running smoothly. I recommend arriving at Carousel 4 within 20 minutes of landing. Need hotel or transit recommendations?";
      } else {
        responseText = "I'm here to assist with your entire journey! Try asking about your bag status, gate directions, real-time flight updates, or destination travel tips.";
      }

      setThinking(false);
      setMessages(prev => [...prev, { sender: 'assistant', text: responseText, time: getTime() }]);
    }, 1200);
  };

  return (
    <Box className="animate-slideup" sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>

      {/* Page Header */}
      <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 46, height: 46, borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(251,146,60,0.06))',
          border: '1px solid rgba(251,146,60,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(251,146,60,0.1)',
        }}>
          <SmartToy sx={{ color: '#FB923C', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F0F4FF', lineHeight: 1 }}>
            AI Travel Assistant
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80', animation: 'boardingBlink 2s ease-in-out infinite' }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 600 }}>
              Online · Monitoring SJ-101
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chat Container */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        background: 'rgba(11,22,40,0.72)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,212,255,0.12)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Chat messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
          {messages.map((msg, index) => {
            const isAI = msg.sender === 'assistant';
            return (
              <Box
                key={index}
                className="animate-fadeIn"
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  flexDirection: isAI ? 'row' : 'row-reverse',
                  alignItems: 'flex-start',
                }}
              >
                <Avatar sx={{
                  width: 34, height: 34, flexShrink: 0,
                  bgcolor: isAI ? 'rgba(251,146,60,0.12)' : 'rgba(240,192,64,0.12)',
                  color: isAI ? '#FB923C' : '#F0C040',
                  border: `1px solid ${isAI ? 'rgba(251,146,60,0.25)' : 'rgba(240,192,64,0.25)'}`,
                  '& svg': { fontSize: 18 },
                }}>
                  {isAI ? <SmartToy /> : <Person />}
                </Avatar>

                <Box sx={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: isAI ? 'flex-start' : 'flex-end' }}>
                  <Box sx={{
                    px: 2, py: 1.5,
                    borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    background: isAI
                      ? 'linear-gradient(135deg, rgba(251,146,60,0.06), rgba(11,22,40,0.8))'
                      : 'linear-gradient(135deg, rgba(240,192,64,0.1), rgba(11,22,40,0.8))',
                    border: isAI ? '1px solid rgba(251,146,60,0.15)' : '1px solid rgba(240,192,64,0.2)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                  }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#E8F0FF', lineHeight: 1.65 }}>
                      {msg.text}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#2A3A50', px: 0.5 }}>
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {/* Thinking indicator */}
          {thinking && (
            <Box className="animate-fadeIn" sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(251,146,60,0.12)', color: '#FB923C', border: '1px solid rgba(251,146,60,0.25)' }}>
                <SmartToy sx={{ fontSize: 18 }} />
              </Avatar>
              <Box sx={{ px: 2.5, py: 1.8, borderRadius: '4px 16px 16px 16px', background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)' }}>
                <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <Box key={i} sx={{
                      width: 7, height: 7, borderRadius: '50%', bgcolor: '#FB923C',
                      animation: 'boardingBlink 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Bottom Input Area */}
        <Box sx={{ p: 2.5, borderTop: '1px solid rgba(0,212,255,0.08)', bgcolor: 'rgba(2,8,23,0.5)' }}>
          {/* Suggestion chips */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 0.5 }}>
            {suggestions.map((s) => (
              <Chip
                key={s}
                label={s}
                onClick={() => handleSend(s)}
                clickable
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  color: '#00D4FF',
                  borderColor: 'rgba(0,212,255,0.2)',
                  bgcolor: 'transparent',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,212,255,0.08)', borderColor: '#00D4FF' },
                }}
              />
            ))}
          </Stack>

          {/* Input row */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              id="chat-input"
              fullWidth
              placeholder="Ask about your bag, gate, flight status..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
              size="small"
              disabled={thinking}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                },
              }}
            />
            <IconButton
              id="chat-send-btn"
              onClick={() => handleSend(input)}
              disabled={!input.trim() || thinking}
              sx={{
                width: 44, height: 44, borderRadius: '12px',
                bgcolor: input.trim() && !thinking ? '#F0C040' : 'rgba(255,255,255,0.05)',
                color: input.trim() && !thinking ? '#020817' : '#2A3A50',
                transition: 'all 0.25s',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: input.trim() && !thinking ? '#FFD966' : undefined,
                  boxShadow: input.trim() && !thinking ? '0 0 20px rgba(240,192,64,0.4)' : undefined,
                },
                '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.04)', color: '#1A2A3A' },
              }}
            >
              {thinking ? <CircularProgress size={18} sx={{ color: '#4A6080' }} /> : <Send sx={{ fontSize: 20 }} />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatAssistantPage;
