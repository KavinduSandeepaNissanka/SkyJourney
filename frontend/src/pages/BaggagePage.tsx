import { useStore } from '../store/useStore';
import {
  Box,
  Card,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalMall, PinDrop, Radar, FlightTakeoff, DoneAll, FlightLand, Luggage, CheckCircle, LocalShipping } from '@mui/icons-material';

// Styled step circle
const StepCircle = styled(Box)<{ ownerState: { active?: boolean; completed?: boolean; color?: string } }>(
  ({ ownerState }) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    ...(ownerState.completed && {
      background: 'linear-gradient(135deg, #00D4FF, #0099BB)',
      color: '#020817',
      border: '2px solid rgba(0, 212, 255, 0.5)',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
    }),
    ...(ownerState.active && {
      background: 'linear-gradient(135deg, #F0C040, #C49A20)',
      color: '#020817',
      border: '2px solid rgba(240, 192, 64, 0.6)',
      boxShadow: '0 0 20px rgba(240, 192, 64, 0.4)',
      animation: 'pulseGoldGlow 2.5s ease-in-out infinite',
    }),
    ...(!ownerState.active && !ownerState.completed && {
      background: 'rgba(255,255,255,0.04)',
      color: '#2A3A50',
      border: '2px solid rgba(255,255,255,0.08)',
    }),
  }),
);

const BaggagePage = () => {
  const { booking, baggage } = useStore();

  // Find passenger's baggage associated with their booking, or default to first bag, or fallback to mock
  const userBaggage = baggage.find((b) => b.bookingId === booking?.id) || baggage[0] || {
    tagNo: 'BG-998877',
    status: 'IN_TRANSIT',
    location: 'Plane Cargo Hold (En Route to LAX)',
    beltNo: 'Carousel 4',
    weight: '23.5 kg',
    dimensions: '68×45×25 cm',
    type: 'Checked Baggage',
  };

  const getActiveStep = (status: string) => {
    switch (status) {
      case 'CHECKED_IN': return 0;
      case 'LOADED': return 1;
      case 'IN_TRANSIT': return 2;
      case 'ARRIVED': return 3;
      case 'BELT_CLAIM': return 4;
      default: return 0;
    }
  };

  const currentStep = getActiveStep(userBaggage.status);

  const steps = [
    { 
      label: 'Checked In', 
      desc: 'JFK Desk 4', 
      icon: <DoneAll sx={{ fontSize: 20 }} />, 
      time: '14:32' 
    },
    { 
      label: 'Loaded', 
      desc: 'Cargo Hold', 
      icon: <LocalShipping sx={{ fontSize: 20 }} />, 
      time: '15:10' 
    },
    { 
      label: 'In Transit', 
      desc: 'Airborne', 
      icon: <FlightTakeoff sx={{ fontSize: 20 }} />, 
      time: currentStep > 2 ? 'Completed' : currentStep === 2 ? 'Now' : 'Pending' 
    },
    { 
      label: 'Arrived', 
      desc: currentStep >= 3 ? (userBaggage.location || 'LAX Airfield') : 'LAX Airfield', 
      icon: <FlightLand sx={{ fontSize: 20 }} />, 
      time: currentStep > 3 ? 'Completed' : currentStep === 3 ? 'Now' : 'Pending' 
    },
    { 
      label: 'Claim Belt', 
      desc: userBaggage.beltNo ? `Claim Belt: ${userBaggage.beltNo}` : 'Carousel 4', 
      icon: <Luggage sx={{ fontSize: 20 }} />, 
      time: currentStep === 4 ? 'Now' : 'Pending' 
    },
  ];

  const getActiveStepText = (status: string, location?: string, beltNo?: string) => {
    switch (status) {
      case 'CHECKED_IN':
        return `Your baggage has been checked in at ${location || 'JFK Desk 4'} and is awaiting security clearance.`;
      case 'LOADED':
        return `Your baggage has been successfully loaded into the cargo hold of flight ${booking?.flight.flightNo || 'SJ-101'}.`;
      case 'IN_TRANSIT':
        return `Your baggage is currently airborne in the cargo hold of flight ${booking?.flight.flightNo || 'SJ-101'}, en route to ${booking?.flight.destination || 'LAX'}.`;
      case 'ARRIVED':
        return `Your baggage has arrived at ${location || 'LAX Airfield'} and is being unloaded.`;
      case 'BELT_CLAIM':
        return `Your baggage is ready for pickup at claim belt ${beltNo || 'Carousel 4'}.`;
      default:
        return 'Baggage telemetry active. Tracking in progress.';
    }
  };

  return (
    <Box className="animate-slideup">

      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 46, height: 46, borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(240,192,64,0.15), rgba(240,192,64,0.06))',
            border: '1px solid rgba(240,192,64,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(240,192,64,0.1)',
          }}>
            <LocalMall sx={{ color: '#F0C040', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F0F4FF', lineHeight: 1 }}>
              Baggage Tracking
            </Typography>
            <Typography sx={{ color: '#8BA3C7', fontSize: '0.85rem', mt: 0.3 }}>
              Real-time RFID telemetry for checked-in luggage
            </Typography>
          </Box>
        </Box>
        <Chip
          icon={<Radar sx={{ color: '#00D4FF !important', animation: 'spinSlow 4s linear infinite' }} />}
          label="TELEMETRY ACTIVE"
          sx={{
            bgcolor: 'rgba(0,212,255,0.06)',
            color: '#00D4FF',
            border: '1px solid rgba(0,212,255,0.2)',
            fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5,
            height: 34, borderRadius: '10px',
          }}
        />
      </Box>

      <Grid container spacing={3}>

        {/* ── Bag Info Card ─────────────────────────────────────── */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            p: 3, height: '100%',
            border: '1px solid rgba(240,192,64,0.15)',
            background: 'linear-gradient(135deg, rgba(11,22,40,0.9), rgba(6,14,31,0.95))',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top gradient */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #F0C040, #00D4FF)', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }} />

            <Typography sx={{ fontSize: '0.6rem', color: '#3A5070', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', mb: 2.5 }}>
              Luggage Details
            </Typography>

            {/* Bag tag header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(240,192,64,0.15), rgba(240,192,64,0.06))',
                border: '1px solid rgba(240,192,64,0.25)',
                color: '#F0C040',
              }}>
                <LocalMall />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#F0F4FF', letterSpacing: 1 }}>
                  {userBaggage.tagNo}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#4A6080' }}>
                  RFID Tag — 860 MHz Secure
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(0,212,255,0.06)', mb: 2 }} />

            {/* Details grid */}
            {[
              { label: 'FLIGHT', value: booking?.flight.flightNo || 'SJ-101' },
              { label: 'BOOKING REF', value: booking?.bookingRef || 'REF101' },
              { label: 'WEIGHT', value: userBaggage.weight || '23.5 kg' },
              { label: 'SIZE', value: userBaggage.dimensions || '68×45×25 cm' },
              { label: 'TYPE', value: userBaggage.type || 'Checked Baggage' },
              { label: 'CLAIM BELT', value: userBaggage.beltNo || '—' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <Typography sx={{ fontSize: '0.68rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#F0F4FF' }}>
                  {item.value}
                </Typography>
              </Box>
            ))}

            {/* Live location */}
            <Box sx={{ mt: 2.5, p: 2, borderRadius: '12px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <PinDrop sx={{ color: '#00D4FF', fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.7rem', color: '#00D4FF', fontWeight: 700, letterSpacing: 0.5 }}>
                  LIVE LOCATION
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#8BA3C7', lineHeight: 1.6 }}>
                {userBaggage.location || 'Scan pending...'}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* ── Tracking Timeline ───────────────────────────────── */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, border: '1px solid rgba(0,212,255,0.12)' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#F0F4FF', mb: 0.5 }}>
              Tracking Timeline
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#4A6080', mb: 4 }}>
              Real-time journey of your checked-in baggage
            </Typography>

            {/* Vertical timeline */}
            <Box sx={{ pl: 1 }}>
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isFuture = index > currentStep;

                return (
                  <Box key={step.label} sx={{ display: 'flex', gap: 2.5, position: 'relative', mb: index < steps.length - 1 ? 0 : 0 }}>
                    {/* Vertical connector line */}
                    {index < steps.length - 1 && (
                      <Box sx={{
                        position: 'absolute',
                        left: 23, top: 52,
                        width: 2, height: 'calc(100% - 20px)',
                        background: isCompleted
                          ? 'linear-gradient(to bottom, #00D4FF, #00D4FF)'
                          : isActive
                            ? 'linear-gradient(to bottom, #F0C040, rgba(240,192,64,0.15))'
                            : 'rgba(255,255,255,0.06)',
                        borderRadius: 1,
                      }} />
                    )}

                    {/* Step circle */}
                    <StepCircle ownerState={{ completed: isCompleted, active: isActive }}>
                      {isCompleted ? <CheckCircle sx={{ fontSize: 22 }} /> : step.icon}
                    </StepCircle>

                    {/* Step content */}
                    <Box sx={{ flex: 1, pb: index < steps.length - 1 ? 4 : 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Typography sx={{
                          fontWeight: isActive ? 800 : isCompleted ? 700 : 500,
                          fontSize: '0.95rem',
                          color: isActive ? '#F0C040' : isCompleted ? '#00D4FF' : '#2A3A50',
                        }}>
                          {step.label}
                        </Typography>
                        <Typography sx={{
                          fontSize: '0.7rem', fontWeight: 600,
                          color: isFuture ? '#1A2A3A' : '#4A6080',
                          fontFamily: '"Outfit", monospace',
                        }}>
                          {step.time}
                        </Typography>
                      </Box>
                      <Typography sx={{
                        fontSize: '0.78rem', mt: 0.3,
                        color: isFuture ? '#1A2A3A' : '#4A6080',
                      }}>
                        {step.desc}
                      </Typography>

                      {/* Active step detail card */}
                      {isActive && (
                        <Paper sx={{
                          mt: 1.5, p: 2, borderRadius: '12px',
                          background: 'rgba(240,192,64,0.04)',
                          border: '1px solid rgba(240,192,64,0.15)',
                        }}>
                          <Typography sx={{ fontSize: '0.78rem', color: '#8BA3C7', lineHeight: 1.6 }}>
                            {getActiveStepText(userBaggage.status, userBaggage.location, userBaggage.beltNo)}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* ── Bottom Stats Row ─────────────────────────────────── */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { label: 'Estimated Arrival', value: 'On Time', sub: 'Normal operations', icon: <FlightLand />, color: '#4ADE80' },
              { label: 'Carousel', value: '#4', sub: 'Baggage claim belt', icon: <Luggage />, color: '#F0C040' },
              { label: 'Bag Weight', value: '23.5 kg', sub: 'Under 25 kg limit', icon: <LocalMall />, color: '#00D4FF' },
              { label: 'Security Scan', value: 'Cleared', sub: 'TSA pre-check verified', icon: <CheckCircle />, color: '#A78BFA' },
            ].map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card sx={{ p: 2.5, border: `1px solid ${stat.color}1A`, '&:hover': { borderColor: `${stat.color}44`, transform: 'translateY(-2px)', transition: 'all 0.3s' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: `${stat.color}14`, color: stat.color, borderRadius: '10px' }}>
                      {stat.icon}
                    </Avatar>
                    <Typography sx={{ fontSize: '0.65rem', color: '#4A6080', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: stat.color, lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#3A5070', mt: 0.5 }}>
                    {stat.sub}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BaggagePage;
