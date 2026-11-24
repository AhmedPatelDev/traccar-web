import { useEffect, useReducer } from 'react';
import { Avatar, Button, IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import SpeedIcon from '@mui/icons-material/Speed';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DirectionsIcon from '@mui/icons-material/Directions';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAttributePreference, usePreference } from '../common/util/preferences';
import {
  getAddress,
  getAvatar,
  getBattery,
  getDirectionsUrl,
  getPresence,
  getPresenceColor,
  getRelativeTime,
  getSpeed,
  isMoving,
  tr,
} from './familyUtils';

const useStyles = makeStyles()((theme) => ({
  wrap: {
    position: 'absolute',
    insetInline: theme.spacing(1.5),
    bottom: `calc(env(safe-area-inset-bottom) + 12px)`,
    zIndex: 13,
    pointerEvents: 'none',
    [theme.breakpoints.up('md')]: {
      insetInline: 'auto',
      left: theme.spacing(3),
      bottom: theme.spacing(3),
      width: 390,
      maxWidth: 'calc(100vw - 48px)',
    },
  },
  card: {
    pointerEvents: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.75),
    paddingTop: theme.spacing(2),
    maxHeight: 'calc(100dvh - 160px)',
    overflowY: 'auto',
    borderRadius: 26,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(18, 24, 38, 0.88)',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    animation: 'familyCardIn 260ms cubic-bezier(0.16, 1, 0.3, 1)',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2),
    },
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    marginTop: -6,
    marginBottom: 2,
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.18)',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 54,
    height: 54,
    background: 'linear-gradient(135deg, #1E293B, #334155)',
    color: '#F8FAFC',
    fontSize: '1.1rem',
    fontWeight: 700,
    border: '2px solid #64748B',
  },
  avatarActive: {
    borderColor: '#10B981',
    boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.15)',
  },
  statusDot: {
    position: 'absolute',
    right: 0,
    bottom: 1,
    width: 13,
    height: 13,
    borderRadius: '50%',
    border: '2px solid #121826',
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    color: '#F8FAFC',
    fontSize: '1.35rem',
    fontWeight: 750,
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    color: '#94A3B8',
    fontSize: '0.78rem',
    lineHeight: 1.2,
  },
  statusText: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  },
  statusBullet: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    display: 'inline-block',
  },
  close: {
    flexShrink: 0,
    width: 36,
    height: 36,
    color: '#CBD5E1',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1.25),
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    minWidth: 0,
    padding: theme.spacing(1.25),
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.07)',
    background: 'rgba(255, 255, 255, 0.035)',
  },
  statIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: 12,
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#10B981',
  },
  statBody: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  statValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    color: '#F8FAFC',
    fontSize: '1.3rem',
    fontWeight: 700,
    lineHeight: 1.15,
    whiteSpace: 'nowrap',
  },
  statUnit: {
    color: '#94A3B8',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  address: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(1.1, 1.35),
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(255, 255, 255, 0.025)',
    color: '#CBD5E1',
    fontSize: '0.84rem',
    lineHeight: 1.4,
  },
  addressIcon: {
    marginTop: 1,
    color: '#64748B',
    fontSize: 18,
    flexShrink: 0,
  },
  addressText: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  updated: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: -4,
    color: '#64748B',
    fontSize: '0.74rem',
  },
  updatedIcon: {
    fontSize: 15,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1.25),
  },
  action: {
    minWidth: 0,
    height: 44,
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#E2E8F0',
    background: 'rgba(255, 255, 255, 0.035)',
    fontSize: '0.82rem',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.075)',
    },
    '& .MuiButton-startIcon': {
      marginRight: 6,
    },
  },
  actionActive: {
    borderColor: 'transparent',
    background: '#10B981',
    color: '#04110D',
    '&:hover': {
      background: '#34D399',
      borderColor: 'transparent',
    },
  },
}));

const BatteryGlyph = ({ battery }) => {
  if (!battery) {
    return <Battery20Icon sx={{ fontSize: 21, color: '#64748B' }} />;
  }
  const Icon = battery.charging
    ? battery.level > 50
      ? BatteryChargingFullIcon
      : battery.level >= 20
        ? BatteryCharging60Icon
        : BatteryCharging20Icon
    : battery.level > 50
      ? BatteryFullIcon
      : battery.level >= 20
        ? Battery60Icon
        : Battery20Icon;
  return <Icon sx={{ fontSize: 21, color: battery.color }} />;
};

const FocusedDeviceCard = ({ device, position, follow, onToggleFollow, onClose }) => {
  const { classes, cx } = useStyles();
  const t = useTranslation();
  const [, forceUpdate] = useReducer((value) => value + 1, 0);

  const speedUnit = useAttributePreference('speedUnit', 'kmh');
  const coordinateFormat = usePreference('coordinateFormat');

  useEffect(() => {
    const interval = setInterval(forceUpdate, 30000);
    return () => clearInterval(interval);
  }, []);

  const avatar = getAvatar(device);
  const battery = getBattery(position);
  const presence = getPresence(device, position);
  const presenceColor = getPresenceColor(device, position);
  const moving = isMoving(position);
  const speed = position
    ? getSpeed(position, speedUnit, t)
    : { value: '—', unit: '', stationary: true };

  const statusLabel =
    device.status === 'online'
      ? t('deviceStatusOnline')
      : device.status === 'offline'
        ? t('deviceStatusOffline')
        : t('deviceStatusUnknown');

  const movementLabel = moving
    ? tr(t, 'familyMoving', 'Moving')
    : tr(t, 'familyStationary', 'Stationary');

  const relativeTime = getRelativeTime(position?.fixTime, tr(t, 'familyJustNow', 'Just now'));

  const justNow = tr(t, 'familyJustNow', 'Just now');
  const updatedLabel = position ? relativeTime || justNow : t('sharedNoData');

  return (
    <div className={classes.wrap}>
      <div className={classes.card}>
        <div className={classes.handle} />
        <div className={classes.header}>
          <div className={classes.avatarWrap}>
            <Avatar
              src={avatar.image || undefined}
              className={cx(classes.avatar, presence === 'active' && classes.avatarActive)}
            >
              {!avatar.image && avatar.initials}
            </Avatar>
            <span className={classes.statusDot} style={{ backgroundColor: presenceColor }} />
          </div>
          <div className={classes.identity}>
            <h2 className={classes.name}>{device.name}</h2>
            <div className={classes.statusRow}>
              <span className={classes.statusText}>
                <span className={classes.statusBullet} style={{ backgroundColor: presenceColor }} />
                {statusLabel}
              </span>
              <span>•</span>
              <span>{movementLabel}</span>
            </div>
          </div>
          <IconButton
            className={classes.close}
            onClick={onClose}
            aria-label={tr(t, 'familyClose', 'Close')}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className={classes.stats}>
          <div className={classes.stat}>
            <div className={classes.statIcon}>
              <SpeedIcon fontSize="small" />
            </div>
            <div className={classes.statBody}>
              <span className={classes.statLabel}>{t('positionSpeed')}</span>
              <span className={classes.statValue}>
                {speed.value}
                {speed.unit && <span className={classes.statUnit}>{speed.unit}</span>}
              </span>
            </div>
          </div>
          <div className={classes.stat}>
            <div className={classes.statIcon} style={{ background: 'rgba(255,255,255,0.06)' }}>
              <BatteryGlyph battery={battery} />
            </div>
            <div className={classes.statBody}>
              <span className={classes.statLabel}>{t('positionBatteryLevel')}</span>
              <span className={classes.statValue}>
                {battery ? `${battery.level}%` : '—'}
                {battery?.charging && (
                  <span className={classes.statUnit} style={{ color: '#10B981' }}>
                    {tr(t, 'familyCharging', 'Charging')}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className={classes.address}>
          <PlaceIcon className={classes.addressIcon} />
          <span className={classes.addressText}>
            {position
              ? getAddress(position, coordinateFormat)
              : tr(t, 'familyNoLocation', 'No location data yet')}
          </span>
        </div>

        <div className={classes.updated}>
          <ScheduleIcon className={classes.updatedIcon} />
          <span>{`${t('deviceLastUpdate')} · ${updatedLabel}`}</span>
        </div>

        <div className={classes.actions}>
          <Button
            variant={follow ? 'contained' : 'outlined'}
            className={cx(classes.action, follow && classes.actionActive)}
            startIcon={follow ? <GpsFixedIcon /> : <MyLocationIcon />}
            onClick={onToggleFollow}
          >
            {follow ? tr(t, 'familyFollowing', 'Following') : tr(t, 'familyFollow', 'Follow')}
          </Button>
          <Button
            variant="outlined"
            className={classes.action}
            startIcon={<DirectionsIcon />}
            component="a"
            href={position ? getDirectionsUrl(position) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!position}
          >
            {tr(t, 'familyDirections', 'Directions')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FocusedDeviceCard;
