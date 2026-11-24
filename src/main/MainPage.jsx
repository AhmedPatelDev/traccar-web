import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { devicesActions } from '../store';
import { useTranslation } from '../common/components/LocalizationProvider';
import useFeatures from '../common/util/useFeatures';
import EventsDrawer from './EventsDrawer';
import FamilySwitcher from './FamilySwitcher';
import FocusedDeviceCard from './FocusedDeviceCard';
import { tr } from './familyUtils';

const MainMap = lazy(() => import('./MainMap'));

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    background: '#0B0F19',
  },
  mapWrap: {
    position: 'absolute',
    inset: 0,
    '& .maplibregl-ctrl-top-right': {
      top: `calc(env(safe-area-inset-top) + 78px)`,
      right: `calc(env(safe-area-inset-right) + 12px)`,
    },
    '& .maplibregl-ctrl-top-left': {
      top: `calc(env(safe-area-inset-top) + 78px)`,
      left: `calc(env(safe-area-inset-left) + 12px)`,
    },
    '& .maplibregl-ctrl-bottom-left': {
      bottom: `calc(env(safe-area-inset-bottom) + 126px)`,
    },
    '& .maplibregl-ctrl-bottom-right': {
      bottom: `calc(env(safe-area-inset-bottom) + 126px)`,
      right: `calc(env(safe-area-inset-right) + 12px)`,
    },
    [theme.breakpoints.down('md')]: {
      '&.focused .maplibregl-ctrl-bottom-left, &.focused .maplibregl-ctrl-bottom-right': {
        bottom: `calc(env(safe-area-inset-bottom) + 340px)`,
      },
    },
  },
  topBar: {
    position: 'absolute',
    top: 0,
    insetInline: 0,
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    paddingTop: `calc(env(safe-area-inset-top) + 12px)`,
    paddingInlineStart: `calc(env(safe-area-inset-left) + 12px)`,
    paddingInlineEnd: `calc(env(safe-area-inset-right) + 12px)`,
    pointerEvents: 'none',
  },
  brand: {
    pointerEvents: 'auto',
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    padding: '6px 14px 6px 6px',
    borderRadius: 999,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(18, 24, 38, 0.78)',
    color: '#F8FAFC',
    cursor: 'pointer',
    textAlign: 'start',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  brandIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.28), rgba(56, 189, 248, 0.16))',
    color: '#10B981',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  },
  brandTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  brandMeta: {
    marginTop: 2,
    fontSize: '0.66rem',
    color: '#94A3B8',
  },
  topActions: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    color: '#F8FAFC',
    background: 'rgba(18, 24, 38, 0.78)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    '&:hover': {
      background: 'rgba(30, 41, 59, 0.92)',
    },
  },
}));

const MainPage = () => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();
  const features = useFeatures();

  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const eventsAvailable = useSelector((state) => Boolean(state.events.items.length));

  const [eventsOpen, setEventsOpen] = useState(false);
  const [follow, setFollow] = useState(false);

  const devicesList = useMemo(
    () => Object.values(devices).sort((first, second) => first.name.localeCompare(second.name)),
    [devices],
  );
  const positionsList = useMemo(() => Object.values(positions), [positions]);

  const selectedDevice = selectedDeviceId ? devices[selectedDeviceId] : undefined;
  const selectedPosition = selectedDeviceId ? positions[selectedDeviceId] : undefined;
  const onlineCount = devicesList.filter((device) => device.status === 'online').length;

  useEffect(() => {
    setFollow(false);
  }, [selectedDeviceId]);

  const selectDevice = useCallback(
    (deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch],
  );

  const clearSelection = useCallback(() => {
    dispatch(devicesActions.selectId(null));
    setFollow(false);
  }, [dispatch]);

  const onBackgroundClick = useCallback(() => {
    if (selectedDeviceId) {
      clearSelection();
    }
  }, [selectedDeviceId, clearSelection]);

  const onToggleFollow = useCallback(() => {
    setFollow((current) => !current);
  }, []);

  return (
    <div className={classes.root}>
      <div className={cx(classes.mapWrap, selectedDevice && 'focused')}>
        <Suspense fallback={null}>
          <MainMap
            positions={positionsList}
            selectedPosition={selectedPosition}
            selectedDeviceId={selectedDeviceId}
            follow={follow}
            onFollowChange={setFollow}
            onSelect={selectDevice}
            onBackgroundClick={onBackgroundClick}
          />
        </Suspense>
      </div>

      <div className={classes.topBar}>
        <button type="button" className={classes.brand} onClick={clearSelection}>
          <span className={classes.brandIcon}>
            <PeopleIcon fontSize="small" />
          </span>
          <span className={classes.brandText}>
            <span className={classes.brandTitle}>{tr(t, 'familyTitle', 'Family')}</span>
            <span className={classes.brandMeta}>{`${onlineCount} ${t('deviceStatusOnline')}`}</span>
          </span>
        </button>

        <div className={classes.topActions}>
          {!features.disableEvents && (
            <Tooltip title={tr(t, 'familyAlerts', 'Alerts')}>
              <IconButton
                className={classes.iconButton}
                onClick={() => setEventsOpen(true)}
                aria-label={tr(t, 'familyAlerts', 'Alerts')}
              >
                <Badge color="error" variant="dot" invisible={!eventsAvailable}>
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('settingsTitle')}>
            <IconButton
              className={classes.iconButton}
              onClick={() => navigate('/settings/preferences?menu=true')}
              aria-label={t('settingsTitle')}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {selectedDevice ? (
        <FocusedDeviceCard
          device={selectedDevice}
          position={selectedPosition}
          follow={follow}
          onToggleFollow={onToggleFollow}
          onClose={clearSelection}
        />
      ) : (
        <FamilySwitcher devices={devicesList} positions={positions} onSelect={selectDevice} />
      )}

      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
    </div>
  );
};

export default MainPage;
