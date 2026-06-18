import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  Container,
  Stack
} from '@mui/material';
import {
  FlightTakeoff,
  ArrowForward,
  Speed,
  Devices,
  SupportAgent,
  LocalMall,
  AirlineSeatReclineExtra,
  AdminPanelSettings
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  const features = [
    {
      icon: <AirlineSeatReclineExtra sx={{ color: '#00D4FF', fontSize: 32 }} />,
      title: 'Smart Seat Exchange',
      desc: 'Swap seats dynamically in the passenger cabin using our automated trading seat marketplace.'
    },
    {
      icon: <LocalMall sx={{ color: '#F0C040', fontSize: 32 }} />,
      title: 'RFID Baggage Telemetry',
      desc: 'Real-time timeline tracking of baggage status updates directly from baggage scanning terminals.'
    },
    {
      icon: <SupportAgent sx={{ color: '#4ADE80', fontSize: 32 }} />,
      title: 'AI Companion Assistant',
      desc: 'Get instantly answered flight details, gate directions, and travel requests using our AI assistant.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background Sky Effects ────────────────────────────── */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #010610 0%, #060E1F 40%, #0A1828 70%, #061020 100%)' }} />
        <Box className="sky-bg-glow sky-bg-glow-1" sx={{ opacity: 0.6 }} />
        <Box className="sky-bg-glow sky-bg-glow-2" sx={{ opacity: 0.4 }} />
        <Box className="sky-bg-glow sky-bg-glow-3" sx={{ opacity: 0.3 }} />
        {/* Grid Overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
        <Box className="plane-trail">
          <FlightTakeoff sx={{ color: 'rgba(0,212,255,0.4)', fontSize: 18, transform: 'rotate(-5deg)' }} />
        </Box>
      </Box>

      {/* ── Floating Navigation Header ─────────────────────────── */}
      <Box sx={{
        position: 'sticky',
        top: 16,
        zIndex: 100,
        px: { xs: 2, md: 4 },
        mt: 2
      }}>
        <Container maxWidth="lg">
          <Card sx={{
            px: 3,
            py: 1.8,
            borderRadius: '16px',
            background: 'rgba(6, 14, 31, 0.65)',
            backdropFilter: 'blur(20px) saturate(1.2)',
            border: '1px solid rgba(0, 212, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(240,192,64,0.12))',
                border: '1px solid rgba(0,212,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, letterSpacing: 1.5, fontSize: '0.95rem', background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  SKYJOURNEY
                </Typography>
                <Typography sx={{ fontSize: '0.55rem', color: '#4A6080', letterSpacing: 1.8, fontWeight: 700, textTransform: 'uppercase' }}>
                  AI Companion
                </Typography>
              </Box>
            </Box>

            {/* Menu Items (Desktop Only) */}
            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['Features', 'Telemetry', 'Portal Previews', 'Security'].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    fontSize: '0.82rem',
                    color: '#8BA3C7',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#00D4FF' }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>

            {/* Right Action Button */}
            <Box>
              {user ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderRadius: '8px',
                    borderColor: 'rgba(0, 212, 255, 0.4)',
                    color: '#00D4FF',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'none',
                    px: 2.5,
                    py: 0.8,
                    '&:hover': {
                      borderColor: '#00D4FF',
                      background: 'rgba(0, 212, 255, 0.05)'
                    }
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#8BA3C7',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      '&:hover': { color: '#00D4FF' }
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #F0C040 0%, #E5B030 100%)',
                      color: '#020817',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      px: 2.5,
                      py: 0.8,
                      boxShadow: '0 4px 14px rgba(240,192,64,0.25)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFD966 0%, #F0C040 100%)',
                        boxShadow: '0 6px 18px rgba(240,192,64,0.35)',
                      }
                    }}
                  >
                    Register
                  </Button>
                </Stack>
              )}
            </Box>
          </Card>
        </Container>
      </Box>

      {/* ── Hero Content Section ────────────────────────────── */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
        <Grid container spacing={5} alignItems="center">
          
          {/* Left Column: Headline and Call-to-action */}
          <Grid item xs={12} lg={6} className="animate-slideup">
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(0, 212, 255, 0.06)',
              border: '1px solid rgba(0, 212, 255, 0.15)',
              borderRadius: '99px',
              px: 2,
              py: 0.6,
              mb: 3
            }}>
              <Speed sx={{ color: '#00D4FF', fontSize: 14 }} />
              <Typography sx={{ color: '#80EAFF', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Next-Gen Airline Telemetry v2.1
              </Typography>
            </Box>

            <Typography variant="h1" sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.6rem', md: '4.2rem' },
              lineHeight: 1.1,
              color: '#F0F4FF',
              mb: 2.5,
              letterSpacing: -1
            }}>
              Your air journey<br />
              <Box component="span" sx={{ background: 'linear-gradient(90deg, #F0C040, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                elevated by AI.
              </Box>
            </Typography>

            <Typography sx={{ color: '#8BA3C7', fontSize: '1.05rem', lineHeight: 1.7, mb: 4.5, maxWidth: 520 }}>
              SkyJourney AI integrates real-time RFID baggage scanning, cabin seat exchanges, and intelligent terminal routing assistance into a single premium airline platform.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.8,
                  px: 4,
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  background: 'linear-gradient(135deg, #F0C040 0%, #FFD966 50%, #E5B030 100%)',
                  color: '#020817',
                  boxShadow: '0 8px 30px rgba(240,192,64,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFD966 0%, #F0C040 100%)',
                    boxShadow: '0 10px 35px rgba(240,192,64,0.45)',
                  }
                }}
              >
                Access Flight Portal
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  py: 1.8,
                  px: 4,
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#F0F4FF',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    borderColor: 'rgba(0, 212, 255, 0.4)',
                    color: '#00D4FF',
                    background: 'rgba(0,212,255,0.04)',
                  }
                }}
              >
                Create Account
              </Button>
            </Stack>

            {/* Quick Metrics */}
            <Grid container spacing={3} sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {[
                { label: 'Baggage Dispatch', value: '100% Live' },
                { label: 'Seat Swaps Processed', value: '1,420+' },
                { label: 'AI Response SLA', value: '< 1.2s' }
              ].map(stat => (
                <Grid item xs={4} key={stat.label}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#4A6080', letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase' }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#F0F4FF' }}>
                    {stat.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Column: Hero Showcase Visuals */}
          <Grid item xs={12} lg={6} className="animate-slideup" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 500, position: 'relative' }}>
              
              {/* Outer Decorative Glow Orbs */}
              <Box sx={{
                position: 'absolute', top: '-10%', right: '-10%', width: 250, height: 250,
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
                zIndex: 0, pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute', bottom: '-10%', left: '-10%', width: 250, height: 250,
                background: 'radial-gradient(circle, rgba(240, 192, 64, 0.06) 0%, transparent 70%)',
                zIndex: 0, pointerEvents: 'none'
              }} />

              {/* Main Boarding Pass Card Visual */}
              <Card sx={{
                position: 'relative',
                zIndex: 1,
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(11,22,40,0.85), rgba(6,14,31,0.92))',
                border: '1px solid rgba(0,212,255,0.16)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.06)',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                animation: 'tickFloat 6s ease-in-out infinite',
              }}>
                {/* Boarding Pass header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#F0F4FF', letterSpacing: 1 }}>
                      BOARDING PASS
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', px: 1.5, py: 0.3, borderRadius: '99px' }}>
                    <Typography sx={{ color: '#4ADE80', fontSize: '0.55rem', fontWeight: 900, letterSpacing: 1 }}>
                      LIVE ROUTING
                    </Typography>
                  </Box>
                </Box>

                {/* Animated Flight Path */}
                <Box sx={{ width: '100%', height: 110, mt: 1, position: 'relative' }}>
                  <svg viewBox="0 0 340 100" width="100%" height="100%">
                    <path d="M 40 70 Q 170 10 300 70" fill="none" stroke="rgba(0, 212, 255, 0.12)" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 40 70 Q 170 10 300 70" fill="none" stroke="url(#svgRouteGradHero)" strokeWidth="2.5" strokeDasharray="15 15" className="animated-path" />
                    <circle cx="40" cy="70" r="10" fill="#F0C040" opacity="0.15" />
                    <circle cx="40" cy="70" r="4" fill="#F0C040" />
                    <circle cx="300" cy="70" r="10" fill="#00D4FF" opacity="0.15" />
                    <circle cx="300" cy="70" r="4" fill="#00D4FF" />
                    <defs>
                      <linearGradient id="svgRouteGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F0C040" />
                        <stop offset="100%" stopColor="#00D4FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, position: 'absolute', bottom: 5, left: 0, right: 0 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 950, fontSize: '1.5rem', color: '#F0F4FF', lineHeight: 1 }}>JFK</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: '#4A6080' }}>New York</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', alignSelf: 'center', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.55rem', color: '#3A5070', letterSpacing: 1.5 }}>NON-STOP</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 950, fontSize: '1.5rem', color: '#F0F4FF', lineHeight: 1 }}>LAX</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: '#4A6080' }}>Los Angeles</Typography>
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
              </Card>

              {/* Smaller floating side card (AI Assist mock) */}
              <Card sx={{
                position: 'absolute',
                bottom: '-40px',
                right: '-20px',
                zIndex: 2,
                p: 2,
                width: 220,
                borderRadius: '16px',
                background: 'rgba(2, 8, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(240,192,64,0.2)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg) translateZ(30px)'
              }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ADE80' }} />
                    <Typography sx={{ fontSize: '0.65rem', color: '#4ADE80', fontWeight: 800 }}>AI Travel Advisor</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#8BA3C7', lineHeight: 1.4 }}>
                    "Your gate changed from T8-4 to T8-6. Follow path to terminal walkway."
                  </Typography>
                </Stack>
              </Card>

              {/* Staff badge tracking side card */}
              <Card sx={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                zIndex: 2,
                p: 2,
                width: 180,
                borderRadius: '16px',
                background: 'rgba(2, 8, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,212,255,0.2)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg) translateZ(40px)'
              }}>
                <Stack spacing={0.5}>
                  <Typography sx={{ fontSize: '0.55rem', color: '#4A6080', fontWeight: 700 }}>LIVE RFID STATUS</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#00D4FF', fontWeight: 800 }}>Bag IN-TRANSIT</Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#8BA3C7' }}>Belt 4 · Updated 2m ago</Typography>
                </Stack>
              </Card>

            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── Features Grid Section ─────────────────────────────── */}
      <Box sx={{ bgcolor: 'rgba(6, 14, 31, 0.4)', borderTop: '1px solid rgba(0,212,255,0.05)', py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#F0F4FF' }}>
            Core Capabilities Built For Jetsetters
          </Typography>

          <Grid container spacing={4}>
            {features.map((feat) => (
              <Grid item xs={12} md={4} key={feat.title}>
                <Card sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: '20px',
                  background: 'rgba(11, 22, 40, 0.4)',
                  border: '1px solid rgba(0, 212, 255, 0.06)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'rgba(0, 212, 255, 0.15)',
                    background: 'rgba(11, 22, 40, 0.55)',
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Box sx={{ mb: 2.5 }}>{feat.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800, color: '#F0F4FF', fontSize: '1.15rem' }}>
                    {feat.title}
                  </Typography>
                  <Typography sx={{ color: '#8BA3C7', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Demo Access Portals Quick-Link ───────────────────── */}
      <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Card sx={{
          p: { xs: 4, md: 6 },
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(6,14,31,0.7) 0%, rgba(11,22,40,0.6) 100%)',
          border: '1px solid rgba(240,192,64,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle line background */}
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, #00D4FF 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }} />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#F0F4FF', mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                  Experience All Perspectives
                </Typography>
                <Typography sx={{ color: '#8BA3C7', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 540 }}>
                  SkyJourney is designed with specialized portals tailored to passenger comfort, flight crew responsiveness, and operations managers. Toggle between them inside the demo.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                  {[
                    { label: 'Admin', role: 'ADMIN', icon: <AdminPanelSettings sx={{ fontSize: 16 }} /> },
                    { label: 'Staff', role: 'STAFF', icon: <Devices sx={{ fontSize: 16 }} /> },
                    { label: 'Passenger', role: 'PASSENGER', icon: <FlightTakeoff sx={{ fontSize: 16 }} /> }
                  ].map((roleItem) => (
                    <Button
                      key={roleItem.label}
                      variant="outlined"
                      size="large"
                      startIcon={roleItem.icon}
                      onClick={() => {
                        navigate('/login');
                      }}
                      sx={{
                        borderRadius: '12px',
                        borderColor: 'rgba(255,255,255,0.08)',
                        color: '#F0F4FF',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#00D4FF',
                          color: '#00D4FF',
                          bgcolor: 'rgba(0,212,255,0.05)'
                        }
                      }}
                    >
                      {roleItem.label} Portal
                    </Button>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>

      {/* ── Footer ────────────────────────────────────────────── */}
      <Box sx={{ mt: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', py: 4, bgcolor: '#020817', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#3A5070' }}>
              © 2026 SkyJourney Airlines · Smart Passenger System v2.1
            </Typography>
            <Stack direction="row" spacing={3}>
              {['Terms of Service', 'Privacy Policy', 'Contact Support'].map((link) => (
                <Typography key={link} sx={{ fontSize: '0.72rem', color: '#4A6080', cursor: 'pointer', '&:hover': { color: '#00D4FF' } }}>
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;
