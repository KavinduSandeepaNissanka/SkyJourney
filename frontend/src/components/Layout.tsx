import { useState, useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalMall as BaggageIcon,
  Map as MapIcon,
  EventSeat as SeatIcon,
  SmartToy as ChatIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  FlightTakeoff,
  Circle,
  LocalMall as LuggageIcon,
  SwapHoriz as SeatExchangeIcon,
} from '@mui/icons-material';

const drawerWidth = 256;

const getNavItems = (role?: string) => {
  if (role === 'ADMIN') {
    return [
      { text: 'Admin Console', icon: <DashboardIcon />, path: '/dashboard', color: '#00D4FF' },
      { text: 'Manage Center', icon: <SeatIcon />, path: '/admin/manage', color: '#A78BFA' }
    ];
  }
  if (role === 'STAFF') {
    return [
      { text: 'Staff Dashboard', icon: <DashboardIcon />, path: '/dashboard', color: '#00D4FF' },
      { text: 'Baggage Updates', icon: <BaggageIcon />, path: '/staff/baggage', color: '#F0C040' }
    ];
  }
  return [
    { text: 'Journey Dashboard', icon: <DashboardIcon />, path: '/dashboard', color: '#00D4FF' },
    { text: 'Baggage Tracking', icon: <BaggageIcon />, path: '/baggage', color: '#F0C040' },
    { text: 'Airport Navigation', icon: <MapIcon />, path: '/navigation', color: '#4ADE80' },
    { text: 'Seat Exchange', icon: <SeatIcon />, path: '/seats', color: '#A78BFA' },
    { text: 'AI Travel Assistant', icon: <ChatIcon />, path: '/chat', color: '#FB923C' }
  ];
};

const getRoleBadge = (role?: string) => {
  if (role === 'ADMIN') {
    return {
      label: 'ADMINISTRATOR',
      color: '#F43F5E',
      bg: 'rgba(244,63,94,0.12)',
      border: 'rgba(244,63,94,0.3)'
    };
  }
  if (role === 'STAFF') {
    return {
      label: 'AIRPORT STAFF',
      color: '#4ADE80',
      bg: 'rgba(74,222,128,0.12)',
      border: 'rgba(74,222,128,0.3)'
    };
  }
  return {
    label: 'FIRST CLASS MEMBER',
    color: '#F0C040',
    bg: 'rgba(240,192,64,0.12)',
    border: 'rgba(240,192,64,0.25)'
  };
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, notifications, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

  // ── Real-time notification toast ──────────────────────────────────────────
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'BAGGAGE' | 'SEAT_EXCHANGE'>('BAGGAGE');
  const lastNotifIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    // Only fire toast for new unread BAGGAGE or SEAT_EXCHANGE notifications
    if (!latest.read && latest.id !== lastNotifIdRef.current &&
      (latest.type === 'BAGGAGE' || latest.type === 'SEAT_EXCHANGE')) {
      lastNotifIdRef.current = latest.id;
      setToastMessage(latest.message);
      setToastType(latest.type === 'SEAT_EXCHANGE' ? 'SEAT_EXCHANGE' : 'BAGGAGE');
      setToastOpen(true);
    }
  }, [notifications]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenUserMenu = (e: MouseEvent<HTMLElement>) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNotifMenu = (e: MouseEvent<HTMLElement>) => setAnchorElNotif(e.currentTarget);
  const handleCloseNotifMenu = () => setAnchorElNotif(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const items = getNavItems(user?.role);
  const currentPage = items.find(item => item.path === location.pathname);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background glow */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Logo */}
      <Box sx={{ px: 2.5, py: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(240,192,64,0.1) 100%)',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,212,255,0.15)',
            flexShrink: 0,
          }}>
            <FlightTakeoff sx={{ color: '#00D4FF', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{
              fontWeight: 900, letterSpacing: 1.5, fontSize: '1rem',
              background: 'linear-gradient(90deg, #F0C040 0%, #00D4FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}>
              SKYJOURNEY
            </Typography>
            <Typography sx={{ fontSize: '0.62rem', color: '#4A6080', letterSpacing: 2, fontWeight: 600, textTransform: 'uppercase' }}>
              AI Companion
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User card */}
      {user && (
        <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 2.5, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #F0C040, #00D4FF)',
              color: '#020817',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}>
              {user.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2, color: '#F0F4FF' }} noWrap>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#8BA3C7' }} noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getRoleBadge(user?.role).label}
            size="small"
            sx={{
              mt: 1.5, height: 20, fontSize: '0.62rem', fontWeight: 700, letterSpacing: 0.8,
              background: getRoleBadge(user?.role).bg,
              color: getRoleBadge(user?.role).color,
              border: `1px solid ${getRoleBadge(user?.role).border}`,
              borderRadius: '6px',
            }}
          />
        </Box>
      )}

      <Divider sx={{ mx: 2, mb: 1.5, borderColor: 'rgba(0,212,255,0.06)' }} />

      {/* Nav section label */}
      <Typography sx={{ px: 3, mb: 1, fontSize: '0.6rem', letterSpacing: 2, color: '#3A5070', fontWeight: 700, textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
        Navigation
      </Typography>

      {/* Nav Items */}
      <List sx={{ px: 1.5, py: 0, flexGrow: 1, position: 'relative', zIndex: 1 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                id={`nav-${item.path.replace('/', '')}`}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: '10px',
                  px: 1.5, py: 1.1,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: isActive ? `${item.color}14` : 'transparent',
                  borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive ? `${item.color}1A` : 'rgba(255,255,255,0.03)',
                  },
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 80% 60% at 10% 50%, ${item.color}0F 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  } : {},
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <ListItemIcon sx={{
                  color: isActive ? item.color : '#4A6080',
                  minWidth: 36,
                  transition: 'color 0.2s',
                  '& svg': { fontSize: 20 },
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    color: isActive ? '#F0F4FF' : '#8BA3C7',
                    sx: { transition: 'all 0.2s' }
                  }}
                />
                {isActive && (
                  <Circle sx={{ fontSize: 6, color: item.color, opacity: 0.8, mr: 0.5 }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom: Sign Out */}
      <Box sx={{ p: 1.5, position: 'relative', zIndex: 1 }}>
        <Divider sx={{ mb: 1.5, borderColor: 'rgba(0,212,255,0.06)' }} />
        <ListItemButton
          id="nav-signout"
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            px: 1.5, py: 1.1,
            color: '#F43F5E',
            '&:hover': { backgroundColor: 'rgba(244, 63, 94, 0.08)' },
          }}
        >
          <ListItemIcon sx={{ color: '#F43F5E', minWidth: 36 }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: '#F43F5E' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              id="mobile-menu-btn"
              sx={{ display: { sm: 'none' }, color: '#8BA3C7' }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" noWrap sx={{
                fontWeight: 800,
                fontSize: '1rem',
                color: '#F0F4FF',
                letterSpacing: 0.2,
              }}>
                {currentPage?.text || 'SkyJourney AI'}
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#4A6080', display: { xs: 'none', sm: 'block' } }}>
                SkyJourney Airlines — Smart Passenger Portal
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Live status indicator */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center', gap: 0.8,
              px: 1.5, py: 0.6, borderRadius: '20px',
              background: 'rgba(74, 222, 128, 0.08)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              mr: 1,
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80', animation: 'boardingBlink 2s ease-in-out infinite' }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ADE80', letterSpacing: 0.5 }}>
                LIVE
              </Typography>
            </Box>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                id="notifications-btn"
                onClick={handleOpenNotifMenu}
                sx={{
                  color: '#8BA3C7',
                  '&:hover': { color: '#00D4FF', bgcolor: 'rgba(0,212,255,0.08)' },
                  borderRadius: '10px',
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElNotif}
              open={Boolean(anchorElNotif)}
              onClose={handleCloseNotifMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  width: 340, maxHeight: 420,
                  borderRadius: '16px',
                  background: 'rgba(6, 14, 31, 0.95)',
                  border: '1px solid rgba(0,212,255,0.12)',
                  backdropFilter: 'blur(20px)',
                  mt: 1, p: 0,
                }
              }}
            >
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F0F4FF' }}>Notifications</Typography>
              </Box>
              {notifications.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#4A6080', fontSize: '0.85rem' }}>No notifications yet</Typography>
                </Box>
              ) : (
                notifications.map((notif) => (
                  <MenuItem key={notif.id} onClick={handleCloseNotifMenu} sx={{ py: 1.5, px: 2.5, '&:hover': { bgcolor: 'rgba(0,212,255,0.05)' } }}>
                    <Box>
                      <Typography sx={{ fontWeight: notif.read ? 400 : 700, fontSize: '0.85rem', color: '#F0F4FF' }}>
                        {notif.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#4A6080', mt: 0.3 }}>
                        {notif.type.replace('_', ' ')}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* Profile */}
            <Tooltip title="Account settings">
              <IconButton
                id="profile-btn"
                onClick={handleOpenUserMenu}
                sx={{ p: 0.5, borderRadius: '12px', '&:hover': { bgcolor: 'rgba(240,192,64,0.08)' } }}
              >
                <Avatar sx={{
                  width: 34, height: 34,
                  background: 'linear-gradient(135deg, #F0C040, #00D4FF)',
                  color: '#020817',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: '2px solid rgba(240,192,64,0.3)',
                }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  minWidth: 200,
                  borderRadius: '14px',
                  background: 'rgba(6, 14, 31, 0.97)',
                  border: '1px solid rgba(0,212,255,0.12)',
                  backdropFilter: 'blur(20px)',
                  mt: 1,
                }
              }}
            >
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F0F4FF' }}>{user?.name}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#4A6080', mt: 0.3 }}>{user?.email}</Typography>
              </Box>
              <MenuItem
                id="logout-menu-item"
                onClick={handleLogout}
                sx={{ color: '#F43F5E', py: 1.5, px: 2.5, fontWeight: 600, gap: 1.5, '&:hover': { bgcolor: 'rgba(244,63,94,0.08)' } }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} /> Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3.5 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>

      {/* ── Premium Notification Toast ────────────────────────────── */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={5500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': { p: 0 },
          mb: { xs: 1, sm: 2 },
          mr: { xs: 1, sm: 2 },
        }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          icon={false}
          sx={{
            p: 0,
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
            '& .MuiAlert-message': { p: 0, width: '100%' },
            '& .MuiAlert-action': { p: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              px: 2.5, py: 2,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(6,14,31,0.97) 0%, rgba(10,24,48,0.98) 100%)',
              border: `1px solid ${toastType === 'SEAT_EXCHANGE' ? 'rgba(167,139,250,0.25)' : 'rgba(0,212,255,0.25)'}`,
              boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 30px ${toastType === 'SEAT_EXCHANGE' ? 'rgba(167,139,250,0.08)' : 'rgba(0,212,255,0.08)'}`,
              backdropFilter: 'blur(24px)',
              minWidth: 280,
              maxWidth: 360,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow strip */}
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: toastType === 'SEAT_EXCHANGE'
                ? 'linear-gradient(90deg, #A78BFA, #00D4FF)'
                : 'linear-gradient(90deg, #F0C040, #00D4FF)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease infinite',
            }} />

            {/* Icon */}
            <Box sx={{
              width: 38, height: 38, borderRadius: '11px', flexShrink: 0,
              background: toastType === 'SEAT_EXCHANGE'
                ? 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.06))'
                : 'linear-gradient(135deg, rgba(240,192,64,0.15), rgba(240,192,64,0.06))',
              border: `1px solid ${toastType === 'SEAT_EXCHANGE' ? 'rgba(167,139,250,0.3)' : 'rgba(240,192,64,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 16px ${toastType === 'SEAT_EXCHANGE' ? 'rgba(167,139,250,0.15)' : 'rgba(240,192,64,0.15)'}`,
              mt: 0.3,
            }}>
              {toastType === 'SEAT_EXCHANGE'
                ? <SeatExchangeIcon sx={{ color: '#A78BFA', fontSize: 20 }} />
                : <LuggageIcon sx={{ color: '#F0C040', fontSize: 20 }} />}
            </Box>

            {/* Text content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontWeight: 800, fontSize: '0.78rem',
                color: toastType === 'SEAT_EXCHANGE' ? '#A78BFA' : '#F0C040',
                letterSpacing: 0.5, mb: 0.3,
                textTransform: 'uppercase',
              }}>
                {toastType === 'SEAT_EXCHANGE' ? 'Seat Exchange Update' : 'Baggage Status Update'}
              </Typography>
              <Typography sx={{
                fontSize: '0.85rem', color: '#E8F0FF', lineHeight: 1.55,
              }}>
                {toastMessage}
              </Typography>
            </Box>

            {/* Close button */}
            <Box
              onClick={() => setToastOpen(false)}
              sx={{
                cursor: 'pointer', color: '#3A5070', mt: 0.3, flexShrink: 0,
                fontSize: '1.1rem', lineHeight: 1,
                transition: 'color 0.2s',
                '&:hover': { color: '#8BA3C7' },
              }}
            >
              ✕
            </Box>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
