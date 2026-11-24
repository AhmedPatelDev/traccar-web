import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

export default (server, darkMode, direction) =>
  useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Inter, Roboto, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif',
          h1: {
            fontWeight: 700,
            letterSpacing: '-0.03em',
          },
          h2: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h3: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
        },
        palette: palette(server, darkMode),
        direction,
        dimensions,
        components,
      }),
    [server, darkMode, direction],
  );
