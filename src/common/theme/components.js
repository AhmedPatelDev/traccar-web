export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: '#0B0F19',
        color: '#F8FAFC',
        overscrollBehavior: 'none',
        WebkitTapHighlightColor: 'transparent',
      },
      '#root': {
        minHeight: '100dvh',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        backgroundColor: 'rgba(18, 24, 38, 0.96)',
        backgroundImage: 'none',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.55)',
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: 'rgba(18, 24, 38, 0.96)',
        backgroundImage: 'none',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      sizeMedium: {
        height: '40px',
      },
      root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 12,
      },
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
    styleOverrides: {
      tooltip: {
        backgroundColor: 'rgba(18, 24, 38, 0.96)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        fontSize: '0.75rem',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
      }),
    },
  },
};
