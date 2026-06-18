import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  Card,
  Grid,
  Divider
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, FlightTakeoff, ArrowForward } from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const setBooking = useStore((state) => state.setBooking);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Autofill handler
  const handleAutofill = (role: 'ADMIN' | 'STAFF' | 'PASSENGER') => {
    setError('');
    if (role === 'ADMIN') {
      setEmail('admin@skyjourney.com');
      setPassword('password');
    } else if (role === 'STAFF') {
      setEmail('staff@skyjourney.com');
      setPassword('password');
    } else {
      setEmail('john@skyjourney.com');
      setPassword('password');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const registeredUsers = localStorage.getItem('skyjourney_registered')
      ? JSON.parse(localStorage.getItem('skyjourney_registered')!)
      : [];
    const matchedUser = registeredUsers.find((u: any) => u.email.trim().toLowerCase() === cleanEmail && u.password === password);

    setTimeout(() => {
      setLoading(false);
      if (matchedUser) {
        setUser({
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          nationality: matchedUser.nationality,
          passportNo: matchedUser.passportNo,
          role: matchedUser.role || 'PASSENGER'
        });
        
        if (matchedUser.role === 'ADMIN' || matchedUser.role === 'STAFF') {
          setBooking(null);
        } else {
          const allBookings: any[] = localStorage.getItem('skyjourney_bookings')
            ? JSON.parse(localStorage.getItem('skyjourney_bookings')!)
            : [];

          // Helper: find first free seat not in the taken set
          const findFreeSeat = (taken: Set<string>) => {
            const cols: Array<{ col: string; type: 'WINDOW' | 'MIDDLE' | 'AISLE' }> = [
              { col: 'A', type: 'WINDOW' }, { col: 'B', type: 'MIDDLE' }, { col: 'C', type: 'AISLE' },
              { col: 'D', type: 'AISLE' }, { col: 'E', type: 'MIDDLE' }, { col: 'F', type: 'WINDOW' },
            ];
            for (let row = 10; row <= 30; row++) {
              for (const { col, type } of cols) {
                if (!taken.has(`${row}${col}`)) return { row, col, type };
              }
            }
            return null;
          };

          const userBooking = allBookings.find((b: any) => b.passengerId === matchedUser.id);

          if (userBooking) {
            // Auto-repair: if another booking shares the same seat, give this user a new unique one
            const seatKey = userBooking.seat ? `${userBooking.seat.row}${userBooking.seat.col}` : null;
            const isDuplicate = seatKey && allBookings.some(
              (b: any) => b.id !== userBooking.id && b.seat &&
                `${b.seat.row}${b.seat.col}` === seatKey
            );
            if (isDuplicate) {
              const taken = new Set<string>(
                allBookings.filter((b: any) => b.id !== userBooking.id && b.seat)
                  .map((b: any) => `${b.seat.row}${b.seat.col}`)
              );
              const free = findFreeSeat(taken);
              const fixedBooking = free
                ? { ...userBooking, seat: { id: Date.now(), row: free.row, col: free.col, type: free.type, status: 'BOOKED' } }
                : userBooking;
              const saved = allBookings.map((b: any) => b.id === userBooking.id ? fixedBooking : b);
              localStorage.setItem('skyjourney_bookings', JSON.stringify(saved));
              setBooking(fixedBooking);
            } else {
              setBooking(userBooking);
            }
          } else {
            // No booking yet — assign a unique free seat
            const taken = new Set<string>(
              allBookings.filter((b: any) => b.seat).map((b: any) => `${b.seat.row}${b.seat.col}`)
            );
            const free = findFreeSeat(taken);
            const assignedSeat = free
              ? { id: Date.now() + 1, row: free.row, col: free.col, type: free.type, status: 'BOOKED' as const }
              : { id: Date.now() + 1, row: 14, col: 'C', type: 'AISLE' as const, status: 'BOOKED' as const };
            const newBooking = {
              id: Date.now(),
              bookingRef: 'REF-' + Math.floor(100 + Math.random() * 900),
              flight: { id: 1, flightNo: 'SJ-101', origin: 'JFK', destination: 'LAX', departTime: new Date(Date.now() + 3 * 3600000).toISOString(), arriveTime: new Date(Date.now() + 9 * 3600000).toISOString(), gate: 'T8-Gate 4', status: 'BOARDING' },
              seat: assignedSeat,
              passengerId: matchedUser.id,
            };
            localStorage.setItem('skyjourney_bookings', JSON.stringify([...allBookings, newBooking]));
            setBooking(newBooking);
          }
        }

        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Select a quick role above or double check password.');
      }
    }, 900);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* ── Animated Background ────────────────────────────────── */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Sky gradient */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #010610 0%, #060E1F 40%, #0A1828 70%, #061020 100%)' }} />
        {/* Glow blobs */}
        <Box className="sky-bg-glow sky-bg-glow-1" sx={{ opacity: 0.6 }} />
        <Box className="sky-bg-glow sky-bg-glow-2" sx={{ opacity: 0.4 }} />
        <Box className="sky-bg-glow sky-bg-glow-3" sx={{ opacity: 0.3 }} />
        {/* Grid lines */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        {/* Plane trail */}
        <Box className="plane-trail">
          <FlightTakeoff sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18, transform: 'rotate(-5deg)' }} />
        </Box>
      </Box>

      {/* ── Left Panel (Hero) ───────────────────────────────────── */}
      <Box sx={{
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '50%',
        p: 6,
        position: 'relative',
        zIndex: 1,
        borderRight: '1px solid rgba(0,212,255,0.07)',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(240,192,64,0.12))',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0,212,255,0.2)',
          }}>
            <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, letterSpacing: 2, fontSize: '1.1rem', background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SKYJOURNEY
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#3A5070', letterSpacing: 2.5, fontWeight: 600, textTransform: 'uppercase' }}>
              AI Airline Companion
            </Typography>
          </Box>
        </Box>

        {/* Hero content */}
        <Box className="animate-slideup" sx={{ maxWidth: 480, my: 'auto' }}>
          {/* Glowing flight card */}
          <Box sx={{
            mb: 5, p: 3, borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(11,22,40,0.9), rgba(6,14,31,0.95))',
            border: '1px solid rgba(0,212,255,0.18)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)',
            position: 'relative', overflow: 'hidden',
            animation: 'tickFloat 5s ease-in-out infinite',
          }}>
            {/* Gradient top strip */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #F0C040, #00D4FF, #F0C040)', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }} />
            
            {/* Animated SVG Flight Path */}
            <Box sx={{ width: '100%', height: 110, mt: 1, position: 'relative' }}>
              <svg viewBox="0 0 340 100" width="100%" height="100%">
                {/* Arc path */}
                <path d="M 40 70 Q 170 10 300 70" fill="none" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 40 70 Q 170 10 300 70" fill="none" stroke="url(#svgRouteGrad)" strokeWidth="2" strokeDasharray="12 12" className="animated-path" />
                
                {/* Pulse Glows */}
                <circle cx="40" cy="70" r="10" fill="#F0C040" opacity="0.15" />
                <circle cx="40" cy="70" r="4" fill="#F0C040" />
                <circle cx="300" cy="70" r="10" fill="#00D4FF" opacity="0.15" />
                <circle cx="300" cy="70" r="4" fill="#00D4FF" />
                
                <defs>
                  <linearGradient id="svgRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F0C040" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Floating Route Info Overlay */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#F0F4FF', lineHeight: 1 }}>JFK</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#4A6080' }}>New York</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', alignSelf: 'center', mb: 1 }}>
                  <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 22, animation: 'pulseGlow 2.5s ease-in-out infinite' }} />
                  <Typography sx={{ fontSize: '0.55rem', color: '#3A5070', letterSpacing: 1.5, mt: 0.5 }}>NON-STOP</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#F0F4FF', lineHeight: 1 }}>LAX</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#4A6080' }}>Los Angeles</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
              {[{ label: 'FLIGHT', value: 'SJ-101' }, { label: 'GATE', value: 'T8-4' }, { label: 'SEAT', value: '12A' }, { label: 'CLASS', value: 'FIRST' }].map(item => (
                <Box key={item.label}>
                  <Typography sx={{ fontSize: '0.55rem', color: '#3A5070', letterSpacing: 1, fontWeight: 700 }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#F0F4FF' }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Typography variant="h2" sx={{ mb: 2.5, color: '#F0F4FF', fontSize: '3rem', fontWeight: 900, lineHeight: 1.15 }}>
            Your journey<br />
            <Box component="span" sx={{ background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              elevated with AI.
            </Box>
          </Typography>
          <Typography sx={{ color: '#8BA3C7', fontSize: '1rem', lineHeight: 1.7, maxWidth: 410 }}>
            Experience real-time telemetry tracking, automated seat exchanges, and intelligent companion logs.
          </Typography>
        </Box>

        {/* Footer */}
        <Typography sx={{ fontSize: '0.72rem', color: '#2A3A50', fontWeight: 500 }}>
          © 2026 SkyJourney Airlines · Smart Passenger System v2.1
        </Typography>
      </Box>

      {/* ── Right Panel (Login Form Card) ────────────────────────── */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2.5, sm: 4, lg: 6 },
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Form container card (Glassmorphic) */}
        <Card sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4.5 },
          borderRadius: '24px',
          background: 'rgba(6, 14, 31, 0.55)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          border: '1px solid rgba(0, 212, 255, 0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.02)',
        }} className="animate-slideup">

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 900, letterSpacing: 2, fontSize: '1.2rem', background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SKYJOURNEY
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 900, color: '#F0F4FF', letterSpacing: -0.5 }}>
            Welcome Back
          </Typography>
          <Typography sx={{ color: '#8BA3C7', mb: 3.5, fontSize: '0.88rem' }}>
            Choose a demo portal or sign in using your credentials.
          </Typography>

          <Box sx={{ mb: 3.5 }}>
            <Typography sx={{ fontSize: '0.62rem', color: '#4A6080', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', mb: 1.5, textAlign: 'center' }}>
              Quick Login As
            </Typography>
            <Grid container spacing={1}>
              {[
                { label: 'Admin', role: 'ADMIN' as const, color: '#F43F5E', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.3)' },
                { label: 'Staff', role: 'STAFF' as const, color: '#4ADE80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.3)' },
                { label: 'Passenger', role: 'PASSENGER' as const, color: '#00D4FF', bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.3)' },
              ].map((item) => (
                <Grid item xs={4} key={item.label}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleAutofill(item.role)}
                    sx={{
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      color: item.color,
                      bgcolor: item.bg,
                      borderColor: item.border,
                      borderRadius: '10px',
                      '&:hover': {
                        bgcolor: `${item.color}14`,
                        borderColor: item.color,
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mb: 3 }} />

          {error && (
            <Alert
              id="login-error-alert"
              severity="error"
              sx={{ mb: 3, borderRadius: '12px', bgcolor: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F0F4FF', '& .MuiAlert-icon': { color: '#F43F5E' } }}
            >
              {error}
            </Alert>
          )}

          <form id="login-form" onSubmit={handleSubmit}>
            <TextField
              id="login-email"
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@skyjourney.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#4A6080', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#00D4FF', boxShadow: '0 0 10px rgba(0,212,255,0.25)' },
                }
              }}
            />
            <TextField
              id="login-password"
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#4A6080', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#4A6080', '&:hover': { color: '#00D4FF' } }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#00D4FF', boxShadow: '0 0 10px rgba(0,212,255,0.25)' },
                }
              }}
            />

            <Button
              id="login-submit-btn"
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForward />}
              sx={{
                py: 1.6,
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: 0.5,
                background: loading ? 'rgba(240,192,64,0.3)' : 'linear-gradient(135deg, #F0C040 0%, #FFD966 50%, #E5B030 100%)',
                color: loading ? '#8BA3C7' : '#020817',
                boxShadow: loading ? 'none' : '0 6px 30px rgba(240,192,64,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFD966 0%, #F0C040 100%)',
                  boxShadow: '0 8px 35px rgba(240,192,64,0.45)',
                }
              }}
            >
              {loading ? 'Authenticating...' : 'Access Portal'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#4A6080', fontSize: '0.85rem' }}>
              Don't have an account?{' '}
              <Link
                id="register-link"
                component="button"
                onClick={() => navigate('/register')}
                sx={{ color: '#00D4FF', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
