import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Baggage } from '../store/useStore';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  LocalMall,
  Search as SearchIcon,
  Radar as RadarIcon,
  Update as UpdateIcon,
  PinDrop,
  Info as InfoIcon
} from '@mui/icons-material';

const StaffBaggagePage = () => {
  const { baggage, updateBaggageStatus, bookings, passengers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBag, setSelectedBag] = useState<Baggage | null>(null);

  // Form states for status update
  const [status, setStatus] = useState<Baggage['status']>('CHECKED_IN');
  const [location, setLocation] = useState('');
  const [beltNo, setBeltNo] = useState('');

  // Handle bag selection
  const handleSelectBag = (bag: Baggage) => {
    setSelectedBag(bag);
    setStatus(bag.status);
    setLocation(bag.location || '');
    setBeltNo(bag.beltNo || '');
  };

  // Handle status update submission
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBag) return;

    // Trigger update in store
    updateBaggageStatus(selectedBag.tagNo, status, location, beltNo);

    // Refresh selected bag local state reference
    setSelectedBag({
      ...selectedBag,
      status,
      location,
      beltNo
    });
  };

  // Filter baggage list
  const filteredBaggage = baggage.filter((bag) => {
    const term = searchTerm.toLowerCase();
    const tagMatch = bag.tagNo.toLowerCase().includes(term);
    
    // Find booking
    const booking = bookings.find(b => b.id === bag.bookingId);
    const refMatch = booking ? booking.bookingRef.toLowerCase().includes(term) : false;
    
    // Find passenger
    const passenger = booking ? passengers.find(p => p.id === booking.passengerId) : null;
    const passengerMatch = passenger ? passenger.name.toLowerCase().includes(term) : false;

    return tagMatch || refMatch || passengerMatch;
  });

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'CHECKED_IN': return '#A78BFA';
      case 'LOADED': return '#F0C040';
      case 'IN_TRANSIT': return '#00D4FF';
      case 'ARRIVED': return '#4ADE80';
      case 'BELT_CLAIM': return '#4ADE80';
      default: return '#8BA3C7';
    }
  };

  return (
    <Box className="animate-slideup">
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 46, height: 46, borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.06))',
          border: '1px solid rgba(74,222,128,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(74,222,128,0.1)',
        }}>
          <LocalMall sx={{ color: '#4ADE80', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F0F4FF', lineHeight: 1 }}>
            Baggage RFID Updates
          </Typography>
          <Typography sx={{ color: '#8BA3C7', fontSize: '0.85rem', mt: 0.3 }}>
            Telemetry status dispatcher for checked passenger baggage.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Baggage search & select panel */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#F0F4FF', mb: 2 }}>
              Luggage Search
            </Typography>

            <TextField
              fullWidth
              placeholder="Search Tag, Ref or Passenger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#4A6080' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />

            {filteredBaggage.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.02)', color: '#2A3A50' }}>
                  <InfoIcon />
                </Avatar>
                <Typography sx={{ color: '#3A5070', fontSize: '0.85rem' }}>No matching baggage items</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto', pr: 0.5 }}>
                {filteredBaggage.map((bag) => {
                  const isSelected = selectedBag?.tagNo === bag.tagNo;
                  const bookingItem = bookings.find(b => b.id === bag.bookingId);
                  const passengerItem = bookingItem ? passengers.find(p => p.id === bookingItem.passengerId) : null;
                  
                  return (
                    <Paper
                      key={bag.tagNo}
                      variant="outlined"
                      onClick={() => handleSelectBag(bag)}
                      sx={{
                        mb: 1.5,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #4ADE80' : '1px solid rgba(255,255,255,0.04)',
                        background: isSelected ? 'rgba(74,222,128,0.03)' : 'rgba(255,255,255,0.01)',
                        transition: 'all 0.25s',
                        '&:hover': {
                          borderColor: isSelected ? '#4ADE80' : 'rgba(255,255,255,0.12)',
                          background: isSelected ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.02)'
                        }
                      }}
                    >
                      <ListItem
                        secondaryAction={
                          <Chip
                            label={bag.status.replace('_', ' ')}
                            size="small"
                            sx={{
                              fontSize: '0.58rem', fontWeight: 800,
                              bgcolor: `${getStatusColor(bag.status)}14`,
                              color: getStatusColor(bag.status),
                              border: `1px solid ${getStatusColor(bag.status)}33`
                            }}
                          />
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#F0F4FF' }}>
                              {bag.tagNo}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{ fontSize: '0.72rem', color: '#4A6080', mt: 0.3 }}>
                              Owner: {passengerItem?.name || 'Unknown'} ({bookingItem?.bookingRef || 'No Booking'})
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  );
                })}
              </List>
            )}
          </Card>
        </Grid>

        {/* Telemetry dispatcher panel */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            {!selectedBag ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', py: 8, textAlign: 'center' }}>
                <RadarIcon sx={{ fontSize: 48, color: '#2A3A50', mb: 2, animation: 'spinSlow 10s linear infinite' }} />
                <Typography sx={{ color: '#4A6080', fontWeight: 700, fontSize: '0.95rem' }}>
                  No Baggage Selected
                </Typography>
                <Typography sx={{ color: '#3A5070', fontSize: '0.8rem', mt: 0.5, maxWidth: 280 }}>
                  Select a baggage item from the search queue to update its tracking telemetry.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#F0F4FF', mb: 0.5 }}>
                  Update Telemetry: {selectedBag.tagNo}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#4A6080', mb: 3 }}>
                  RFID Scan details and live location tracking fields.
                </Typography>

                <form onSubmit={handleUpdate}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Luggage Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Baggage['status'])}
                        sx={{ mb: 2 }}
                      >
                        {[
                          { label: 'Checked In', value: 'CHECKED_IN' },
                          { label: 'Loaded into Plane', value: 'LOADED' },
                          { label: 'In Transit / Airborne', value: 'IN_TRANSIT' },
                          { label: 'Arrived at Destination', value: 'ARRIVED' },
                          { label: 'Claim Carousel Active', value: 'BELT_CLAIM' }
                        ].map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Last Scan Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Plane Cargo Hold (En Route to LAX)"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PinDrop sx={{ color: '#4A6080', fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Claim Belt / Carousel"
                        value={beltNo}
                        onChange={(e) => setBeltNo(e.target.value)}
                        placeholder="e.g. Carousel 4"
                        sx={{ mb: 3 }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<UpdateIcon />}
                    sx={{
                      py: 1.4, px: 4, fontWeight: 800, fontSize: '0.88rem',
                      background: 'linear-gradient(135deg, #4ADE80 0%, #0099BB 100%)',
                      color: '#020817',
                      boxShadow: '0 4px 20px rgba(74,222,128,0.2)'
                    }}
                  >
                    Dispatch Live Update
                  </Button>
                </form>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffBaggagePage;
