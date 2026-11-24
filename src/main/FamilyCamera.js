import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as maplibregl from 'maplibre-gl';
import { map } from '../map/core/MapView';
import { toMapCoordinates } from '../map/core/mapUtil';

const FamilyCamera = ({
  positions,
  selectedPosition,
  selectedDeviceId,
  follow,
  onFollowChange,
}) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const selectTime = useSelector((state) => state.devices.selectTime);

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const selectedPositionRef = useRef(selectedPosition);
  selectedPositionRef.current = selectedPosition;

  const followRef = useRef(follow);
  followRef.current = follow;

  const followChangeRef = useRef(onFollowChange);
  followChangeRef.current = onFollowChange;

  const previousIdRef = useRef(undefined);
  const focusedIdRef = useRef(undefined);
  const initializedRef = useRef(false);

  const focusOffset = desktop ? 120 : 220;

  const fitOverview = useCallback(() => {
    const coordinates = positionsRef.current.map((position) =>
      toMapCoordinates(position.longitude, position.latitude),
    );
    if (!coordinates.length) {
      return;
    }
    if (coordinates.length === 1) {
      map.easeTo({
        center: coordinates[0],
        zoom: desktop ? 13 : 14,
        duration: 800,
        essential: true,
      });
      return;
    }
    const bounds = coordinates.reduce(
      (result, coordinate) => result.extend(coordinate),
      new maplibregl.LngLatBounds(coordinates[0], coordinates[1]),
    );
    map.fitBounds(bounds, {
      duration: 850,
      maxZoom: 15,
      padding: {
        top: desktop ? 120 : 110,
        bottom: desktop ? 170 : 250,
        left: desktop ? 80 : 72,
        right: desktop ? 80 : 72,
      },
    });
  }, [desktop]);

  useEffect(() => {
    if (initializedRef.current || selectedDeviceId) {
      return;
    }
    if (!positions.length) {
      return;
    }
    initializedRef.current = true;
    fitOverview();
  }, [positions.length, selectedDeviceId, fitOverview]);

  useEffect(() => {
    const position = selectedPositionRef.current;
    const previousId = previousIdRef.current;

    if (selectedDeviceId && position) {
      const center = toMapCoordinates(position.longitude, position.latitude);
      const offset = [0, -focusOffset];
      if (selectedDeviceId !== previousId) {
        map.flyTo({
          center,
          zoom: Math.max(map.getZoom(), desktop ? 13 : 14),
          offset,
          duration: 900,
          essential: true,
        });
      } else {
        map.easeTo({
          center,
          zoom: Math.max(map.getZoom(), desktop ? 13 : 14),
          offset,
          duration: 600,
          essential: true,
        });
      }
      focusedIdRef.current = selectedDeviceId;
      initializedRef.current = true;
    } else if (!selectedDeviceId && previousId) {
      focusedIdRef.current = undefined;
      fitOverview();
    }

    previousIdRef.current = selectedDeviceId;
  }, [selectedDeviceId, selectTime, desktop, focusOffset, fitOverview]);

  useEffect(() => {
    if (!selectedDeviceId || !selectedPosition) {
      return;
    }
    if (focusedIdRef.current === selectedDeviceId) {
      return;
    }
    focusedIdRef.current = selectedDeviceId;
    map.flyTo({
      center: toMapCoordinates(selectedPosition.longitude, selectedPosition.latitude),
      zoom: Math.max(map.getZoom(), desktop ? 13 : 14),
      offset: [0, -focusOffset],
      duration: 900,
      essential: true,
    });
  }, [selectedDeviceId, selectedPosition, desktop, focusOffset]);

  useEffect(() => {
    if (!follow || !selectedDeviceId || !selectedPosition) {
      return;
    }
    map.easeTo({
      center: toMapCoordinates(selectedPosition.longitude, selectedPosition.latitude),
      zoom: Math.max(map.getZoom(), desktop ? 13 : 14),
      offset: [0, -focusOffset],
      duration: 500,
      essential: true,
    });
  }, [follow, selectedDeviceId, selectedPosition, desktop, focusOffset]);

  useEffect(() => {
    const onDragStart = () => {
      if (followRef.current) {
        followChangeRef.current?.(false);
      }
    };
    map.on('dragstart', onDragStart);
    return () => map.off('dragstart', onDragStart);
  }, []);

  return null;
};

export default FamilyCamera;
