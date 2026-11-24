const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export const surfaces = {
  background: '#0B0F19',
  surface: '#121826',
  surfaceElevated: '#182033',
  border: 'rgba(255, 255, 255, 0.08)',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSubtle: '#64748B',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  sky: '#38BDF8',
};

export default (server) => ({
  mode: 'dark',
  background: {
    default: surfaces.background,
    paper: surfaces.surface,
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || surfaces.emerald,
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || surfaces.sky,
  },
  success: {
    main: surfaces.emerald,
  },
  warning: {
    main: surfaces.amber,
  },
  error: {
    main: surfaces.red,
  },
  info: {
    main: surfaces.sky,
  },
  text: {
    primary: surfaces.text,
    secondary: surfaces.textMuted,
    disabled: surfaces.textSubtle,
  },
  divider: surfaces.border,
  action: {
    hover: 'rgba(255, 255, 255, 0.06)',
    selected: 'rgba(16, 185, 129, 0.14)',
    disabledBackground: 'rgba(255, 255, 255, 0.04)',
  },
  neutral: {
    main: surfaces.textSubtle,
  },
  geometry: {
    main: '#3BB2D0',
  },
  alwaysDark: {
    main: surfaces.background,
  },
});
