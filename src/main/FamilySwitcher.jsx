import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import { useTranslation } from '../common/components/LocalizationProvider';
import { getAvatar, getBattery, getPresence, getPresenceColor, tr } from './familyUtils';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'absolute',
    insetInline: 0,
    bottom: `calc(env(safe-area-inset-bottom) + 14px)`,
    zIndex: 12,
    paddingInline: theme.spacing(1.5),
    pointerEvents: 'none',
  },
  bar: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    margin: '0 auto',
    padding: theme.spacing(1),
    width: 'fit-content',
    maxWidth: '100%',
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    borderRadius: 22,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(18, 24, 38, 0.82)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 760,
    },
  },
  person: {
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    flex: '0 0 auto',
    padding: theme.spacing(0.75, 1.5, 0.75, 0.75),
    borderRadius: 16,
    border: '1px solid transparent',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#F8FAFC',
    cursor: 'pointer',
    textAlign: 'start',
    transition: 'background 160ms ease, border-color 160ms ease, transform 160ms ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.07)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  avatarWrap: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    background: 'linear-gradient(135deg, #1E293B, #334155)',
    color: '#F8FAFC',
    fontSize: '0.95rem',
    fontWeight: 700,
    border: '2px solid #64748B',
  },
  avatarActive: {
    borderColor: '#10B981',
  },
  avatarIdle: {
    borderColor: '#64748B',
  },
  statusDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid #121826',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
    maxWidth: 128,
  },
  name: {
    fontSize: '0.85rem',
    fontWeight: 650,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.72rem',
    color: '#94A3B8',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  },
  battery: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    fontWeight: 600,
  },
  separator: {
    opacity: 0.5,
  },
  empty: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    margin: '0 auto',
    padding: theme.spacing(1.5, 2),
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(18, 24, 38, 0.86)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
  },
  emptyTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  emptyText: {
    fontSize: '0.75rem',
    color: '#94A3B8',
    marginTop: 2,
  },
}));

const BatteryGlyph = ({ battery }) => {
  if (!battery) {
    return null;
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
  return <Icon sx={{ fontSize: 15 }} />;
};

const FamilySwitcher = ({ devices, positions, onSelect }) => {
  const { classes } = useStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  if (!devices.length) {
    return (
      <div className={classes.root}>
        <div className={classes.empty}>
          <div>
            <div className={classes.emptyTitle}>
              {tr(t, 'familyNoMembers', 'No family members yet')}
            </div>
            <div className={classes.emptyText}>{t('deviceRegisterFirst')}</div>
          </div>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/settings/device')}
            sx={{ flexShrink: 0 }}
          >
            {t('sharedAdd')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.bar}>
        {devices.map((device) => {
          const position = positions[device.id];
          const avatar = getAvatar(device);
          const battery = getBattery(position);
          const presence = getPresence(device, position);
          const presenceColor = getPresenceColor(device, position);
          return (
            <button
              type="button"
              key={device.id}
              className={classes.person}
              onClick={() => onSelect(device.id)}
              aria-label={device.name}
              aria-pressed={selectedDeviceId === device.id}
            >
              <span className={classes.avatarWrap}>
                <Avatar
                  src={avatar.image || undefined}
                  className={`${classes.avatar} ${presence === 'active' ? classes.avatarActive : classes.avatarIdle}`}
                >
                  {!avatar.image && avatar.initials}
                </Avatar>
                <span className={classes.statusDot} style={{ backgroundColor: presenceColor }} />
              </span>
              <span className={classes.text}>
                <span className={classes.name}>{device.name}</span>
                <span className={classes.meta}>
                  <span>
                    {presence === 'active'
                      ? tr(t, 'familyMoving', 'Moving')
                      : presence === 'idle'
                        ? tr(t, 'familyStationary', 'Stationary')
                        : t('deviceStatusOffline')}
                  </span>
                  {battery && (
                    <>
                      <span className={classes.separator}>•</span>
                      <span className={classes.battery} style={{ color: battery.color }}>
                        <BatteryGlyph battery={battery} />
                        {battery.level}%
                      </span>
                    </>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FamilySwitcher;
