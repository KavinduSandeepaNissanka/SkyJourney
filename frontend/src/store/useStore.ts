import { create } from 'zustand';

export interface Passenger {
  id: number;
  name: string;
  email: string;
  nationality?: string;
  passportNo?: string;
  role?: 'PASSENGER' | 'STAFF' | 'ADMIN';
}

export interface Flight {
  id: number;
  flightNo: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  gate: string;
  status: string;
}

export interface Seat {
  id: number;
  row: number;
  col: string;
  type: 'WINDOW' | 'MIDDLE' | 'AISLE';
  status: 'AVAILABLE' | 'BOOKED';
}

export interface Booking {
  id: number;
  bookingRef: string;
  flight: Flight;
  seat: Seat | null;
  passengerId?: number; // link to passenger
}

export interface Baggage {
  id: number;
  tagNo: string;
  status: 'CHECKED_IN' | 'LOADED' | 'IN_TRANSIT' | 'ARRIVED' | 'BELT_CLAIM';
  location?: string;
  beltNo?: string;
  bookingId?: number; // link to booking
  weight?: string;
  dimensions?: string;
  type?: string;
}

export interface NotificationMsg {
  id: number;
  type: 'FLIGHT_UPDATE' | 'GATE_CHANGE' | 'BAGGAGE' | 'BOARDING' | 'CONNECTION_RISK' | 'SEAT_EXCHANGE';
  message: string;
  read: boolean;
  createdAt: string;
  passengerId?: number;
}

export interface SeatExchangeRequest {
  id: number;
  fromPassengerId: number;
  fromPassengerName: string;
  fromSeat: string;          // e.g. "12A"
  toSeat: string;            // e.g. "12B"
  toPassengerId: number | null;  // null = unoccupied seat
  toPassengerName: string | null;
  fromBookingId: number;
  toBookingId: number | null;
  flightNo: string;
  status: 'PENDING_ACCEPT' | 'ACCEPTED' | 'STAFF_APPROVED' | 'DECLINED' | 'CANCELLED';
  createdAt: string;
}

// Initial Seeding Mock Datasets
const initialFlights: Flight[] = [
  { id: 1, flightNo: 'SJ-101', origin: 'JFK', destination: 'LAX', departTime: new Date(Date.now() + 3 * 3600000).toISOString(), arriveTime: new Date(Date.now() + 9 * 3600000).toISOString(), gate: 'T8-Gate 4', status: 'BOARDING' },
  { id: 2, flightNo: 'SJ-202', origin: 'LHR', destination: 'JFK', departTime: new Date(Date.now() + 48 * 3600000).toISOString(), arriveTime: new Date(Date.now() + 56 * 3600000).toISOString(), gate: 'T5-Gate B22', status: 'SCHEDULED' },
  { id: 3, flightNo: 'SJ-303', origin: 'JFK', destination: 'LHR', departTime: new Date(Date.now() + 5 * 3600000).toISOString(), arriveTime: new Date(Date.now() + 12 * 3600000).toISOString(), gate: 'Gate B12', status: 'SCHEDULED' }
];

const initialPassengers: Passenger[] = [
  { id: 1, name: 'John Doe', email: 'john@skyjourney.com', nationality: 'American', passportNo: 'US1234567', role: 'PASSENGER', password: 'password' } as any,
  { id: 2, name: 'Jane Smith', email: 'jane@skyjourney.com', nationality: 'British', passportNo: 'UK7654321', role: 'PASSENGER', password: 'password' } as any,
  { id: 3, name: 'Admin Portal', email: 'admin@skyjourney.com', nationality: 'Global', passportNo: 'AD0000001', role: 'ADMIN', password: 'password' } as any,
  { id: 4, name: 'Staff Member', email: 'staff@skyjourney.com', nationality: 'Local', passportNo: 'ST0000002', role: 'STAFF', password: 'password' } as any,
];


const initialBookings: Booking[] = [
  { id: 1, bookingRef: 'REF101', flight: initialFlights[0], seat: { id: 121, row: 12, col: 'A', type: 'WINDOW', status: 'BOOKED' }, passengerId: 1 },
  { id: 2, bookingRef: 'REF102', flight: initialFlights[0], seat: { id: 122, row: 12, col: 'B', type: 'MIDDLE', status: 'BOOKED' }, passengerId: 2 }
];

const initialBaggage: Baggage[] = [
  { id: 1, tagNo: 'BG-998877', status: 'IN_TRANSIT', location: 'Plane Cargo Hold (En Route to LAX)', beltNo: 'Carousel 4', bookingId: 1, weight: '23.5 kg', dimensions: '68×45×25 cm', type: 'Checked Baggage' }
];

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// ── One-time migration: fix old localStorage data ─────────────────────────
if (typeof window !== 'undefined') {
  // 1. Ensure all seeded users have a password
  try {
    const rawUsers = localStorage.getItem('skyjourney_registered');
    if (rawUsers) {
      const users = JSON.parse(rawUsers);
      let changed = false;
      const seedEmails = ['john@skyjourney.com', 'jane@skyjourney.com', 'admin@skyjourney.com', 'staff@skyjourney.com'];
      users.forEach((u: any) => {
        if (seedEmails.includes(u.email) && !u.password) {
          u.password = 'password';
          changed = true;
        }
      });
      if (changed) localStorage.setItem('skyjourney_registered', JSON.stringify(users));
    }
  } catch { /* ignore */ }

  // 2. Fix duplicate seats in bookings
  try {
    const rawBookings = localStorage.getItem('skyjourney_bookings');
    if (rawBookings) {
      const bookings = JSON.parse(rawBookings);
      const seen = new Map<string, number>(); // seatKey -> first booking id
      let changed = false;
      const cols = [
        { col: 'A', type: 'WINDOW' }, { col: 'B', type: 'MIDDLE' }, { col: 'C', type: 'AISLE' },
        { col: 'D', type: 'AISLE' }, { col: 'E', type: 'MIDDLE' }, { col: 'F', type: 'WINDOW' },
      ];
      // Find all taken seat keys
      const allTaken = new Set<string>();
      for (const b of bookings) {
        if (b.seat) allTaken.add(`${b.seat.row}${b.seat.col}`);
      }
      for (const b of bookings) {
        if (!b.seat) continue;
        const key = `${b.seat.row}${b.seat.col}`;
        if (seen.has(key) && seen.get(key) !== b.id) {
          // Duplicate — assign a new free seat
          for (let row = 10; row <= 30; row++) {
            for (const { col, type } of cols) {
              const k = `${row}${col}`;
              if (!allTaken.has(k)) {
                b.seat = { id: Date.now() + Math.random(), row, col, type, status: 'BOOKED' };
                allTaken.add(k);
                changed = true;
                row = 99; // break outer
                break;
              }
            }
          }
        } else {
          seen.set(key, b.id);
        }
      }
      if (changed) localStorage.setItem('skyjourney_bookings', JSON.stringify(bookings));
    }
  } catch { /* ignore */ }
}


interface AppState {
  user: Passenger | null;
  booking: Booking | null;
  baggage: Baggage[];
  notifications: NotificationMsg[];
  wsConnected: boolean;
  seatExchangeRequests: SeatExchangeRequest[];

  // Multi-role central lists
  flights: Flight[];
  bookings: Booking[];
  passengers: Passenger[];
  
  setUser: (user: Passenger | null) => void;
  setBooking: (booking: Booking | null) => void;
  setBaggage: (baggage: Baggage[]) => void;
  updateBaggageStatus: (tagNo: string, status: Baggage['status'], location?: string, beltNo?: string) => void;
  setNotifications: (notifications: NotificationMsg[]) => void;
  addNotification: (notification: NotificationMsg) => void;
  markNotificationAsRead: (id: number) => void;
  setWsConnected: (connected: boolean) => void;
  logout: () => void;
  
  // Seat exchange actions
  addSeatExchangeRequest: (req: SeatExchangeRequest) => void;
  respondToSeatExchange: (id: number, accept: boolean) => void;
  staffApproveSeatExchange: (id: number) => void;
  cancelSeatExchangeRequest: (id: number) => void;

  // Management actions
  setFlights: (flights: Flight[]) => void;
  addFlight: (flight: Flight) => void;
  updateFlight: (flight: Flight) => void;
  deleteFlight: (id: number) => void;

  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: number) => void;

  setPassengers: (passengers: Passenger[]) => void;
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (passenger: Passenger) => void;
}

export const useStore = create<AppState>((set) => {
  const flights = loadFromStorage<Flight[]>('skyjourney_flights', initialFlights);
  const passengers = loadFromStorage<Passenger[]>('skyjourney_registered', initialPassengers);
  const bookings = loadFromStorage<Booking[]>('skyjourney_bookings', initialBookings);
  const baggage = loadFromStorage<Baggage[]>('skyjourney_baggage', initialBaggage);
  const seatExchangeRequests = loadFromStorage<SeatExchangeRequest[]>('skyjourney_seat_exchanges', []);
  const allNotifications = loadFromStorage<NotificationMsg[]>('skyjourney_notifications', []);

  const getInitialNotifications = () => {
    const rawUser = sessionStorage.getItem('skyjourney_user');
    if (!rawUser) return [];
    try {
      const u = JSON.parse(rawUser);
      return allNotifications.filter((n) => n.passengerId === u.id);
    } catch {
      return [];
    }
  };

  return {
    user: sessionStorage.getItem('skyjourney_user') 
      ? JSON.parse(sessionStorage.getItem('skyjourney_user')!) 
      : null,
    booking: sessionStorage.getItem('skyjourney_booking') 
      ? JSON.parse(sessionStorage.getItem('skyjourney_booking')!) 
      : null,
    baggage,
    notifications: getInitialNotifications(),
    wsConnected: false,
    seatExchangeRequests,
    flights,
    bookings,
    passengers,

    setUser: (user) => set(() => {
      if (user) {
        sessionStorage.setItem('skyjourney_user', JSON.stringify(user));
        const allNotifs = JSON.parse(localStorage.getItem('skyjourney_notifications') || '[]');
        const userNotifs = allNotifs.filter((n: any) => n.passengerId === user.id);
        return { user, notifications: userNotifs };
      } else {
        sessionStorage.removeItem('skyjourney_user');
        return { user, notifications: [] };
      }
    }),

    setBooking: (booking) => set(() => {
      if (booking) {
        sessionStorage.setItem('skyjourney_booking', JSON.stringify(booking));
      } else {
        sessionStorage.removeItem('skyjourney_booking');
      }
      return { booking };
    }),

    setBaggage: (baggageList) => set(() => {
      saveToStorage('skyjourney_baggage', baggageList);
      return { baggage: baggageList };
    }),

    updateBaggageStatus: (tagNo, status, location, beltNo) => set((state) => {
      const updatedBaggage = state.baggage.map((b) => 
        b.tagNo === tagNo 
          ? { ...b, status, location: location || b.location, beltNo: beltNo || b.beltNo }
          : b
      );
      saveToStorage('skyjourney_baggage', updatedBaggage);

      // Trigger notification if updated baggage belongs to logged-in user
      const targetBag = updatedBaggage.find((b) => b.tagNo === tagNo);
      let updatedNotifications = [...state.notifications];
      
      if (targetBag && state.booking && targetBag.bookingId === state.booking.id && state.user) {
        const notif: NotificationMsg = {
          id: Date.now(),
          type: 'BAGGAGE',
          message: `Your baggage (${tagNo}) status updated to ${status.replace('_', ' ')}${location ? ` at ${location}` : ''}`,
          read: false,
          createdAt: new Date().toISOString(),
          passengerId: state.user.id
        };
        const allNotifs = JSON.parse(localStorage.getItem('skyjourney_notifications') || '[]');
        saveToStorage('skyjourney_notifications', [notif, ...allNotifs]);
        updatedNotifications = [notif, ...updatedNotifications];
      }

      return { 
        baggage: updatedBaggage, 
        notifications: updatedNotifications 
      };
    }),

    setNotifications: (notifications) => set({ notifications }),

    addNotification: (notification) => set((state) => {
      const passengerId = state.user?.id || 0;
      const notifWithUser = { ...notification, passengerId };
      const allNotifs = JSON.parse(localStorage.getItem('skyjourney_notifications') || '[]');
      saveToStorage('skyjourney_notifications', [notifWithUser, ...allNotifs]);
      return {
        notifications: [notifWithUser, ...state.notifications]
      };
    }),

    markNotificationAsRead: (id) => set((state) => {
      const updatedNotifications = state.notifications.map((n) => 
        n.id === id ? { ...n, read: true } : n
      );
      const allNotifs = JSON.parse(localStorage.getItem('skyjourney_notifications') || '[]');
      const updatedAllNotifs = allNotifs.map((n: any) => 
        n.id === id ? { ...n, read: true } : n
      );
      saveToStorage('skyjourney_notifications', updatedAllNotifs);
      return { notifications: updatedNotifications };
    }),

    setWsConnected: (wsConnected) => set({ wsConnected }),

    logout: () => set(() => {
      sessionStorage.removeItem('skyjourney_user');
      sessionStorage.removeItem('skyjourney_booking');
      return {
        user: null,
        booking: null,
        notifications: [],
        wsConnected: false
      };
    }),

    // Management Actions
    setFlights: (flightsList) => set(() => {
      saveToStorage('skyjourney_flights', flightsList);
      return { flights: flightsList };
    }),

    addFlight: (flight) => set((state) => {
      const updated = [...state.flights, flight];
      saveToStorage('skyjourney_flights', updated);
      return { flights: updated };
    }),

    updateFlight: (flight) => set((state) => {
      const updated = state.flights.map((f) => f.id === flight.id ? flight : f);
      saveToStorage('skyjourney_flights', updated);
      
      // Also update current active user booking if flight matches
      let updatedBooking = state.booking;
      if (state.booking && state.booking.flight.id === flight.id) {
        updatedBooking = { ...state.booking, flight };
        sessionStorage.setItem('skyjourney_booking', JSON.stringify(updatedBooking));
      }

      return { flights: updated, booking: updatedBooking };
    }),

    deleteFlight: (id) => set((state) => {
      const updated = state.flights.filter((f) => f.id !== id);
      saveToStorage('skyjourney_flights', updated);
      return { flights: updated };
    }),

    setBookings: (bookingsList) => set(() => {
      saveToStorage('skyjourney_bookings', bookingsList);
      return { bookings: bookingsList };
    }),

    addBooking: (b) => set((state) => {
      const updated = [...state.bookings, b];
      saveToStorage('skyjourney_bookings', updated);
      return { bookings: updated };
    }),

    updateBooking: (b) => set((state) => {
      const updated = state.bookings.map((item) => item.id === b.id ? b : item);
      saveToStorage('skyjourney_bookings', updated);

      // If active booking changed
      let updatedActive = state.booking;
      if (state.booking && state.booking.id === b.id) {
        updatedActive = b;
        sessionStorage.setItem('skyjourney_booking', JSON.stringify(b));
      }

      return { bookings: updated, booking: updatedActive };
    }),

    deleteBooking: (id) => set((state) => {
      const updated = state.bookings.filter((b) => b.id !== id);
      saveToStorage('skyjourney_bookings', updated);
      return { bookings: updated };
    }),

    setPassengers: (passengersList) => set(() => {
      saveToStorage('skyjourney_registered', passengersList);
      return { passengers: passengersList };
    }),

    addPassenger: (p) => set((state) => {
      const updated = [...state.passengers, p];
      saveToStorage('skyjourney_registered', updated);
      return { passengers: updated };
    }),

    updatePassenger: (p) => set((state) => {
      const updated = state.passengers.map((item) => item.id === p.id ? p : item);
      saveToStorage('skyjourney_registered', updated);

      // If active user is updated
      let updatedUser = state.user;
      if (state.user && state.user.id === p.id) {
        updatedUser = p;
        sessionStorage.setItem('skyjourney_user', JSON.stringify(p));
      }

      return { passengers: updated, user: updatedUser };
    }),

    // ── Seat Exchange Actions ──────────────────────────────────────────────
    addSeatExchangeRequest: (req) => set((state) => {
      const updated = [req, ...state.seatExchangeRequests];
      saveToStorage('skyjourney_seat_exchanges', updated);
      return { seatExchangeRequests: updated };
    }),

    respondToSeatExchange: (id, accept) => set((state) => {
      const updated = state.seatExchangeRequests.map((r) =>
        r.id === id
          ? { ...r, status: (accept ? 'ACCEPTED' : 'DECLINED') as SeatExchangeRequest['status'] }
          : r
      );
      saveToStorage('skyjourney_seat_exchanges', updated);
      return { seatExchangeRequests: updated };
    }),

    staffApproveSeatExchange: (id) => set((state) => {
      const req = state.seatExchangeRequests.find((r) => r.id === id);
      if (!req || req.status !== 'ACCEPTED') return {};

      // Mark the exchange as approved
      const updatedRequests = state.seatExchangeRequests.map((r) =>
        r.id === id ? { ...r, status: 'STAFF_APPROVED' as SeatExchangeRequest['status'] } : r
      );
      saveToStorage('skyjourney_seat_exchanges', updatedRequests);

      // Swap the seats in the bookings list
      const fromBooking = state.bookings.find((b) => b.id === req.fromBookingId);
      const toBooking = req.toBookingId ? state.bookings.find((b) => b.id === req.toBookingId) : null;

      let updatedBookings = [...state.bookings];
      if (fromBooking && toBooking) {
        const fromSeatObj = fromBooking.seat;
        const toSeatObj = toBooking.seat;
        updatedBookings = updatedBookings.map((b) => {
          if (b.id === fromBooking.id) return { ...b, seat: toSeatObj };
          if (b.id === toBooking.id) return { ...b, seat: fromSeatObj };
          return b;
        });
      }
      saveToStorage('skyjourney_bookings', updatedBookings);

      // Update the active session booking if it's one of the affected ones
      let updatedActiveBooking = state.booking;
      if (state.booking) {
        const refreshed = updatedBookings.find((b) => b.id === state.booking!.id);
        if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(state.booking)) {
          updatedActiveBooking = refreshed;
          sessionStorage.setItem('skyjourney_booking', JSON.stringify(refreshed));
        }
      }

      // Push notifications for both passengers
      const notifBase = {
        type: 'SEAT_EXCHANGE' as const,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const notifA: NotificationMsg = {
        ...notifBase,
        id: Date.now(),
        passengerId: req.fromPassengerId,
        message: `Your seat exchange from ${req.fromSeat} to ${req.toSeat} has been approved by staff! ✈️`,
      };

      const allNotifs = JSON.parse(localStorage.getItem('skyjourney_notifications') || '[]');
      const updatedNotifsList = [notifA, ...allNotifs];

      let notifB: NotificationMsg | null = null;
      if (req.toPassengerId) {
        notifB = {
          ...notifBase,
          id: Date.now() + 1,
          passengerId: req.toPassengerId,
          message: `Your seat exchange from ${req.toSeat} to ${req.fromSeat} has been approved by staff! ✈️`,
        };
        updatedNotifsList.unshift(notifB);
      }
      saveToStorage('skyjourney_notifications', updatedNotifsList);

      // Also reload booking from updated bookings list for the active passenger tab if the staff tab has one
      let updatedNotifications = [...state.notifications];
      if (state.user?.id === req.fromPassengerId) {
        updatedNotifications = [notifA, ...updatedNotifications];
      } else if (req.toPassengerId && state.user?.id === req.toPassengerId) {
        if (notifB) updatedNotifications = [notifB, ...updatedNotifications];
      }

      return {
        seatExchangeRequests: updatedRequests,
        bookings: updatedBookings,
        booking: updatedActiveBooking,
        notifications: updatedNotifications,
      };
    }),

    cancelSeatExchangeRequest: (id) => set((state) => {
      const updated = state.seatExchangeRequests.map((r) =>
        r.id === id ? { ...r, status: 'CANCELLED' as SeatExchangeRequest['status'] } : r
      );
      saveToStorage('skyjourney_seat_exchanges', updated);
      return { seatExchangeRequests: updated };
    }),
  };
});

// Listen to localStorage changes in other tabs for real-time synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'skyjourney_baggage') {
      try {
        const newBaggage = JSON.parse(e.newValue || '[]');
        const oldBaggage = useStore.getState().baggage;
        
        useStore.setState({ baggage: newBaggage });
        
        const activeBooking = useStore.getState().booking;
        if (activeBooking) {
          const oldBag = oldBaggage.find(b => b.bookingId === activeBooking.id);
          const newBag = newBaggage.find(b => b.bookingId === activeBooking.id);
          
          if (newBag && (!oldBag || oldBag.status !== newBag.status || oldBag.location !== newBag.location)) {
            const notif: NotificationMsg = {
              id: Date.now(),
              type: 'BAGGAGE',
              message: `Your baggage (${newBag.tagNo}) status updated to ${newBag.status.replace('_', ' ')}${newBag.location ? ` at ${newBag.location}` : ''}`,
              read: false,
              createdAt: new Date().toISOString()
            };
            useStore.setState({
              notifications: [notif, ...useStore.getState().notifications]
            });
          }
        }
      } catch (err) {
        console.error('Error syncing baggage state:', err);
      }
    }
    
    if (e.key === 'skyjourney_flights') {
      try {
        const newFlights = JSON.parse(e.newValue || '[]');
        useStore.setState({ flights: newFlights });
        
        const activeBooking = useStore.getState().booking;
        if (activeBooking) {
          const updatedFlight = newFlights.find(f => f.id === activeBooking.flight.id);
          if (updatedFlight && JSON.stringify(updatedFlight) !== JSON.stringify(activeBooking.flight)) {
            const updatedBooking = { ...activeBooking, flight: updatedFlight };
            sessionStorage.setItem('skyjourney_booking', JSON.stringify(updatedBooking));
            useStore.setState({ booking: updatedBooking });
            
            const notif: NotificationMsg = {
              id: Date.now(),
              type: 'FLIGHT_UPDATE',
              message: `Flight ${updatedFlight.flightNo} status updated to ${updatedFlight.status}`,
              read: false,
              createdAt: new Date().toISOString()
            };
            useStore.setState({
              notifications: [notif, ...useStore.getState().notifications]
            });
          }
        }
      } catch (err) {
        console.error('Error syncing flights state:', err);
      }
    }
    
    if (e.key === 'skyjourney_bookings') {
      try {
        const newBookings = JSON.parse(e.newValue || '[]');
        useStore.setState({ bookings: newBookings });
        
        const activeBooking = useStore.getState().booking;
        if (activeBooking) {
          const updatedBooking = newBookings.find(b => b.id === activeBooking.id);
          if (updatedBooking && JSON.stringify(updatedBooking) !== JSON.stringify(activeBooking)) {
            sessionStorage.setItem('skyjourney_booking', JSON.stringify(updatedBooking));
            useStore.setState({ booking: updatedBooking });
          }
        }
      } catch (err) {
        console.error('Error syncing bookings state:', err);
      }
    }
    
    if (e.key === 'skyjourney_registered') {
      try {
        const newPassengers = JSON.parse(e.newValue || '[]');
        useStore.setState({ passengers: newPassengers });
        
        const activeUser = useStore.getState().user;
        if (activeUser) {
          const updatedUser = newPassengers.find(p => p.id === activeUser.id);
          if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(activeUser)) {
            sessionStorage.setItem('skyjourney_user', JSON.stringify(updatedUser));
            useStore.setState({ user: updatedUser });
          }
        }
      } catch (err) {
        console.error('Error syncing passengers state:', err);
      }
    }

    if (e.key === 'skyjourney_seat_exchanges') {
      try {
        const newRequests = JSON.parse(e.newValue || '[]') as SeatExchangeRequest[];
        useStore.setState({ seatExchangeRequests: newRequests });
      } catch (err) {
        console.error('Error syncing seat exchange state:', err);
      }
    }

    if (e.key === 'skyjourney_notifications') {
      try {
        const newNotifs = JSON.parse(e.newValue || '[]') as NotificationMsg[];
        const activeUser = useStore.getState().user;
        if (activeUser) {
          const userNotifs = newNotifs.filter((n) => n.passengerId === activeUser.id);
          useStore.setState({ notifications: userNotifs });
        }
      } catch (err) {
        console.error('Error syncing notifications state:', err);
      }
    }
  });
}
