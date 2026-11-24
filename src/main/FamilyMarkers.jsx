import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as maplibregl from 'maplibre-gl';
import { map } from '../map/core/MapView';
import { toMapCoordinates } from '../map/core/mapUtil';
import { getAvatar, getPresence } from './familyUtils';
import './familyMarkers.css';

const interpolationDuration = 500;

const FamilyMarkers = ({ positions, selectedDeviceId, onSelect }) => {
  const devices = useSelector((state) => state.devices.items);
  const markersRef = useRef(new Map());
  const frameRef = useRef(undefined);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const ensureAnimation = useCallback(() => {
    if (frameRef.current !== undefined) {
      return;
    }
    const animate = (now) => {
      let active = false;
      markersRef.current.forEach((entry) => {
        if (!entry.animating) {
          return;
        }
        const progress = Math.min(1, (now - entry.startedAt) / interpolationDuration);
        const longitude = entry.start[0] + (entry.target[0] - entry.start[0]) * progress;
        const latitude = entry.start[1] + (entry.target[1] - entry.start[1]) * progress;
        entry.current = [longitude, latitude];
        entry.marker.setLngLat(entry.current);
        if (progress >= 1) {
          entry.current = entry.target;
          entry.marker.setLngLat(entry.target);
          entry.animating = false;
        } else {
          active = true;
        }
      });
      if (active) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = undefined;
      }
    };
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const activeIds = new Set();

    positions.forEach((position) => {
      const device = devices[position.deviceId];
      if (!device) {
        return;
      }

      const deviceId = device.id;
      activeIds.add(deviceId);

      let entry = markersRef.current.get(deviceId);
      if (!entry) {
        const element = document.createElement('div');
        element.className = 'family-marker';
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');

        const avatar = document.createElement('div');
        avatar.className = 'family-marker__avatar';
        const initials = document.createElement('span');
        initials.className = 'family-marker__initials';
        const status = document.createElement('span');
        status.className = 'family-marker__status';
        avatar.append(initials, status);

        const name = document.createElement('div');
        name.className = 'family-marker__name';

        element.append(avatar, name);

        const activate = (event) => {
          event.stopPropagation();
          onSelectRef.current?.(deviceId);
        };
        element.onclick = activate;
        element.onkeydown = (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activate(event);
          }
        };

        const target = toMapCoordinates(position.longitude, position.latitude);
        const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
          .setLngLat(target)
          .addTo(map);

        entry = {
          marker,
          element,
          avatar,
          initials,
          status,
          name,
          image: undefined,
          current: target,
          target,
          start: target,
          startedAt: performance.now(),
          animating: false,
        };
        markersRef.current.set(deviceId, entry);
      } else {
        const target = toMapCoordinates(position.longitude, position.latitude);
        const distance = Math.hypot(target[0] - entry.current[0], target[1] - entry.current[1]);
        entry.start = entry.current;
        entry.target = target;
        entry.startedAt = performance.now();
        entry.animating = distance > 0.0000001;
        if (entry.animating) {
          ensureAnimation();
        } else {
          entry.current = target;
          entry.marker.setLngLat(target);
        }
      }

      const avatar = getAvatar(device);
      if (entry.image !== avatar.image) {
        entry.image = avatar.image;
        entry.avatar.style.backgroundImage = avatar.image
          ? `url("${avatar.image}")`
          : 'linear-gradient(135deg, #1e293b, #334155)';
      }
      entry.initials.textContent = avatar.initials;
      entry.name.textContent = device.name;
      entry.element.title = device.name;
      entry.element.setAttribute('aria-label', device.name);
      entry.element.classList.toggle(
        'family-marker--active',
        getPresence(device, position) === 'active',
      );
      entry.element.classList.toggle('family-marker--selected', deviceId === selectedDeviceId);
      entry.element.style.zIndex = deviceId === selectedDeviceId ? '20' : '0';
    });

    markersRef.current.forEach((entry, deviceId) => {
      if (!activeIds.has(deviceId)) {
        entry.marker.remove();
        markersRef.current.delete(deviceId);
      }
    });
  }, [devices, positions, selectedDeviceId, ensureAnimation]);

  useEffect(
    () => () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      markersRef.current.forEach((entry) => entry.marker.remove());
      markersRef.current.clear();
    },
    [],
  );

  return null;
};

export default FamilyMarkers;
