import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Flight, Booking, Passenger, Baggage } from '../store/useStore';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FlightTakeoff,
  People as PeopleIcon,
  ConfirmationNumber,
  LocalMall
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminManagementPage = () => {
  const location = useLocation();
  const {
    flights,
    addFlight,
    updateFlight,
    deleteFlight,
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    passengers,
    addPassenger,
    updatePassenger,
    baggage,
    setBaggage,
  } = useStore();

  // Parse initial tab from query parameter if present
  const query = new URLSearchParams(location.search);
  const tabParam = query.get('tab');
  const initialTab = tabParam ? parseInt(tabParam, 10) : 0;

  const [tabValue, setTabValue] = useState(initialTab);

  useEffect(() => {
    if (tabParam !== null) {
      setTabValue(parseInt(tabParam, 10));
    }
  }, [tabParam]);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // FLIGHTS MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  const [flightOpen, setFlightOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [flightForm, setFlightForm] = useState({
    flightNo: '',
    origin: '',
    destination: '',
    departTime: '',
    arriveTime: '',
    gate: '',
    status: 'SCHEDULED'
  });

  const handleOpenFlight = (flight?: Flight) => {
    if (flight) {
      setEditingFlight(flight);
      setFlightForm({
        flightNo: flight.flightNo,
        origin: flight.origin,
        destination: flight.destination,
        departTime: new Date(flight.departTime).toISOString().slice(0, 16),
        arriveTime: new Date(flight.arriveTime).toISOString().slice(0, 16),
        gate: flight.gate,
        status: flight.status
      });
    } else {
      setEditingFlight(null);
      setFlightForm({
        flightNo: '',
        origin: '',
        destination: '',
        departTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        arriveTime: new Date(Date.now() + 10 * 3600000).toISOString().slice(0, 16),
        gate: '',
        status: 'SCHEDULED'
      });
    }
    setFlightOpen(true);
  };

  const handleSaveFlight = () => {
    if (!flightForm.flightNo || !flightForm.origin || !flightForm.destination) return;

    const flightData: Flight = {
      id: editingFlight ? editingFlight.id : Date.now(),
      flightNo: flightForm.flightNo,
      origin: flightForm.origin,
      destination: flightForm.destination,
      departTime: new Date(flightForm.departTime).toISOString(),
      arriveTime: new Date(flightForm.arriveTime).toISOString(),
      gate: flightForm.gate || 'TBD',
      status: flightForm.status
    };

    if (editingFlight) {
      updateFlight(flightData);
    } else {
      addFlight(flightData);
    }
    setFlightOpen(false);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // PASSENGERS MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  const [passengerOpen, setPassengerOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);
  const [passengerForm, setPassengerForm] = useState({
    name: '',
    email: '',
    password: 'password',
    nationality: '',
    passportNo: '',
    role: 'PASSENGER' as Passenger['role']
  });

  const handleOpenPassenger = (p?: Passenger) => {
    if (p) {
      setEditingPassenger(p);
      setPassengerForm({
        name: p.name,
        email: p.email,
        password: 'password',
        nationality: p.nationality || '',
        passportNo: p.passportNo || '',
        role: p.role || 'PASSENGER'
      });
    } else {
      setEditingPassenger(null);
      setPassengerForm({
        name: '',
        email: '',
        password: 'password',
        nationality: '',
        passportNo: '',
        role: 'PASSENGER'
      });
    }
    setPassengerOpen(true);
  };

  const handleSavePassenger = () => {
    if (!passengerForm.name || !passengerForm.email) return;

    const passengerData: Passenger = {
      id: editingPassenger ? editingPassenger.id : Date.now(),
      name: passengerForm.name,
      email: passengerForm.email,
      nationality: passengerForm.nationality || undefined,
      passportNo: passengerForm.passportNo || undefined,
      role: passengerForm.role
    };

    if (editingPassenger) {
      updatePassenger(passengerData);
    } else {
      // For seeding into custom logins list
      const registered = localStorage.getItem('skyjourney_registered')
        ? JSON.parse(localStorage.getItem('skyjourney_registered')!)
        : [];
      registered.push({ ...passengerData, password: passengerForm.password });
      localStorage.setItem('skyjourney_registered', JSON.stringify(registered));
      addPassenger(passengerData);
    }
    setPassengerOpen(false);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // BOOKINGS MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingForm, setBookingForm] = useState({
    passengerId: '',
    flightId: '',
    bookingRef: '',
    seatRow: 12,
    seatCol: 'C',
    seatType: 'AISLE' as 'WINDOW' | 'MIDDLE' | 'AISLE'
  });

  const handleOpenBooking = (b?: Booking) => {
    if (b) {
      setEditingBooking(b);
      setBookingForm({
        passengerId: String(b.passengerId || ''),
        flightId: String(b.flight.id),
        bookingRef: b.bookingRef,
        seatRow: b.seat?.row || 12,
        seatCol: b.seat?.col || 'A',
        seatType: b.seat?.type || 'AISLE'
      });
    } else {
      setEditingBooking(null);
      setBookingForm({
        passengerId: passengers.length > 0 ? String(passengers[0].id) : '',
        flightId: flights.length > 0 ? String(flights[0].id) : '',
        bookingRef: 'REF' + Math.floor(100 + Math.random() * 900),
        seatRow: Math.floor(Math.random() * 20) + 1,
        seatCol: ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)],
        seatType: 'WINDOW'
      });
    }
    setBookingOpen(true);
  };

  const handleSaveBooking = () => {
    if (!bookingForm.passengerId || !bookingForm.flightId || !bookingForm.bookingRef) return;

    const targetFlight = flights.find(f => f.id === parseInt(bookingForm.flightId));
    if (!targetFlight) return;

    const bookingData: Booking = {
      id: editingBooking ? editingBooking.id : Date.now(),
      bookingRef: bookingForm.bookingRef,
      flight: targetFlight,
      passengerId: parseInt(bookingForm.passengerId),
      seat: {
        id: Date.now() + 1,
        row: bookingForm.seatRow,
        col: bookingForm.seatCol,
        type: bookingForm.seatType,
        status: 'BOOKED'
      }
    };

    if (editingBooking) {
      updateBooking(bookingData);
    } else {
      addBooking(bookingData);
    }
    setBookingOpen(false);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // BAGGAGE MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  const [baggageOpen, setBaggageOpen] = useState(false);
  const [bagForm, setBagForm] = useState({
    bookingId: '',
    tagNo: '',
    weight: '20.0 kg',
    dimensions: '60×40×20 cm',
    type: 'Checked Baggage',
    status: 'CHECKED_IN' as Baggage['status'],
    location: 'Airport Baggage Desk'
  });

  const handleOpenBaggage = () => {
    setBagForm({
      bookingId: bookings.length > 0 ? String(bookings[0].id) : '',
      tagNo: 'BG-' + Math.floor(100000 + Math.random() * 900000),
      weight: '22.0 kg',
      dimensions: '65×42×22 cm',
      type: 'Checked Baggage',
      status: 'CHECKED_IN',
      location: 'Airport Checkin Desk 3'
    });
    setBaggageOpen(true);
  };

  const handleSaveBaggage = () => {
    if (!bagForm.bookingId || !bagForm.tagNo) return;

    const newBag: Baggage = {
      id: Date.now(),
      tagNo: bagForm.tagNo,
      status: bagForm.status,
      location: bagForm.location,
      bookingId: parseInt(bagForm.bookingId),
      weight: bagForm.weight,
      dimensions: bagForm.dimensions,
      type: bagForm.type,
      beltNo: 'Carousel 1'
    };

    const updated = [...baggage, newBag];
    setBaggage(updated);
    setBaggageOpen(false);
  };

  const handleDeleteBaggage = (tagNo: string) => {
    const updated = baggage.filter(b => b.tagNo !== tagNo);
    setBaggage(updated);
  };

  return (
    <Box className="animate-slideup">
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F0F4FF' }}>
            System Management Console
          </Typography>
          <Typography sx={{ color: '#8BA3C7', fontSize: '0.85rem', mt: 0.3 }}>
            Admin controls for flights, bookings, passenger accounts, and baggage telemetry.
          </Typography>
        </Box>
      </Box>

      {/* Tabs Menu */}
      <Card sx={{ border: '1px solid rgba(0,212,255,0.12)', background: 'linear-gradient(135deg, rgba(6,14,31,0.95), rgba(11,22,40,0.9))' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            px: 2,
            '& .MuiTab-root': { py: 2, fontWeight: 700, fontSize: '0.82rem', letterSpacing: 0.5 },
          }}
        >
          <Tab icon={<FlightTakeoff sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Flights" />
          <Tab icon={<ConfirmationNumber sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Bookings" />
          <Tab icon={<PeopleIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Passengers" />
          <Tab icon={<LocalMall sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Baggage" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* FLIGHTS PANEL */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: '#F0F4FF' }}>All Flights</Typography>
              <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={() => handleOpenFlight()}>
                Add Flight
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Flight No</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Origin</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Destination</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Departure</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Gate</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#4A6080' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights.map((f) => (
                    <TableRow key={f.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#F0F4FF' }}>{f.flightNo}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7' }}>{f.origin}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7' }}>{f.destination}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7', fontSize: '0.78rem' }}>{new Date(f.departTime).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: '#F0C040', fontWeight: 700 }}>{f.gate}</TableCell>
                      <TableCell>
                        <Chip
                          label={f.status}
                          size="small"
                          sx={{
                            fontWeight: 800, fontSize: '0.62rem',
                            bgcolor: f.status === 'BOARDING' ? 'rgba(74,222,128,0.1)' : f.status === 'DELAYED' ? 'rgba(255,183,3,0.1)' : 'rgba(0,212,255,0.1)',
                            color: f.status === 'BOARDING' ? '#4ADE80' : f.status === 'DELAYED' ? '#FFB703' : '#00D4FF',
                            border: `1px solid ${f.status === 'BOARDING' ? 'rgba(74,222,128,0.2)' : f.status === 'DELAYED' ? 'rgba(255,183,3,0.2)' : 'rgba(0,212,255,0.2)'}`
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenFlight(f)} sx={{ color: '#00D4FF' }} size="small">
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton onClick={() => deleteFlight(f.id)} sx={{ color: '#F43F5E', ml: 1 }} size="small">
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* BOOKINGS PANEL */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: '#F0F4FF' }}>Passenger Bookings</Typography>
              <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={() => handleOpenBooking()}>
                Create Booking
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Ref Code</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Passenger</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Flight No</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Route</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Seat</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#4A6080' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => {
                    const passenger = passengers.find(p => p.id === b.passengerId);
                    return (
                      <TableRow key={b.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ fontWeight: 800, color: '#F0C040' }}>{b.bookingRef}</TableCell>
                        <TableCell sx={{ color: '#F0F4FF', fontWeight: 600 }}>{passenger?.name || `Passenger #${b.passengerId}`}</TableCell>
                        <TableCell sx={{ color: '#8BA3C7' }}>{b.flight.flightNo}</TableCell>
                        <TableCell sx={{ color: '#8BA3C7', fontSize: '0.78rem' }}>{b.flight.origin} → {b.flight.destination}</TableCell>
                        <TableCell sx={{ color: '#00D4FF', fontWeight: 800 }}>{b.seat ? `${b.seat.row}${b.seat.col}` : 'TBD'}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpenBooking(b)} sx={{ color: '#00D4FF' }} size="small">
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton onClick={() => deleteBooking(b.id)} sx={{ color: '#F43F5E', ml: 1 }} size="small">
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* PASSENGERS PANEL */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: '#F0F4FF' }}>Passenger Accounts</Typography>
              <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={() => handleOpenPassenger()}>
                Add Passenger
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Email Address</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Nationality</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Passport No</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>System Role</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#4A6080' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {passengers.map((p) => (
                    <TableRow key={p.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#F0F4FF' }}>{p.name}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7' }}>{p.email}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7' }}>{p.nationality || '—'}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7' }}>{p.passportNo || '—'}</TableCell>
                      <TableCell sx={{ color: '#8BA3C7' }}>
                        <Chip
                          label={p.role || 'PASSENGER'}
                          size="small"
                          sx={{
                            fontWeight: 800, fontSize: '0.6rem',
                            bgcolor: p.role === 'ADMIN' ? 'rgba(244,63,94,0.1)' : p.role === 'STAFF' ? 'rgba(74,222,128,0.1)' : 'rgba(167,139,250,0.1)',
                            color: p.role === 'ADMIN' ? '#F43F5E' : p.role === 'STAFF' ? '#4ADE80' : '#A78BFA',
                            border: `1px solid ${p.role === 'ADMIN' ? 'rgba(244,63,94,0.2)' : p.role === 'STAFF' ? 'rgba(74,222,128,0.2)' : 'rgba(167,139,250,0.2)'}`
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenPassenger(p)} sx={{ color: '#00D4FF' }} size="small">
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* BAGGAGE PANEL */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: '#F0F4FF' }}>Tracked Baggage</Typography>
              <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={() => handleOpenBaggage()}>
                Register Luggage
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Tag No</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Booking Ref</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Weight / Size</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Tracking Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Last Scan Location</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4A6080' }}>Belt No</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#4A6080' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {baggage.map((bag) => {
                    const bookingItem = bookings.find(b => b.id === bag.bookingId);
                    return (
                      <TableRow key={bag.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ fontWeight: 800, color: '#00D4FF' }}>{bag.tagNo}</TableCell>
                        <TableCell sx={{ color: '#F0C040', fontWeight: 600 }}>{bookingItem?.bookingRef || `Ref #${bag.bookingId}`}</TableCell>
                        <TableCell sx={{ color: '#8BA3C7', fontSize: '0.78rem' }}>{bag.weight || '—'} / {bag.dimensions || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={bag.status.replace('_', ' ')}
                            size="small"
                            sx={{
                              fontWeight: 800, fontSize: '0.62rem',
                              bgcolor: bag.status === 'BELT_CLAIM' ? 'rgba(74,222,128,0.1)' : 'rgba(240,192,64,0.1)',
                              color: bag.status === 'BELT_CLAIM' ? '#4ADE80' : '#F0C040',
                              border: `1px solid ${bag.status === 'BELT_CLAIM' ? 'rgba(74,222,128,0.2)' : 'rgba(240,192,64,0.2)'}`
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#8BA3C7' }}>{bag.location || '—'}</TableCell>
                        <TableCell sx={{ color: '#F0F4FF', fontWeight: 700 }}>{bag.beltNo || '—'}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleDeleteBaggage(bag.tagNo)} sx={{ color: '#F43F5E' }} size="small">
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────────────
          DIALOGS
      ────────────────────────────────────────────────────────────────────────── */}

      {/* FLIGHT DIALOG */}
      <Dialog open={flightOpen} onClose={() => setFlightOpen(false)} PaperProps={{ sx: { background: 'rgba(6, 14, 31, 0.98)', border: '1px solid rgba(0,212,255,0.15)', minWidth: 400 } }}>
        <DialogTitle sx={{ color: '#F0F4FF', fontWeight: 800 }}>{editingFlight ? 'Edit Flight' : 'Add Flight'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Flight Number" fullWidth margin="dense" value={flightForm.flightNo} onChange={(e) => setFlightForm({ ...flightForm, flightNo: e.target.value })} placeholder="SJ-101" />
          <TextField label="Origin Airport" fullWidth margin="dense" value={flightForm.origin} onChange={(e) => setFlightForm({ ...flightForm, origin: e.target.value })} placeholder="JFK" />
          <TextField label="Destination Airport" fullWidth margin="dense" value={flightForm.destination} onChange={(e) => setFlightForm({ ...flightForm, destination: e.target.value })} placeholder="LAX" />
          <TextField type="datetime-local" label="Departure Time" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={flightForm.departTime} onChange={(e) => setFlightForm({ ...flightForm, departTime: e.target.value })} />
          <TextField type="datetime-local" label="Arrival Time" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={flightForm.arriveTime} onChange={(e) => setFlightForm({ ...flightForm, arriveTime: e.target.value })} />
          <TextField label="Terminal / Gate" fullWidth margin="dense" value={flightForm.gate} onChange={(e) => setFlightForm({ ...flightForm, gate: e.target.value })} placeholder="Gate B4" />
          <TextField select label="Status" fullWidth margin="dense" value={flightForm.status} onChange={(e) => setFlightForm({ ...flightForm, status: e.target.value })}>
            {['SCHEDULED', 'BOARDING', 'DELAYED', 'CANCELLED'].map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setFlightOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveFlight} variant="contained" color="secondary">Save Flight</Button>
        </DialogActions>
      </Dialog>

      {/* PASSENGER DIALOG */}
      <Dialog open={passengerOpen} onClose={() => setPassengerOpen(false)} PaperProps={{ sx: { background: 'rgba(6, 14, 31, 0.98)', border: '1px solid rgba(0,212,255,0.15)', minWidth: 400 } }}>
        <DialogTitle sx={{ color: '#F0F4FF', fontWeight: 800 }}>{editingPassenger ? 'Edit Passenger' : 'Add Passenger'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Name" fullWidth margin="dense" value={passengerForm.name} onChange={(e) => setPassengerForm({ ...passengerForm, name: e.target.value })} placeholder="Name" />
          <TextField label="Email" fullWidth margin="dense" value={passengerForm.email} onChange={(e) => setPassengerForm({ ...passengerForm, email: e.target.value })} placeholder="email@skyjourney.com" />
          {!editingPassenger && <TextField label="Password" type="password" fullWidth margin="dense" value={passengerForm.password} onChange={(e) => setPassengerForm({ ...passengerForm, password: e.target.value })} />}
          <TextField label="Nationality" fullWidth margin="dense" value={passengerForm.nationality} onChange={(e) => setPassengerForm({ ...passengerForm, nationality: e.target.value })} placeholder="American" />
          <TextField label="Passport Number" fullWidth margin="dense" value={passengerForm.passportNo} onChange={(e) => setPassengerForm({ ...passengerForm, passportNo: e.target.value })} placeholder="US1234567" />
          <TextField select label="Role" fullWidth margin="dense" value={passengerForm.role} onChange={(e) => setPassengerForm({ ...passengerForm, role: e.target.value as Passenger['role'] })}>
            {['PASSENGER', 'STAFF', 'ADMIN'].map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setPassengerOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePassenger} variant="contained" color="secondary">Save Passenger</Button>
        </DialogActions>
      </Dialog>

      {/* BOOKING DIALOG */}
      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} PaperProps={{ sx: { background: 'rgba(6, 14, 31, 0.98)', border: '1px solid rgba(0,212,255,0.15)', minWidth: 400 } }}>
        <DialogTitle sx={{ color: '#F0F4FF', fontWeight: 800 }}>{editingBooking ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField select label="Passenger" fullWidth margin="dense" value={bookingForm.passengerId} onChange={(e) => setBookingForm({ ...bookingForm, passengerId: e.target.value })}>
            {passengers.map((p) => (
              <MenuItem key={p.id} value={String(p.id)}>{p.name} ({p.email})</MenuItem>
            ))}
          </TextField>
          <TextField select label="Flight" fullWidth margin="dense" value={bookingForm.flightId} onChange={(e) => setBookingForm({ ...bookingForm, flightId: e.target.value })}>
            {flights.map((f) => (
              <MenuItem key={f.id} value={String(f.id)}>{f.flightNo} ({f.origin} → {f.destination})</MenuItem>
            ))}
          </TextField>
          <TextField label="Booking Reference" fullWidth margin="dense" value={bookingForm.bookingRef} onChange={(e) => setBookingForm({ ...bookingForm, bookingRef: e.target.value })} />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField type="number" label="Row" fullWidth margin="dense" value={bookingForm.seatRow} onChange={(e) => setBookingForm({ ...bookingForm, seatRow: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Column" fullWidth margin="dense" value={bookingForm.seatCol} onChange={(e) => setBookingForm({ ...bookingForm, seatCol: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField select label="Type" fullWidth margin="dense" value={bookingForm.seatType} onChange={(e) => setBookingForm({ ...bookingForm, seatType: e.target.value as any })}>
                {['WINDOW', 'MIDDLE', 'AISLE'].map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setBookingOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveBooking} variant="contained" color="secondary">Save Booking</Button>
        </DialogActions>
      </Dialog>

      {/* BAGGAGE DIALOG */}
      <Dialog open={baggageOpen} onClose={() => setBaggageOpen(false)} PaperProps={{ sx: { background: 'rgba(6, 14, 31, 0.98)', border: '1px solid rgba(0,212,255,0.15)', minWidth: 400 } }}>
        <DialogTitle sx={{ color: '#F0F4FF', fontWeight: 800 }}>Register Baggage</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField select label="Assign to Booking" fullWidth margin="dense" value={bagForm.bookingId} onChange={(e) => setBagForm({ ...bagForm, bookingId: e.target.value })}>
            {bookings.map((b) => {
              const passenger = passengers.find(p => p.id === b.passengerId);
              return (
                <MenuItem key={b.id} value={String(b.id)}>{b.bookingRef} — {passenger?.name || `Passenger #${b.passengerId}`}</MenuItem>
              );
            })}
          </TextField>
          <TextField label="Baggage Tag RFID" fullWidth margin="dense" value={bagForm.tagNo} onChange={(e) => setBagForm({ ...bagForm, tagNo: e.target.value })} />
          <TextField label="Weight (e.g. 23 kg)" fullWidth margin="dense" value={bagForm.weight} onChange={(e) => setBagForm({ ...bagForm, weight: e.target.value })} />
          <TextField label="Dimensions (e.g. 70x45x25 cm)" fullWidth margin="dense" value={bagForm.dimensions} onChange={(e) => setBagForm({ ...bagForm, dimensions: e.target.value })} />
          <TextField label="Luggage Type" fullWidth margin="dense" value={bagForm.type} onChange={(e) => setBagForm({ ...bagForm, type: e.target.value })} />
          <TextField label="Last Scan Location" fullWidth margin="dense" value={bagForm.location} onChange={(e) => setBagForm({ ...bagForm, location: e.target.value })} />
          <TextField select label="Status" fullWidth margin="dense" value={bagForm.status} onChange={(e) => setBagForm({ ...bagForm, status: e.target.value as Baggage['status'] })}>
            {['CHECKED_IN', 'LOADED', 'IN_TRANSIT', 'ARRIVED', 'BELT_CLAIM'].map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setBaggageOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveBaggage} variant="contained" color="secondary">Register</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagementPage;
