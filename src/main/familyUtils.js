import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { speedFromKnots, speedUnitString } from '../common/util/converter';
import { formatAddress } from '../common/util/formatter';
import mediaUrl from '../common/util/mediaUrl';

dayjs.extend(relativeTime);

export const tr = (t, key, fallback) => t(key) || fallback;

export const getInitials = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return '?';
  }
  if (parts.length === 1) {
    return Array.from(parts[0]).slice(0, 2).join('').toUpperCase();
  }
  return `${Array.from(parts[0])[0] || ''}${Array.from(parts[1])[0] || ''}`.toUpperCase();
};

export const getAvatar = (device) => ({
  initials: getInitials(device?.name),
  image:
    device?.attributes?.deviceImage && device?.uniqueId
      ? mediaUrl(device.uniqueId, device.attributes.deviceImage)
      : null,
});

export const isMoving = (position) => {
  if (!position) {
    return false;
  }
  const speed = Number(position.speed);
  return (Number.isFinite(speed) && speed > 0.5) || position.attributes?.motion === true;
};

export const getPresence = (device, position) => {
  if (device?.status !== 'online') {
    return 'offline';
  }
  return isMoving(position) ? 'active' : 'idle';
};

export const getPresenceColor = (device, position) => {
  const presence = getPresence(device, position);
  if (presence === 'active') {
    return '#10B981';
  }
  return '#64748B';
};

export const getBattery = (position) => {
  const raw = position?.attributes?.batteryLevel;
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return null;
  }
  const level = Math.max(0, Math.min(100, Math.round(value)));
  let color = '#EF4444';
  if (level > 50) {
    color = '#10B981';
  } else if (level >= 20) {
    color = '#F59E0B';
  }
  return {
    level,
    color,
    charging: position?.attributes?.charge === true,
  };
};

export const getSpeed = (position, unit, t) => {
  const unitLabel = speedUnitString(unit, t);
  const speed = Number(position?.speed);
  if (!Number.isFinite(speed) || speed <= 0.5) {
    return { value: '0', unit: unitLabel, stationary: true };
  }
  const converted = speedFromKnots(speed, unit);
  const rounded = converted >= 10 ? Math.round(converted) : Math.round(converted * 10) / 10;
  return { value: `${rounded}`, unit: unitLabel, stationary: false };
};

export const getRelativeTime = (fixTime, justNowLabel) => {
  if (!fixTime) {
    return '';
  }
  const fix = dayjs(fixTime);
  const difference = dayjs().valueOf() - fix.valueOf();
  if (difference >= 0 && difference < 60000) {
    return justNowLabel;
  }
  return fix.fromNow();
};

export const getAddress = (position, coordinateFormat) =>
  position ? formatAddress(position, coordinateFormat) : '';

export const getDirectionsUrl = (position) => {
  const destination = `${position.latitude},${position.longitude}`;
  const appleDevice =
    typeof navigator !== 'undefined' && /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  if (appleDevice) {
    return `https://maps.apple.com/?daddr=${destination}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
};
