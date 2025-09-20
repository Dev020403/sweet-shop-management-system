import { createTheme } from '@mui/material/styles';

// Custom color palette inspired by sweet shop
const colors = {
    primary: {
        main: '#FF6B9D', // Sweet pink
        light: '#FFA1C9',
        dark: '#E91E63',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#4A90E2', // Sky blue
        light: '#7DB3F5',
        dark: '#2C5BA3',
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
    },
    warning: {
        main: '#FF9800',
        light: '#FFB74D',
        dark: '#F57C00',
    },
    error: {
        main: '#F44336',
        light: '#EF5350',
        dark: '#D32F2F',
    },
    background: {
        default: '#FFF8F0', // Cream background
        paper: '#FFFFFF',
        gradient: 'linear-gradient(135deg, #FFE0E6 0%, #FFF8F0 100%)',
    },
    text: {
        primary: '#2C3E50',
        secondary: '#7F8C8D',
    },
    divider: '#E8EAF6',
};

// Custom theme
export const theme = createTheme({
    palette: colors,
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            color: colors.text.primary,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: colors.text.primary,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: colors.text.primary,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: colors.text.primary,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: colors.text.primary,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: colors.text.primary,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: colors.text.primary,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: colors.text.secondary,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        // AppBar customization
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: colors.text.primary,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        // Card customization
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        // Button customization
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        // Chip customization
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    fontWeight: 500,
                },
            },
        },
        // TextField customization
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        '&:hover fieldset': {
                            borderColor: colors.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.primary.main,
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
        // Paper customization
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
                elevation2: {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                },
                elevation3: {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
            },
        },
        // Dialog customization
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        // Menu customization
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    marginTop: 8,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;
