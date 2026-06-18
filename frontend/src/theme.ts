import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0B1628',
      dark: '#020817',
      light: '#0F2040',
      contrastText: '#F0F4FF',
    },
    secondary: {
      main: '#F0C040',    // Premium gold
      dark: '#C49A20',
      light: '#FFD966',
      contrastText: '#020817',
    },
    info: {
      main: '#00D4FF',    // Sky cyan
      dark: '#0099BB',
      light: '#80EAFF',
      contrastText: '#020817',
    },
    background: {
      default: '#020817',
      paper: 'rgba(11, 22, 40, 0.72)',
    },
    text: {
      primary: '#F0F4FF',
      secondary: '#8BA3C7',
    },
    success: {
      main: '#4ADE80',
    },
    warning: {
      main: '#FFB703',
    },
    error: {
      main: '#F43F5E',
    },
    divider: 'rgba(0, 212, 255, 0.1)',
  },

  typography: {
    fontFamily: '"Outfit", "Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 900,
      fontSize: '3rem',
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 800,
      fontSize: '2.25rem',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 800,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.15rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: 0.1,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.04em',
    },
    caption: {
      letterSpacing: '0.06em',
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#020817',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 100, 180, 0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0, 212, 255, 0.06) 0%, transparent 60%),
            linear-gradient(160deg, #020817 0%, #060E1F 40%, #091524 70%, #0B1A2E 100%)
          `,
          backgroundAttachment: 'fixed',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          padding: '11px 28px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontWeight: 700,
          letterSpacing: '0.04em',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #F0C040 0%, #FFD966 50%, #E5B030 100%)',
          color: '#020817',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFD966 0%, #F0C040 100%)',
            boxShadow: '0 6px 30px rgba(240, 192, 64, 0.45), 0 0 60px rgba(240, 192, 64, 0.1)',
          },
        },
        containedInfo: {
          background: 'linear-gradient(135deg, #00D4FF 0%, #0099BB 100%)',
          color: '#020817',
          '&:hover': {
            boxShadow: '0 6px 30px rgba(0, 212, 255, 0.45)',
          },
        },
        outlinedInfo: {
          borderColor: 'rgba(0, 212, 255, 0.4)',
          '&:hover': {
            borderColor: '#00D4FF',
            backgroundColor: 'rgba(0, 212, 255, 0.06)',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: 'rgba(11, 22, 40, 0.72)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          border: '1px solid rgba(0, 212, 255, 0.12)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        outlined: {
          backgroundColor: 'rgba(11, 22, 40, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 212, 255, 0.12)',
          borderRadius: 16,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(2, 8, 23, 0.85)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
          boxShadow: '0 1px 30px rgba(0,0,0,0.4)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(2, 8, 23, 0.97)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 212, 255, 0.08)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.03)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(139, 163, 199, 0.2)',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.4)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 212, 255, 0.03)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00D4FF',
              boxShadow: '0 0 0 3px rgba(0, 212, 255, 0.12)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#8BA3C7',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00D4FF',
          },
          '& .MuiOutlinedInput-input': {
            color: '#F0F4FF',
            '&::placeholder': {
              color: '#4A6080',
              opacity: 1,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 0',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(11, 22, 40, 0.95)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8,
          fontSize: '0.78rem',
          fontFamily: '"Outfit", sans-serif',
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 212, 255, 0.08)',
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
