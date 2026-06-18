import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  MenuItem
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, FlightTakeoff, Public, CardMembership, CheckCircle, VpnKey } from '@mui/icons-material';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'PASSENGER' | 'STAFF' | 'ADMIN'>('PASSENGER');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all required fields.'); return; }
    
    if (role === 'STAFF' && secretKey !== 'staff') {
      setError("Invalid secret key for Staff registration. (Hint: 'staff')");
      return;
    }
    if (role === 'ADMIN' && secretKey !== 'admin') {
      setError("Invalid secret key for Admin registration. (Hint: 'admin')");
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const registeredUsers = localStorage.getItem('skyjourney_registered')
      ? JSON.parse(localStorage.getItem('skyjourney_registered')!)
      : [];

    if (registeredUsers.some((u: any) => u.email.trim().toLowerCase() === cleanEmail) || cleanEmail === 'john@skyjourney.com') {
      setLoading(false);
      setError('Email is already registered.');
      return;
    }

    const newPassengerId = Date.now();
    registeredUsers.push({ id: newPassengerId, name, email: cleanEmail, password, nationality: nationality || undefined, passportNo: passportNo || undefined, role });
    localStorage.setItem('skyjourney_registered', JSON.stringify(registeredUsers));

    // If registering as a PASSENGER, immediately assign a unique seat and create a booking
    if (role === 'PASSENGER') {
      const existingBookings = localStorage.getItem('skyjourney_bookings')
        ? JSON.parse(localStorage.getItem('skyjourney_bookings')!)
        : [];
      const takenSeats = new Set(
        existingBookings.filter((b: any) => b.seat).map((b: any) => `${b.seat.row}${b.seat.col}`)
      );
      const cols: Array<{ col: string; type: 'WINDOW' | 'MIDDLE' | 'AISLE' }> = [
        { col: 'A', type: 'WINDOW' }, { col: 'B', type: 'MIDDLE' }, { col: 'C', type: 'AISLE' },
        { col: 'D', type: 'AISLE' }, { col: 'E', type: 'MIDDLE' }, { col: 'F', type: 'WINDOW' },
      ];
      let freeSeat: { row: number; col: string; type: 'WINDOW' | 'MIDDLE' | 'AISLE' } | null = null;
      outer: for (let row = 10; row <= 30; row++) {
        for (const { col, type } of cols) {
          if (!takenSeats.has(`${row}${col}`)) { freeSeat = { row, col, type }; break outer; }
        }
      }
      if (freeSeat) {
        const newBooking = {
          id: newPassengerId + 1,
          bookingRef: 'REF-' + Math.floor(100 + Math.random() * 900),
          flight: { id: 1, flightNo: 'SJ-101', origin: 'JFK', destination: 'LAX', departTime: new Date(Date.now() + 3 * 3600000).toISOString(), arriveTime: new Date(Date.now() + 9 * 3600000).toISOString(), gate: 'T8-Gate 4', status: 'BOARDING' },
          seat: { id: newPassengerId + 2, row: freeSeat.row, col: freeSeat.col, type: freeSeat.type, status: 'BOOKED' },
          passengerId: newPassengerId,
        };
        existingBookings.push(newBooking);
        localStorage.setItem('skyjourney_bookings', JSON.stringify(existingBookings));
      }
    }

    setTimeout(() => { setLoading(false); navigate('/login'); }, 600);
  };

  const benefits = [
    'Real-time flight status & gate updates',
    'AI-powered travel assistant',
    'Smart baggage tracking',
    'Seat exchange marketplace',
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background ─────────────────────────────────────────── */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #010610 0%, #060E1F 40%, #0A1828 70%, #061020 100%)' }} />
        <Box className="sky-bg-glow sky-bg-glow-1" />
        <Box className="sky-bg-glow sky-bg-glow-2" />
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        <Box className="plane-trail">
          <FlightTakeoff sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18 }} />
        </Box>
      </Box>

      {/* ── Left Panel ─────────────────────────────────────────── */}
      <Box sx={{
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '44%',
        p: 6,
        position: 'relative',
        zIndex: 1,
        borderRight: '1px solid rgba(0,212,255,0.07)',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(240,192,64,0.12))', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(0,212,255,0.2)' }}>
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

        {/* Illustration / content */}
        <Box className="animate-slideup">
          {/* Glowing plane icon */}
          <Box sx={{
            width: 90, height: 90, borderRadius: '28px', mb: 4,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(240,192,64,0.08))',
            border: '1px solid rgba(0,212,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0,212,255,0.15)',
            animation: 'pulseGlow 3s ease-in-out infinite',
          }}>
            <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 44, filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.5))' }} />
          </Box>

          <Typography variant="h2" sx={{ mb: 2, color: '#F0F4FF', fontSize: '2.4rem', lineHeight: 1.2 }}>
            Join the{' '}
            <Box component="span" sx={{ background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              future
            </Box>{' '}
            of air travel
          </Typography>
          <Typography sx={{ color: '#8BA3C7', fontSize: '0.95rem', mb: 4, lineHeight: 1.7 }}>
            Create your passenger record and unlock a full suite of intelligent travel tools.
          </Typography>

          {/* Benefits list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {benefits.map((benefit) => (
              <Box key={benefit} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ color: '#4ADE80', fontSize: 20, flexShrink: 0 }} />
                <Typography sx={{ color: '#8BA3C7', fontSize: '0.9rem' }}>{benefit}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontSize: '0.72rem', color: '#2A3A50' }}>
          © 2026 SkyJourney Airlines · Smart Passenger System v2.0
        </Typography>
      </Box>

      {/* ── Right Panel (Form) ─────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4, lg: 5 }, position: 'relative', zIndex: 1, overflowY: 'auto' }}>
        <Box className="animate-slideup" sx={{ width: '100%', maxWidth: 440, py: 2 }}>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 900, letterSpacing: 2, fontSize: '1.2rem', background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SKYJOURNEY
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ mb: 0.5, fontWeight: 900, color: '#F0F4FF' }}>
            Create account
          </Typography>
          <Typography sx={{ color: '#8BA3C7', mb: 3.5, fontSize: '0.9rem' }}>
            Register your passenger record to get started
          </Typography>

          {error && (
            <Alert
              id="register-error-alert"
              severity="error"
              sx={{ mb: 3, borderRadius: '12px', bgcolor: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F0F4FF', '& .MuiAlert-icon': { color: '#F43F5E' } }}
            >
              {error}
            </Alert>
          )}

          <form id="register-form" onSubmit={handleSubmit}>
            <TextField
              id="register-name"
              fullWidth
              label="Full Name *"
              variant="outlined"
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#4A6080', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField
              id="register-email"
              fullWidth
              label="Email Address *"
              variant="outlined"
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@skyjourney.com"
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#4A6080', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField
              id="register-password"
              fullWidth
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#4A6080', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#4A6080', '&:hover': { color: '#00D4FF' } }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="register-role"
              select
              fullWidth
              label="Account Type / Role *"
              variant="outlined"
              margin="dense"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as any);
                setSecretKey('');
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#00D4FF', boxShadow: '0 0 10px rgba(0,212,255,0.25)' },
                }
              }}
            >
              <MenuItem value="PASSENGER">Passenger (Traveller)</MenuItem>
              <MenuItem value="STAFF">Airport Staff / Crew</MenuItem>
              <MenuItem value="ADMIN">System Administrator</MenuItem>
            </TextField>

            {role !== 'PASSENGER' && (
              <TextField
                id="register-secret-key"
                fullWidth
                label="Role Authorization Secret Key *"
                type="password"
                variant="outlined"
                margin="dense"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder={role === 'STAFF' ? "Enter 'staff'" : "Enter 'admin'"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey sx={{ color: '#4A6080', fontSize: 20 }} />
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
            )}

            {/* Optional divider label */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 2 }}>
              <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(0,212,255,0.08)' }} />
              <Typography sx={{ fontSize: '0.7rem', color: '#3A5070', fontWeight: 600, letterSpacing: 1 }}>OPTIONAL</Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(0,212,255,0.08)' }} />
            </Box>

            <TextField
              id="register-nationality"
              fullWidth
              label="Nationality"
              variant="outlined"
              margin="dense"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="American"
              InputProps={{ startAdornment: <InputAdornment position="start"><Public sx={{ color: '#4A6080', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField
              id="register-passport"
              fullWidth
              label="Passport Number"
              variant="outlined"
              margin="dense"
              value={passportNo}
              onChange={(e) => setPassportNo(e.target.value)}
              placeholder="US1234567"
              InputProps={{ startAdornment: <InputAdornment position="start"><CardMembership sx={{ color: '#4A6080', fontSize: 20 }} /></InputAdornment> }}
            />

            <Button
              id="register-submit-btn"
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{
                mt: 3, py: 1.6, fontSize: '0.95rem', fontWeight: 800, letterSpacing: 0.5,
                background: loading ? 'rgba(240,192,64,0.3)' : 'linear-gradient(135deg, #F0C040 0%, #FFD966 50%, #E5B030 100%)',
                color: loading ? '#8BA3C7' : '#020817',
                boxShadow: loading ? 'none' : '0 6px 30px rgba(240,192,64,0.3)',
              }}
            >
              {loading ? 'Creating Record...' : 'Create Passenger Record'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#4A6080', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link
                id="login-link"
                component="button"
                onClick={() => navigate('/login')}
                sx={{ color: '#00D4FF', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
