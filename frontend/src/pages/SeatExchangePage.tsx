import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { SeatExchangeRequest } from '../store/useStore';
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Tooltip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  SwapHoriz,
  Info,
  LocalAirport,
  EventSeat,
  AirlineSeatReclineExtra,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  TaskAlt,
  TouchApp,
  Edit,
} from '@mui/icons-material';

const SeatExchangePage = () => {
  const {
    booking,
    bookings,
    passengers,
    seatExchangeRequests,
    user,
    setBooking,
    addSeatExchangeRequest,
    respondToSeatExchange,
    cancelSeatExchangeRequest,
  } = useStore();

  const [tabIndex, setTabIndex] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    targetSeat: string;
    targetPassengerName: string | null;
    targetBookingId: number | null;
    targetPassengerId: number | null;
  }>({ open: false, targetSeat: '', targetPassengerName: null, targetBookingId: null, targetPassengerId: null });
  const [toastMsg, setToastMsg] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  // Mode: 'selecting' = user is choosing their seat, 'exchange' = seat is set, ready to swap
  const hasSeat = !!(booking?.seat);
  const [isSelectingMode, setIsSelectingMode] = useState(!hasSeat);

  const rows = [10, 11, 12, 13, 14];
  const getSeatClass = (row: number) => row === 10 ? 'FIRST' : row === 11 ? 'BUSINESS' : 'ECONOMY';

  // Derive occupied seats from the bookings list
  const getBookingForSeat = (row: number, col: string) => {
    const seatStr = `${row}${col}`;
    return bookings.find((b) => b.seat && `${b.seat.row}${b.seat.col}` === seatStr) || null;
  };

  const getSeatStatus = (row: number, col: string) => {
    if (booking?.seat?.row === row && booking?.seat?.col === col) return 'MINE';
    const b = getBookingForSeat(row, col);
    if (b) return 'OCCUPIED';
    return 'AVAILABLE';
  };

  const mySeatStr = booking?.seat ? `${booking.seat.row}${booking.seat.col}` : null;

  // ── Handle seat selection (Step 1) ──────────────────────────────────
  const handleSelectMySeat = (row: number, col: string) => {
    const status = getSeatStatus(row, col);
    // Can only select an AVAILABLE seat as your own
    if (status === 'OCCUPIED') {
      setToastMsg('That seat is already taken by another passenger. Choose an available seat.');
      setToastOpen(true);
      return;
    }
    if (status === 'MINE') return;

    const seatType: 'WINDOW' | 'MIDDLE' | 'AISLE' =
      col === 'A' || col === 'F' ? 'WINDOW' : col === 'B' || col === 'E' ? 'MIDDLE' : 'AISLE';

    // Create or update booking with this seat
    const allBookings: any[] = localStorage.getItem('skyjourney_bookings')
      ? JSON.parse(localStorage.getItem('skyjourney_bookings')!)
      : [];

    const newSeat = { id: Date.now(), row, col, type: seatType, status: 'BOOKED' as const };

    if (booking) {
      // Update existing booking
      const updatedBooking = { ...booking, seat: newSeat };
      const updatedBookings = allBookings.map((b: any) => b.id === booking.id ? updatedBooking : b);
      // If the booking isn't in the list yet, add it
      if (!allBookings.find((b: any) => b.id === booking.id)) {
        updatedBookings.push(updatedBooking);
      }
      localStorage.setItem('skyjourney_bookings', JSON.stringify(updatedBookings));
      sessionStorage.setItem('skyjourney_booking', JSON.stringify(updatedBooking));
      setBooking(updatedBooking);
      useStore.setState({ bookings: updatedBookings });
    } else {
      // Create brand new booking
      const newBooking = {
        id: Date.now(),
        bookingRef: 'REF-' + Math.floor(100 + Math.random() * 900),
        flight: { id: 1, flightNo: 'SJ-101', origin: 'JFK', destination: 'LAX', departTime: new Date(Date.now() + 3 * 3600000).toISOString(), arriveTime: new Date(Date.now() + 9 * 3600000).toISOString(), gate: 'T8-Gate 4', status: 'BOARDING' },
        seat: newSeat,
        passengerId: user?.id || 0,
      };
      allBookings.push(newBooking);
      localStorage.setItem('skyjourney_bookings', JSON.stringify(allBookings));
      sessionStorage.setItem('skyjourney_booking', JSON.stringify(newBooking));
      setBooking(newBooking);
      useStore.setState({ bookings: allBookings });
    }

    setIsSelectingMode(false);
    setToastMsg(`Seat ${row}${col} selected! You can now request exchanges with other passengers.`);
    setToastOpen(true);
  };

  // ── Handle exchange request (Step 2) ───────────────────────────────
  const handleSeatClick = (row: number, col: string) => {
    if (isSelectingMode) {
      handleSelectMySeat(row, col);
      return;
    }

    const status = getSeatStatus(row, col);
    if (status === 'MINE') return;

    const targetSeat = `${row}${col}`;
    const targetBooking = getBookingForSeat(row, col);
    const targetPassenger = targetBooking?.passengerId
      ? passengers.find((p) => p.id === targetBooking.passengerId) || null
      : null;

    setConfirmDialog({
      open: true,
      targetSeat,
      targetPassengerName: targetPassenger?.name || null,
      targetBookingId: targetBooking?.id || null,
      targetPassengerId: targetPassenger?.id || null,
    });
  };

  const handleConfirmRequest = () => {
    if (!user || !booking) return;
    const req: SeatExchangeRequest = {
      id: Date.now(),
      fromPassengerId: user.id,
      fromPassengerName: user.name,
      fromSeat: mySeatStr || '—',
      toSeat: confirmDialog.targetSeat,
      toPassengerId: confirmDialog.targetPassengerId,
      toPassengerName: confirmDialog.targetPassengerName,
      fromBookingId: booking.id,
      toBookingId: confirmDialog.targetBookingId,
      flightNo: booking.flight.flightNo,
      status: confirmDialog.targetPassengerId ? 'PENDING_ACCEPT' : 'ACCEPTED',
      createdAt: new Date().toISOString(),
    };
    addSeatExchangeRequest(req);
    setConfirmDialog({ open: false, targetSeat: '', targetPassengerName: null, targetBookingId: null, targetPassengerId: null });
    setToastMsg(confirmDialog.targetPassengerId
      ? `Exchange request sent! Waiting for ${confirmDialog.targetPassengerName || 'occupant'} to accept.`
      : `Unoccupied seat requested — awaiting staff approval.`);
    setToastOpen(true);
  };

  const handleRespond = (id: number, accept: boolean, fromName: string) => {
    respondToSeatExchange(id, accept);
    setToastMsg(accept
      ? `You accepted ${fromName}'s request — waiting for staff approval.`
      : `You declined ${fromName}'s request.`);
    setToastOpen(true);
  };

  const handleCancel = (id: number) => {
    cancelSeatExchangeRequest(id);
    setToastMsg('Exchange request cancelled.');
    setToastOpen(true);
  };

  // My outgoing requests
  const myRequests = seatExchangeRequests.filter((r) => r.fromPassengerId === user?.id);
  // Incoming requests targeting my seat
  const incomingRequests = seatExchangeRequests.filter(
    (r) => r.toPassengerId === user?.id && (r.status === 'PENDING_ACCEPT')
  );

  const classColors: Record<string, { border: string; text: string; bg: string; label: string }> = {
    FIRST: { border: '#F0C040', text: '#F0C040', bg: 'rgba(240,192,64,0.06)', label: 'First Class' },
    BUSINESS: { border: '#A78BFA', text: '#A78BFA', bg: 'rgba(167,139,250,0.06)', label: 'Business' },
    ECONOMY: { border: '#00D4FF', text: '#00D4FF', bg: 'rgba(0,212,255,0.06)', label: 'Economy' },
  };

  const getStatusChip = (status: SeatExchangeRequest['status']) => {
    const map: Record<SeatExchangeRequest['status'], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      PENDING_ACCEPT: { label: 'Awaiting Accept', color: '#FFB703', bg: 'rgba(255,183,3,0.08)', icon: <HourglassEmpty sx={{ fontSize: 12 }} /> },
      ACCEPTED: { label: 'Pending Staff', color: '#00D4FF', bg: 'rgba(0,212,255,0.08)', icon: <HourglassEmpty sx={{ fontSize: 12 }} /> },
      STAFF_APPROVED: { label: 'Approved ✓', color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', icon: <TaskAlt sx={{ fontSize: 12 }} /> },
      DECLINED: { label: 'Declined', color: '#F43F5E', bg: 'rgba(244,63,94,0.08)', icon: <Cancel sx={{ fontSize: 12 }} /> },
      CANCELLED: { label: 'Cancelled', color: '#4A6080', bg: 'rgba(74,96,128,0.08)', icon: <Cancel sx={{ fontSize: 12 }} /> },
    };
    const s = map[status];
    return (
      <Chip
        icon={<Box sx={{ color: `${s.color} !important`, ml: '6px !important' }}>{s.icon}</Box>}
        label={s.label}
        size="small"
        sx={{
          fontWeight: 700, fontSize: '0.62rem', letterSpacing: 0.3,
          bgcolor: s.bg, color: s.color,
          border: `1px solid ${s.color}33`,
        }}
      />
    );
  };

  const renderSeatButton = (row: number, col: string) => {
    const seatNo = `${row}${col}`;
    const status = getSeatStatus(row, col);
    const cls = getSeatClass(row);
    const colors = classColors[cls];

    let borderCol = `${colors.border}55`;
    let fillCol = 'transparent';
    let textCol = colors.text;
    let shadow = 'none';

    if (status === 'MINE') {
      borderCol = colors.border;
      fillCol = colors.bg;
      shadow = `0 0 12px ${colors.border}40`;
    } else if (status === 'OCCUPIED') {
      borderCol = 'rgba(167,139,250,0.35)';
      fillCol = 'rgba(167,139,250,0.05)';
      textCol = '#A78BFA';
    }

    // In selecting mode: available = green glow, occupied = grey disabled
    if (isSelectingMode) {
      if (status === 'AVAILABLE') {
        borderCol = 'rgba(74,222,128,0.5)';
        fillCol = 'rgba(74,222,128,0.04)';
        textCol = '#4ADE80';
      } else if (status === 'OCCUPIED') {
        borderCol = 'rgba(255,255,255,0.08)';
        fillCol = 'rgba(255,255,255,0.02)';
        textCol = '#2A3A50';
      }
    }

    const tooltipLabel = isSelectingMode
      ? status === 'AVAILABLE'
        ? `${seatNo} — ${colors.label} · Click to select as your seat`
        : `${seatNo} — Occupied`
      : status === 'MINE'
        ? `${seatNo} — Your Seat`
        : status === 'OCCUPIED'
          ? `${seatNo} — ${colors.label} · Click to request swap`
          : `${seatNo} — ${colors.label} · Available`;

    return (
      <Tooltip key={col} title={tooltipLabel} arrow placement="top">
        <span>
          <Button
            variant="outlined"
            onClick={() => handleSeatClick(row, col)}
            disabled={
              isSelectingMode
                ? status === 'OCCUPIED' || status === 'MINE'
                : status === 'MINE'
            }
            sx={{
              minWidth: 40, height: 42, p: 0,
              borderColor: borderCol,
              bgcolor: fillCol,
              color: textCol,
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              boxShadow: shadow,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                borderColor: isSelectingMode
                  ? status === 'AVAILABLE' ? '#4ADE80' : borderCol
                  : status === 'MINE' ? colors.border : '#F0C040',
                bgcolor: isSelectingMode
                  ? status === 'AVAILABLE' ? 'rgba(74,222,128,0.08)' : fillCol
                  : status !== 'MINE' ? 'rgba(240,192,64,0.06)' : fillCol,
                transform: 'translateY(-2px) scale(1.05)',
                boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
              },
              '&.Mui-disabled': {
                borderColor: isSelectingMode ? 'rgba(255,255,255,0.05)' : colors.border,
                bgcolor: isSelectingMode ? 'rgba(255,255,255,0.01)' : colors.bg,
                color: isSelectingMode ? '#1A2030' : colors.text,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: '25%', right: '25%',
                height: 3,
                borderRadius: '0 0 4px 4px',
                bgcolor: status === 'MINE' ? colors.border : status === 'OCCUPIED' ? 'rgba(167,139,250,0.5)' : `${colors.border}30`,
              },
            }}
          >
            {col}
          </Button>
        </span>
      </Tooltip>
    );
  };

  return (
    <Box className="animate-slideup">

      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 46, height: 46, borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.06))',
            border: '1px solid rgba(167,139,250,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(167,139,250,0.1)',
          }}>
            <EventSeat sx={{ color: '#A78BFA', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F0F4FF', lineHeight: 1 }}>
              Seat Exchange
            </Typography>
            <Typography sx={{ color: '#8BA3C7', fontSize: '0.85rem', mt: 0.3 }}>
              {isSelectingMode
                ? 'Step 1: Select your seat on the map below'
                : `Your seat: ${mySeatStr} · Click another seat to exchange`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {hasSeat && !isSelectingMode && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit sx={{ fontSize: 16 }} />}
              onClick={() => setIsSelectingMode(true)}
              sx={{
                fontWeight: 700, fontSize: '0.72rem',
                color: '#F0C040', borderColor: 'rgba(240,192,64,0.3)',
                borderRadius: '10px', height: 34,
                '&:hover': { borderColor: '#F0C040', bgcolor: 'rgba(240,192,64,0.06)' },
              }}
            >
              Change Seat
            </Button>
          )}
          <Chip
            icon={<LocalAirport sx={{ color: '#A78BFA !important', fontSize: '16px !important' }} />}
            label="Boeing 787 Dreamliner"
            sx={{
              bgcolor: 'rgba(167,139,250,0.06)',
              color: '#A78BFA',
              border: '1px solid rgba(167,139,250,0.2)',
              fontWeight: 700, fontSize: '0.72rem',
              height: 34, borderRadius: '10px',
            }}
          />
        </Box>
      </Box>

      {/* ── Seat Selection Banner ──────────────────────────────────── */}
      {isSelectingMode && (
        <Card sx={{
          mb: 3, p: 2.5,
          border: '1px solid rgba(74,222,128,0.2)',
          background: 'linear-gradient(135deg, rgba(74,222,128,0.04), rgba(6,14,31,0.6))',
          display: 'flex', alignItems: 'center', gap: 2,
          position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #4ADE80, #00D4FF)' }} />
          <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(74,222,128,0.12)', color: '#4ADE80', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.25)' }}>
            <TouchApp />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#4ADE80' }}>
              Select Your Seat
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#8BA3C7', mt: 0.2 }}>
              Click on any available (green-bordered) seat in the cabin map below to claim it as yours.
              {hasSeat && ' Your current seat will be updated.'}
            </Typography>
          </Box>
          {hasSeat && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsSelectingMode(false)}
              sx={{
                fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
                color: '#4A6080', borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                '&:hover': { borderColor: '#4A6080' },
              }}
            >
              Cancel
            </Button>
          )}
        </Card>
      )}

      <Grid container spacing={3}>

        {/* ── Cabin Seat Map ───────────────────────────────────── */}
        <Grid item xs={12} md={7.5}>
          <Card sx={{ border: `1px solid ${isSelectingMode ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.12)'}`, overflow: 'hidden' }}>
            {/* Cabin header */}
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0,212,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AirlineSeatReclineExtra sx={{ color: isSelectingMode ? '#4ADE80' : '#A78BFA', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F0F4FF' }}>
                  {isSelectingMode ? 'Choose Your Seat' : 'Flight Cabin Layout'}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#3A5070', fontWeight: 600 }}>
                {booking?.flight.flightNo || 'SJ-101'} · {booking?.flight.origin || 'JFK'} → {booking?.flight.destination || 'LAX'}
              </Typography>
            </Box>

            {/* Airplane fuselage */}
            <Box sx={{
              mx: 3, my: 3,
              borderLeft: `3px solid ${isSelectingMode ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)'}`,
              borderRight: `3px solid ${isSelectingMode ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)'}`,
              borderTop: `3px solid ${isSelectingMode ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)'}`,
              borderTopLeftRadius: '120px 100px',
              borderTopRightRadius: '120px 100px',
              background: 'linear-gradient(180deg, rgba(167,139,250,0.03) 0%, rgba(4,11,20,0.5) 100%)',
              px: { xs: 2, md: 5 },
              pt: 6, pb: 4,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <Box sx={{ position: 'absolute', top: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.2 }}>
                <Typography sx={{ fontSize: '0.55rem', letterSpacing: 4, fontWeight: 800, color: '#F0F4FF' }}>
                  FLIGHT DIRECTION
                </Typography>
                <Box sx={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid white', mt: 0.5 }} />
              </Box>

              {/* Column headers */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1, gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, width: 140, justifyContent: 'center' }}>
                  {['A', 'B', 'C'].map(c => (
                    <Typography key={c} sx={{ width: 40, textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#3A5070', letterSpacing: 1 }}>{c}</Typography>
                  ))}
                </Box>
                <Box sx={{ width: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.5rem', color: '#1A2A3A', fontWeight: 700, letterSpacing: 1 }}>AISLE</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, width: 140, justifyContent: 'center' }}>
                  {['D', 'E', 'F'].map(c => (
                    <Typography key={c} sx={{ width: 40, textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#3A5070', letterSpacing: 1 }}>{c}</Typography>
                  ))}
                </Box>
              </Box>

              {/* Seat rows */}
              <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 400 }}>
                {rows.map((row, rowIdx) => {
                  const cls = getSeatClass(row);
                  const showDivider = rowIdx > 0 && getSeatClass(rows[rowIdx - 1]) !== cls;

                  return (
                    <Box key={row}>
                      {showDivider && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                          <Divider sx={{ flex: 1, borderColor: 'rgba(167,139,250,0.1)' }} />
                          <Typography sx={{ fontSize: '0.55rem', color: classColors[cls].text, fontWeight: 700, letterSpacing: 2 }}>
                            {classColors[cls].label.toUpperCase()}
                          </Typography>
                          <Divider sx={{ flex: 1, borderColor: 'rgba(167,139,250,0.1)' }} />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Typography sx={{ width: 20, fontWeight: 900, color: '#2A3A50', textAlign: 'center', fontSize: '0.78rem' }}>
                          {row}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {['A', 'B', 'C'].map(col => renderSeatButton(row, col))}
                        </Box>
                        <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ width: 1, height: 38, borderLeft: '1px dashed rgba(255,255,255,0.04)' }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {['D', 'E', 'F'].map(col => renderSeatButton(row, col))}
                        </Box>
                        <Typography sx={{ width: 20, fontWeight: 900, color: '#2A3A50', textAlign: 'center', fontSize: '0.78rem' }}>
                          {row}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* Legend */}
            <Box sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2.5 }}>
              {[
                ...(isSelectingMode ? [
                  { label: 'Available (click to select)', border: 'rgba(74,222,128,0.5)', fill: 'rgba(74,222,128,0.04)' },
                  { label: 'Occupied', border: 'rgba(255,255,255,0.08)', fill: 'rgba(255,255,255,0.02)' },
                ] : [
                  { label: 'Your Seat', border: '#F0C040', fill: 'rgba(240,192,64,0.08)' },
                  { label: 'First Class', border: '#F0C040', fill: 'transparent' },
                  { label: 'Business', border: '#A78BFA', fill: 'transparent' },
                  { label: 'Economy', border: '#00D4FF', fill: 'transparent' },
                  { label: 'Occupied (click to swap)', border: 'rgba(167,139,250,0.35)', fill: 'rgba(167,139,250,0.05)' },
                ])
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '4px', border: `2px solid ${item.border}`, bgcolor: item.fill }} />
                  <Typography sx={{ fontSize: '0.68rem', color: '#4A6080', fontWeight: 600 }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* ── Exchange Requests Panel ────────────────────────────── */}
        <Grid item xs={12} md={4.5}>
          <Card sx={{ border: '1px solid rgba(167,139,250,0.12)', p: 0, overflow: 'hidden' }}>
            {/* Tabs */}
            <Tabs
              value={tabIndex}
              onChange={(_, v) => setTabIndex(v)}
              sx={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                '& .MuiTab-root': { color: '#4A6080', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none', minHeight: 48 },
                '& .Mui-selected': { color: '#A78BFA' },
                '& .MuiTabs-indicator': { bgcolor: '#A78BFA' },
              }}
            >
              <Tab label="My Requests" />
              <Tab
                label={
                  <Badge badgeContent={incomingRequests.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                    <Box sx={{ pr: incomingRequests.length ? 1.5 : 0 }}>Incoming</Box>
                  </Badge>
                }
              />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* MY REQUESTS TAB */}
              {tabIndex === 0 && (
                <>
                  <Typography sx={{ fontSize: '0.75rem', color: '#4A6080', mb: 2 }}>
                    {isSelectingMode
                      ? 'Select your seat first, then you can send exchange requests.'
                      : 'Click any occupied seat in the map to send an exchange request.'}
                  </Typography>
                  {myRequests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: 'rgba(167,139,250,0.08)', color: '#2A3A50', borderRadius: '16px' }}>
                        <Info sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography sx={{ color: '#3A5070', fontSize: '0.85rem' }}>No exchange requests yet</Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {myRequests.map((req) => (
                        <Paper key={req.id} variant="outlined" sx={{
                          mb: 2, borderRadius: '14px',
                          border: '1px solid rgba(167,139,250,0.1)',
                          transition: 'all 0.25s',
                          '&:hover': { borderColor: 'rgba(167,139,250,0.3)', bgcolor: 'rgba(167,139,250,0.02)' },
                        }}>
                          <ListItem
                            secondaryAction={
                              req.status === 'PENDING_ACCEPT' || req.status === 'ACCEPTED'
                                ? (
                                  <Button
                                    size="small"
                                    onClick={() => handleCancel(req.id)}
                                    sx={{ fontSize: '0.65rem', color: '#F43F5E', borderColor: 'rgba(244,63,94,0.3)', minWidth: 60 }}
                                    variant="outlined"
                                  >
                                    Cancel
                                  </Button>
                                )
                                : getStatusChip(req.status)
                            }
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '12px' }}>
                                <SwapHoriz />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F0F4FF' }}>
                                  {req.fromSeat}
                                  <Box component="span" sx={{ mx: 1, color: '#A78BFA' }}>↔</Box>
                                  {req.toSeat}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography sx={{ fontSize: '0.7rem', color: '#3A5070', mt: 0.3 }}>
                                    {req.toPassengerName ? `With: ${req.toPassengerName}` : 'Unoccupied seat'}
                                  </Typography>
                                  {(req.status === 'PENDING_ACCEPT' || req.status === 'ACCEPTED') && (
                                    <Box sx={{ mt: 0.5 }}>{getStatusChip(req.status)}</Box>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                  )}
                </>
              )}

              {/* INCOMING REQUESTS TAB */}
              {tabIndex === 1 && (
                <>
                  <Typography sx={{ fontSize: '0.75rem', color: '#4A6080', mb: 2 }}>
                    Passengers requesting to swap with your seat.
                  </Typography>
                  {incomingRequests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: 'rgba(74,222,128,0.06)', color: '#2A3A50', borderRadius: '16px' }}>
                        <CheckCircle sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography sx={{ color: '#3A5070', fontSize: '0.85rem' }}>No incoming requests</Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {incomingRequests.map((req) => (
                        <Paper key={req.id} variant="outlined" sx={{
                          mb: 2, borderRadius: '14px',
                          border: '1px solid rgba(74,222,128,0.15)',
                          bgcolor: 'rgba(74,222,128,0.02)',
                          transition: 'all 0.25s',
                        }}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '12px' }}>
                                <SwapHoriz />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F0F4FF' }}>
                                  {req.fromPassengerName}
                                </Typography>
                              }
                              secondary={
                                <Typography sx={{ fontSize: '0.72rem', color: '#4A6080', mt: 0.3 }}>
                                  Wants seat {req.toSeat} (yours) ↔ offers {req.fromSeat}
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Box sx={{ display: 'flex', gap: 1.5, px: 2, pb: 2 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                              onClick={() => handleRespond(req.id, true, req.fromPassengerName)}
                              sx={{
                                fontWeight: 700, fontSize: '0.78rem',
                                background: 'linear-gradient(135deg, #4ADE80, #0099BB)',
                                color: '#020817',
                                boxShadow: '0 3px 12px rgba(74,222,128,0.25)',
                                '&:hover': { background: 'linear-gradient(135deg, #38C96E, #0088AA)' },
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              startIcon={<Cancel sx={{ fontSize: 16 }} />}
                              onClick={() => handleRespond(req.id, false, req.fromPassengerName)}
                              sx={{
                                fontWeight: 700, fontSize: '0.78rem',
                                color: '#F43F5E',
                                borderColor: 'rgba(244,63,94,0.3)',
                                '&:hover': { bgcolor: 'rgba(244,63,94,0.06)', borderColor: '#F43F5E' },
                              }}
                            >
                              Decline
                            </Button>
                          </Box>
                        </Paper>
                      ))}
                    </List>
                  )}
                </>
              )}

              {/* Current Seat Info */}
              {booking?.seat && !isSelectingMode && (
                <Box sx={{
                  mt: 2, p: 2, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(240,192,64,0.06), rgba(240,192,64,0.02))',
                  border: '1px solid rgba(240,192,64,0.15)',
                }}>
                  <Typography sx={{ fontSize: '0.62rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1.5, mb: 1 }}>
                    YOUR CURRENT SEAT
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '12px',
                      bgcolor: 'rgba(240,192,64,0.12)',
                      border: '2px solid rgba(240,192,64,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#F0C040' }}>
                        {booking.seat.row}{booking.seat.col}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#F0F4FF' }}>
                        Row {booking.seat.row}, Column {booking.seat.col}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#4A6080' }}>
                        {booking.seat.type} Seat · {getSeatClass(booking.seat.row)} Class
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ── Confirm Request Dialog ──────────────────────────────── */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(6,14,31,0.98), rgba(10,24,48,0.99))',
            border: '1px solid rgba(167,139,250,0.25)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
            minWidth: 340,
          }
        }}
      >
        {/* Glow strip */}
        <Box sx={{ height: 3, background: 'linear-gradient(90deg, #A78BFA, #00D4FF)', borderRadius: '20px 20px 0 0' }} />

        <DialogTitle sx={{ color: '#F0F4FF', fontWeight: 800, pt: 3, pb: 1 }}>
          Confirm Seat Exchange
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
            {/* From seat */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(240,192,64,0.1)', border: '2px solid rgba(240,192,64,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#F0C040' }}>{mySeatStr}</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.72rem', color: '#4A6080' }}>Your seat</Typography>
            </Box>

            <SwapHoriz sx={{ color: '#A78BFA', fontSize: 28, flexShrink: 0 }} />

            {/* Target seat */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(167,139,250,0.1)', border: '2px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#A78BFA' }}>{confirmDialog.targetSeat}</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.72rem', color: '#4A6080' }}>
                {confirmDialog.targetPassengerName || 'Unoccupied'}
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '0.82rem', color: '#8BA3C7', lineHeight: 1.6, mt: 1 }}>
            {confirmDialog.targetPassengerName
              ? `A request will be sent to ${confirmDialog.targetPassengerName}. Once they accept, staff will review and approve the final swap.`
              : `This seat is unoccupied. Your request will go directly to staff for approval.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            sx={{ color: '#4A6080', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmRequest}
            startIcon={<SwapHoriz />}
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #A78BFA, #6D5BF0)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(167,139,250,0.3)',
              px: 3,
              '&:hover': { background: 'linear-gradient(135deg, #9370E8, #5C4CE0)' },
            }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Action Toast ──────────────────────────────────────────── */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="info"
          sx={{
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(6,14,31,0.97), rgba(10,24,48,0.98))',
            border: '1px solid rgba(167,139,250,0.3)',
            color: '#E8F0FF',
            '& .MuiAlert-icon': { color: '#A78BFA' },
          }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeatExchangePage;
