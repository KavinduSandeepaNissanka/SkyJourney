import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Divider,
  Button,
  Avatar,
  Paper,
} from '@mui/material';
import {
  FlightTakeoff,
  EventSeat,
  LocalMall,
  Map as MapIcon,
  SmartToy as ChatIcon,
  ConfirmationNumber,
  MeetingRoom,
  ArrowForward,
  AccessTime,
  TrendingUp,
  Person,
} from '@mui/icons-material';

import {
  People as PeopleIcon,
  LocalShipping as ShippingIcon,
  Radar as RadarIcon,
  CheckCircle as CheckedIcon,
  FlightLand as FlightLandIcon,
  Settings as SettingsIcon,
  SwapHoriz,
  TaskAlt,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const getBaggageStatusLabel = (status: string) => {
  switch (status) {
    case 'CHECKED_IN': return 'Checked In';
    case 'LOADED': return 'Loaded';
    case 'IN_TRANSIT': return 'In Transit';
    case 'ARRIVED': return 'Arrived';
    case 'BELT_CLAIM': return 'Claim Belt';
    default: return status.replace(/_/g, ' ');
  }
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, booking, flights, bookings, passengers, baggage, seatExchangeRequests, staffApproveSeatExchange } = useStore();

  // ──────────────────────────────────────────────────────────────────────────
  // 1. ADMIN DASHBOARD VIEW
  // ──────────────────────────────────────────────────────────────────────────
  const renderAdminDashboard = () => {
    const totalFlights = flights.length;
    const totalPassengers = passengers.length;
    const totalBookings = bookings.length;
    const totalBaggage = baggage.length;

    const boardingFlights = flights.filter(f => f.status === 'BOARDING').length;
    const delayedFlights = flights.filter(f => f.status === 'DELAYED').length;
    const scheduledFlights = flights.filter(f => f.status === 'SCHEDULED').length;

    const stats = [
      { label: 'Active Flights', value: totalFlights, sub: `${boardingFlights} Boarding · ${delayedFlights} Delayed`, icon: <FlightTakeoff />, color: '#00D4FF' },
      { label: 'Registered Passengers', value: totalPassengers, sub: 'Global airline companion database', icon: <PeopleIcon />, color: '#F0C040' },
      { label: 'Total Bookings', value: totalBookings, sub: 'Active reservations', icon: <ConfirmationNumber />, color: '#A78BFA' },
      { label: 'Tracked Baggage', value: totalBaggage, sub: 'RFID tags active', icon: <LocalMall />, color: '#4ADE80' },
    ];

    return (
      <Box className="animate-slideup">
        {/* Welcome Banner */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
              Admin Console,{' '}
              <Box component="span" sx={{ background: 'linear-gradient(90deg, #F43F5E, #FB923C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name}
              </Box>
            </Typography>
            <Typography sx={{ color: '#8BA3C7', fontSize: '0.9rem' }}>
              Full system control and analytical insights for SkyJourney Airlines.
            </Typography>
          </Box>
          <Chip
            icon={<SettingsIcon sx={{ color: '#F43F5E !important', fontSize: '16px !important' }} />}
            label="SYSTEM ADMINISTRATOR"
            sx={{
              bgcolor: 'rgba(244,63,94,0.08)',
              color: '#F43F5E',
              border: '1px solid rgba(244,63,94,0.22)',
              fontWeight: 700, fontSize: '0.78rem',
              px: 1, height: 34, borderRadius: '10px',
            }}
          />
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card sx={{ p: 2.5, border: `1px solid ${stat.color}1A`, '&:hover': { borderColor: `${stat.color}44`, transform: 'translateY(-2px)', transition: 'all 0.3s' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: `${stat.color}14`, color: stat.color, borderRadius: '10px' }}>
                    {stat.icon}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.7rem', color: '#4A6080', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    {stat.label}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#3A5070', mt: 0.7 }}>
                  {stat.sub}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Operations breakdown */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, height: '100%', border: '1px solid rgba(0,212,255,0.1)' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0F4FF', mb: 1 }}>
                Flight Operations Status
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4A6080', mb: 3 }}>
                Live dispatch statistics for all flights in system
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  { name: 'Boarding Flights', count: boardingFlights, color: '#4ADE80', percentage: totalFlights ? (boardingFlights / totalFlights) * 100 : 0 },
                  { name: 'Scheduled Flights', count: scheduledFlights, color: '#00D4FF', percentage: totalFlights ? (scheduledFlights / totalFlights) * 100 : 0 },
                  { name: 'Delayed Flights', count: delayedFlights, color: '#FFB703', percentage: totalFlights ? (delayedFlights / totalFlights) * 100 : 0 }
                ].map((item) => (
                  <Box key={item.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.85rem', color: '#8BA3C7', fontWeight: 600 }}>{item.name}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#F0F4FF', fontWeight: 700 }}>{item.count} ({Math.round(item.percentage)}%)</Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                      <Box sx={{ width: `${item.percentage}%`, height: '100%', bgcolor: item.color, borderRadius: 3 }} />
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.04)' }} />

              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/admin/manage')}
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.2, px: 3, fontWeight: 700, fontSize: '0.82rem',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #FB923C 100%)',
                  boxShadow: '0 4px 20px rgba(244,63,94,0.2)'
                }}
              >
                Go to Management Panel
              </Button>
            </Card>
          </Grid>

          {/* Quick Shortcuts */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, height: '100%', border: '1px solid rgba(240,192,64,0.1)' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0F4FF', mb: 1 }}>
                Quick Operations
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4A6080', mb: 3 }}>
                Fast actions for administrator tasks
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { text: 'Manage Flights List', desc: 'Create, modify, and monitor active lines', action: () => navigate('/admin/manage?tab=0'), color: '#00D4FF' },
                  { text: 'Passenger Accounts', desc: 'View database and check security profiles', action: () => navigate('/admin/manage?tab=2'), color: '#F0C040' },
                  { text: 'Baggage Dispatch', desc: 'Track all RFIDs and luggage status logs', action: () => navigate('/admin/manage?tab=3'), color: '#4ADE80' },
                  { text: 'Booking Matrix', desc: 'Map seats and check flight capacity', action: () => navigate('/admin/manage?tab=1'), color: '#A78BFA' }
                ].map((act) => (
                  <Paper
                    key={act.text}
                    onClick={act.action}
                    variant="outlined"
                    sx={{
                      p: 2, cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.04)',
                      background: 'rgba(255,255,255,0.01)',
                      transition: 'all 0.25s',
                      '&:hover': {
                        borderColor: `${act.color}33`,
                        background: 'rgba(255,255,255,0.03)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#F0F4FF' }}>{act.text}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#4A6080', mt: 0.3 }}>{act.desc}</Typography>
                  </Paper>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 2. STAFF DASHBOARD VIEW
  // ──────────────────────────────────────────────────────────────────────────
  const renderStaffDashboard = () => {
    const totalBags = baggage.length;
    const checkedBags = baggage.filter(b => b.status === 'CHECKED_IN').length;
    const loadedBags = baggage.filter(b => b.status === 'LOADED').length;
    const transitBags = baggage.filter(b => b.status === 'IN_TRANSIT').length;
    const arrivedBags = baggage.filter(b => b.status === 'ARRIVED').length;
    const claimBags = baggage.filter(b => b.status === 'BELT_CLAIM').length;

    const stats = [
      { label: 'Checked In', value: checkedBags, icon: <CheckedIcon />, color: '#A78BFA' },
      { label: 'Loaded', value: loadedBags, icon: <ShippingIcon />, color: '#F0C040' },
      { label: 'In Transit', value: transitBags, icon: <FlightTakeoff />, color: '#00D4FF' },
      { label: 'Claim/Arrived', value: arrivedBags + claimBags, icon: <FlightLandIcon />, color: '#4ADE80' },
    ];

    return (
      <Box className="animate-slideup">
        {/* Welcome Banner */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
              Staff Terminal,{' '}
              <Box component="span" sx={{ background: 'linear-gradient(90deg, #4ADE80, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name}
              </Box>
            </Typography>
            <Typography sx={{ color: '#8BA3C7', fontSize: '0.9rem' }}>
              RFID tracking terminal and baggage operations interface.
            </Typography>
          </Box>
          <Chip
            icon={<RadarIcon sx={{ color: '#4ADE80 !important', animation: 'spinSlow 4s linear infinite' }} />}
            label="TELEMETRY DESK ONLINE"
            sx={{
              bgcolor: 'rgba(74,222,128,0.08)',
              color: '#4ADE80',
              border: '1px solid rgba(74,222,128,0.22)',
              fontWeight: 700, fontSize: '0.78rem',
              px: 1, height: 34, borderRadius: '10px',
            }}
          />
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Card sx={{ p: 2.5, border: `1px solid ${stat.color}1A`, '&:hover': { borderColor: `${stat.color}44`, transform: 'translateY(-2px)', transition: 'all 0.3s' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: `${stat.color}14`, color: stat.color, borderRadius: '10px' }}>
                    {stat.icon}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.65rem', color: '#4A6080', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    {stat.label}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#3A5070', mt: 0.5 }}>
                  Baggage items count
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Operations Panel */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, border: '1px solid rgba(74,222,128,0.15)', height: '100%' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0F4FF', mb: 1 }}>
                Telemetry Control Panel
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4A6080', mb: 3.5 }}>
                Perform updates, register RFID changes and log belt claims
              </Typography>

              <Box sx={{ mb: 3.5, p: 2, borderRadius: '12px', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#8BA3C7', lineHeight: 1.6 }}>
                  You are logged into the airport operations terminal. Staff can edit and update baggage statuses in real time. These changes immediately dispatch notifications to the passenger.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => navigate('/staff/baggage')}
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.4, px: 4, fontWeight: 800, fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #4ADE80 0%, #0099BB 100%)',
                  color: '#020817',
                  boxShadow: '0 4px 20px rgba(74,222,128,0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #38C96E 0%, #0088AA 100%)'
                  }
                }}
              >
                Open Baggage Update Panel
              </Button>
            </Card>
          </Grid>

          {/* Quick List baggage */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, border: '1px solid rgba(0,212,255,0.1)', height: '100%' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0F4FF', mb: 1 }}>
                Baggage Queue
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4A6080', mb: 2.5 }}>
                Recent baggage tracking items in system ({totalBags} total)
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {baggage.slice(0, 4).map((bag) => (
                  <Box
                    key={bag.tagNo}
                    sx={{
                      p: 1.5, borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.03)',
                      bgcolor: 'rgba(255,255,255,0.01)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#F0F4FF' }}>{bag.tagNo}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#4A6080' }}>Location: {bag.location || 'Unknown'}</Typography>
                    </Box>
                    <Chip
                      label={bag.status.replace('_', ' ')}
                      size="small"
                      sx={{
                        fontSize: '0.6rem', fontWeight: 800,
                        bgcolor: bag.status === 'BELT_CLAIM' || bag.status === 'ARRIVED' ? 'rgba(74,222,128,0.1)' : 'rgba(0,212,255,0.1)',
                        color: bag.status === 'BELT_CLAIM' || bag.status === 'ARRIVED' ? '#4ADE80' : '#00D4FF',
                        border: `1px solid ${bag.status === 'BELT_CLAIM' || bag.status === 'ARRIVED' ? 'rgba(74,222,128,0.2)' : 'rgba(0,212,255,0.2)'}`
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ── Seat Exchange Approvals ────────────────────────────────── */}
        {(() => {
          const pendingExchanges = seatExchangeRequests.filter((r) => r.status === 'ACCEPTED');
          return (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <SwapHoriz sx={{ color: '#A78BFA', fontSize: 22 }} />
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#F0F4FF' }}>
                  Seat Exchange Approvals
                </Typography>
                {pendingExchanges.length > 0 && (
                  <Chip
                    label={`${pendingExchanges.length} Pending`}
                    size="small"
                    sx={{
                      fontWeight: 800, fontSize: '0.65rem',
                      bgcolor: 'rgba(240,192,64,0.12)',
                      color: '#F0C040',
                      border: '1px solid rgba(240,192,64,0.3)',
                      animation: 'boardingBlink 2s ease-in-out infinite',
                    }}
                  />
                )}
              </Box>

              {pendingExchanges.length === 0 ? (
                <Card sx={{ p: 3, border: '1px solid rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(74,222,128,0.08)', color: '#4ADE80', borderRadius: '12px' }}>
                    <TaskAlt />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#F0F4FF' }}>No pending approvals</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#4A6080' }}>Seat exchange requests approved by passengers will appear here.</Typography>
                  </Box>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {pendingExchanges.map((req) => (
                    <Grid item xs={12} md={6} key={req.id}>
                      <Paper variant="outlined" sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        border: '1px solid rgba(167,139,250,0.2)',
                        background: 'linear-gradient(135deg, rgba(167,139,250,0.04), rgba(6,14,31,0.6))',
                        position: 'relative', overflow: 'hidden',
                        transition: 'all 0.25s',
                        '&:hover': { borderColor: 'rgba(167,139,250,0.4)', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
                      }}>
                        {/* Glow strip */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #A78BFA, #00D4FF)' }} />

                        {/* Flight badge */}
                        <Chip
                          label={req.flightNo}
                          size="small"
                          sx={{ position: 'absolute', top: 14, right: 12, fontSize: '0.6rem', fontWeight: 800, bgcolor: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.2)' }}
                        />

                        {/* Seat swap visual */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, mb: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{
                              width: 52, height: 52, borderRadius: '13px',
                              bgcolor: 'rgba(240,192,64,0.1)', border: '2px solid rgba(240,192,64,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.5,
                            }}>
                              <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#F0C040' }}>{req.fromSeat}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.68rem', color: '#4A6080', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {req.fromPassengerName}
                            </Typography>
                          </Box>

                          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <Box sx={{ flex: 1, height: 1, borderTop: '1px dashed rgba(167,139,250,0.3)' }} />
                              <SwapHoriz sx={{ color: '#A78BFA', fontSize: 22, mx: 0.5 }} />
                              <Box sx={{ flex: 1, height: 1, borderTop: '1px dashed rgba(167,139,250,0.3)' }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.6rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1 }}>EXCHANGE</Typography>
                          </Box>

                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{
                              width: 52, height: 52, borderRadius: '13px',
                              bgcolor: 'rgba(167,139,250,0.1)', border: '2px solid rgba(167,139,250,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.5,
                            }}>
                              <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#A78BFA' }}>{req.toSeat}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.68rem', color: '#4A6080', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {req.toPassengerName || 'Unoccupied'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<TaskAlt sx={{ fontSize: 16 }} />}
                            onClick={() => staffApproveSeatExchange(req.id)}
                            sx={{
                              fontWeight: 800, fontSize: '0.78rem',
                              background: 'linear-gradient(135deg, #4ADE80, #0099BB)',
                              color: '#020817',
                              boxShadow: '0 3px 14px rgba(74,222,128,0.25)',
                              '&:hover': { background: 'linear-gradient(135deg, #38C96E, #0088AA)' },
                            }}
                          >
                            Approve Swap
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                            onClick={() => {
                              const { cancelSeatExchangeRequest } = useStore.getState();
                              cancelSeatExchangeRequest(req.id);
                            }}
                            sx={{
                              fontWeight: 700, fontSize: '0.78rem',
                              color: '#F43F5E',
                              borderColor: 'rgba(244,63,94,0.3)',
                              minWidth: 100,
                              '&:hover': { bgcolor: 'rgba(244,63,94,0.06)', borderColor: '#F43F5E' },
                            }}
                          >
                            Decline
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          );
        })()}
      </Box>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 3. PASSENGER DASHBOARD VIEW (Original view)
  // ──────────────────────────────────────────────────────────────────────────
  const renderPassengerDashboard = () => {
    if (!booking) {
      return (
        <Box sx={{ py: 8, textAlign: 'center' }} className="animate-slideup">
          <Box sx={{ width: 80, height: 80, borderRadius: '24px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 36 }} />
          </Box>
          <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 800 }}>No active bookings</Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
            Your account is active, but you do not have any boarding passes seeded.
          </Typography>
        </Box>
      );
    }

    const { flight, seat, bookingRef } = booking;
    const formatTime = (t: string) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatDate = (t: string) => new Date(t).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    const statusColor: Record<string, string> = {
      BOARDING: '#4ADE80',
      SCHEDULED: '#00D4FF',
      DELAYED: '#FFB703',
      CANCELLED: '#F43F5E',
    };
    const statusBg: Record<string, string> = {
      BOARDING: 'rgba(74,222,128,0.1)',
      SCHEDULED: 'rgba(0,212,255,0.1)',
      DELAYED: 'rgba(255,183,3,0.1)',
      CANCELLED: 'rgba(244,63,94,0.1)',
    };
    const color = statusColor[flight.status] || '#00D4FF';
    const bg = statusBg[flight.status] || 'rgba(0,212,255,0.1)';

    const quickActions = [
      { label: 'Baggage Tracker', desc: 'Track your bag in real time', path: '/baggage', icon: <LocalMall />, accentColor: '#F0C040', gradientFrom: 'rgba(240,192,64,0.08)', gradientTo: 'rgba(240,192,64,0.02)' },
      { label: 'Airport Navigation', desc: `Navigate to ${flight.gate}`, path: '/navigation', icon: <MapIcon />, accentColor: '#4ADE80', gradientFrom: 'rgba(74,222,128,0.08)', gradientTo: 'rgba(74,222,128,0.02)' },
      { label: 'Seat Exchange', desc: 'Browse & swap seats', path: '/seats', icon: <EventSeat />, accentColor: '#A78BFA', gradientFrom: 'rgba(167,139,250,0.08)', gradientTo: 'rgba(167,139,250,0.02)' },
      { label: 'AI Travel Assistant', desc: 'Ask anything about your trip', path: '/chat', icon: <ChatIcon />, accentColor: '#FB923C', gradientFrom: 'rgba(251,146,60,0.08)', gradientTo: 'rgba(251,146,60,0.02)' },
    ];

    return (
      <Box className="animate-slideup" sx={{ py: 0.5 }}>
        {/* Welcome Banner */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <Box component="span" sx={{ background: 'linear-gradient(90deg, #F0C040, #FFD966)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name?.split(' ')[0]}
              </Box>
            </Typography>
            <Typography sx={{ color: '#8BA3C7', fontSize: '0.9rem' }}>
              Your concierge portal is live. Safe travels on SkyJourney Airlines.
            </Typography>
          </Box>
          <Chip
            icon={<Person sx={{ color: '#F0C040 !important', fontSize: '16px !important' }} />}
            label="First Class Member"
            sx={{
              bgcolor: 'rgba(240,192,64,0.08)',
              color: '#F0C040',
              border: '1px solid rgba(240,192,64,0.22)',
              fontWeight: 700, fontSize: '0.78rem',
              px: 1, height: 34, borderRadius: '10px',
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Boarding Pass */}
          <Grid item xs={12}>
            <Card sx={{
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(240,192,64,0.18)',
              background: 'linear-gradient(135deg, rgba(11,22,40,0.95) 0%, rgba(6,14,31,0.98) 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(240,192,64,0.04)',
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, #F0C040, #00D4FF, #F0C040)', backgroundSize: '200% 100%', animation: 'gradientShift 4s ease infinite' }} />

              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                <Box sx={{ position: 'absolute', top: '-50%', left: 0, width: '60%', height: '200%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)', animation: 'shimmer 6s ease infinite' }} />
              </Box>

              <Box sx={{
                position: 'absolute', top: 0, right: 0, width: 300, height: '100%', pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(ellipse at 80% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
              }} />

              <Grid container sx={{ position: 'relative', zIndex: 1 }}>
                <Grid item xs={12} md={8} sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '10px', bgcolor: 'rgba(240,192,64,0.12)', border: '1px solid rgba(240,192,64,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FlightTakeoff sx={{ color: '#F0C040', fontSize: 16 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#F0C040', letterSpacing: 1.2 }}>
                          SKYJOURNEY AIRLINES
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#4A6080', letterSpacing: 1 }}>
                          {flight.flightNo} · BOARDING PASS
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      px: 1.5, py: 0.5, borderRadius: '8px',
                      bgcolor: bg, border: `1px solid ${color}33`,
                      animation: flight.status === 'BOARDING' ? 'boardingBlink 2s ease-in-out infinite' : 'none',
                    }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color, letterSpacing: 1.2 }}>
                        {flight.status}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3.5 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: { xs: '3rem', md: '4rem' }, color: '#F0F4FF', lineHeight: 1, letterSpacing: -2 }}>
                        {flight.origin}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#4A6080', fontWeight: 600, mt: 0.5 }}>
                        New York City — JFK
                      </Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0C040', mt: 1.5 }}>
                        {formatTime(flight.departTime)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#4A6080' }}>
                        {formatDate(flight.departTime)}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.6rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                        First Class
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 0 }}>
                        <Box sx={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(240,192,64,0.15), rgba(0,212,255,0.6))' }} />
                        <Box sx={{ px: 1 }}>
                          <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 22, filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.7))', display: 'block' }} />
                        </Box>
                        <Box sx={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,212,255,0.6), rgba(240,192,64,0.15))' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.6rem', color: '#3A5070', fontWeight: 600 }}>
                        NON-STOP · 6h 00m
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 900, fontSize: { xs: '3rem', md: '4rem' }, color: '#F0F4FF', lineHeight: 1, letterSpacing: -2 }}>
                        {flight.destination}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#4A6080', fontWeight: 600, mt: 0.5 }}>
                        Los Angeles — LAX
                      </Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0C040', mt: 1.5 }}>
                        {formatTime(flight.arriveTime)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#4A6080' }}>
                        {formatDate(flight.arriveTime)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(0,212,255,0.1)', mb: 3 }} />

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {[
                      { icon: <MeetingRoom sx={{ fontSize: 16 }} />, label: 'GATE', value: flight.gate, color: '#00D4FF', bg: 'rgba(0,212,255,0.08)' },
                      { icon: <EventSeat sx={{ fontSize: 16 }} />, label: 'SEAT', value: seat ? `${seat.row}${seat.col} · ${seat.type}` : 'TBD', color: '#F0C040', bg: 'rgba(240,192,64,0.08)' },
                      { icon: <ConfirmationNumber sx={{ fontSize: 16 }} />, label: 'BOOKING', value: bookingRef, color: '#A78BFA', bg: 'rgba(167,139,250,0.08)' },
                      { icon: <AccessTime sx={{ fontSize: 16 }} />, label: 'DURATION', value: '6h 00m', color: '#4ADE80', bg: 'rgba(74,222,128,0.08)' },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.8, py: 1, borderRadius: '10px', bgcolor: item.bg, border: `1px solid ${item.color}22` }}>
                        <Box sx={{ color: item.color }}>{item.icon}</Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.55rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1.2 }}>{item.label}</Typography>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#F0F4FF', lineHeight: 1.2 }}>{item.value}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4} sx={{
                  p: { xs: 3, md: 4 },
                  borderLeft: { md: '1px dashed rgba(255,255,255,0.07)' },
                  borderTop: { xs: '1px dashed rgba(255,255,255,0.07)', md: 'none' },
                  bgcolor: 'rgba(255,255,255,0.01)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.6rem', color: '#3A5070', fontWeight: 700, letterSpacing: 2, mb: 2.5, textTransform: 'uppercase' }}>
                      Passenger Receipt
                    </Typography>
                    {[
                      { label: 'PASSENGER', value: user?.name },
                      { label: 'FLIGHT / SEAT', value: `${flight.flightNo} / ${seat ? `${seat.row}${seat.col}` : '—'}` },
                      { label: 'DEPARTURE', value: formatTime(flight.departTime), highlight: true },
                      { label: 'CLASS', value: 'FIRST CLASS' },
                    ].map((item) => (
                      <Box key={item.label} sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: '#2A3A50', letterSpacing: 1.5, fontWeight: 700, mb: 0.3 }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: item.highlight ? '#F0C040' : '#F0F4FF' }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: '2px', height: 32, width: '100%', justifyContent: 'center' }}>
                      {[2, 1, 4, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1].map((w, i) => (
                        <Box key={i} sx={{ width: w, height: '100%', bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: '0.6rem', color: '#2A3A50', letterSpacing: 2, fontFamily: 'monospace' }}>
                      * {bookingRef} *
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12}>
            {(() => {
              const userBag = baggage.find((b) => b.bookingId === booking?.id) || baggage[0];
              const bagStatusLabel = userBag ? getBaggageStatusLabel(userBag.status) : '—';
              const bagSubLabel = userBag?.location ? userBag.location : 'RFID telemetry active';
              const stats = [
                { label: 'Departure in', value: '3h 00m', sub: 'On-time departure', icon: <AccessTime />, color: '#00D4FF' },
                { label: 'Gate Opens', value: '30 min', sub: 'Before departure', icon: <MeetingRoom />, color: '#F0C040' },
                { label: 'Baggage', value: bagStatusLabel, sub: bagSubLabel, icon: <LocalMall />, color: '#4ADE80' },
                { label: 'On-time Score', value: '97%', sub: 'Historical accuracy', icon: <TrendingUp />, color: '#A78BFA' },
              ];
              return (
                <Grid container spacing={2}>
                  {stats.map((stat) => (
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
                        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: stat.color, lineHeight: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#3A5070', mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stat.sub}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              );
            })()}
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#F0F4FF', letterSpacing: 0.3 }}>
              Concierge Services
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={12} sm={6} lg={3} key={action.path}>
                  <Card
                    id={`action-${action.path.replace('/', '')}`}
                    onClick={() => navigate(action.path)}
                    className="quick-action-card"
                    sx={{
                      p: 2.5, cursor: 'pointer',
                      border: `1px solid rgba(255,255,255,0.06)`,
                      background: `linear-gradient(135deg, ${action.gradientFrom} 0%, ${action.gradientTo} 100%)`,
                      '&:hover': {
                        border: `1px solid ${action.accentColor}33`,
                        boxShadow: `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${action.accentColor}15`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar sx={{ width: 44, height: 44, bgcolor: `${action.accentColor}14`, color: action.accentColor, borderRadius: '12px', border: `1px solid ${action.accentColor}22` }}>
                        {action.icon}
                      </Avatar>
                      <ArrowForward sx={{ color: '#3A5070', fontSize: 18, mt: 0.5, transition: 'all 0.2s', '.MuiCard-root:hover &': { color: action.accentColor, transform: 'translateX(3px)' } }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#F0F4FF', mb: 0.5 }}>
                      {action.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#4A6080', lineHeight: 1.5 }}>
                      {action.desc}
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

  // Switch rendering based on role
  if (user?.role === 'ADMIN') {
    return renderAdminDashboard();
  }
  if (user?.role === 'STAFF') {
    return renderStaffDashboard();
  }
  return renderPassengerDashboard();
};

export default DashboardPage;
