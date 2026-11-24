import { useEffect } from 'react';
import MapView, { map } from '../map/core/MapView';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from '../map/MapGeofence';
import MapCurrentLocation from '../map/MapCurrentLocation';
import PoiMap from '../map/main/PoiMap';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import MapOverlay from '../map/overlay/MapOverlay';
import FamilyMarkers from './FamilyMarkers';
import FamilyCamera from './FamilyCamera';

const MainMap = ({
  positions,
  selectedPosition,
  selectedDeviceId,
  follow,
  onFollowChange,
  onSelect,
  onBackgroundClick,
}) => {
  useEffect(() => {
    const onMapClick = (event) => {
      if (!event.defaultPrevented) {
        onBackgroundClick?.();
      }
    };
    map.on('click', onMapClick);
    return () => map.off('click', onMapClick);
  }, [onBackgroundClick]);

  return (
    <MapView showSwitcher={false}>
      <MapOverlay />
      <MapGeofence />
      <MapAccuracy positions={positions} />
      <MapLiveRoutes deviceIds={positions.map((position) => position.deviceId)} />
      <PoiMap />
      <FamilyMarkers
        positions={positions}
        selectedDeviceId={selectedDeviceId}
        onSelect={onSelect}
      />
      <FamilyCamera
        positions={positions}
        selectedPosition={selectedPosition}
        selectedDeviceId={selectedDeviceId}
        follow={follow}
        onFollowChange={onFollowChange}
      />
      <MapCurrentLocation />
    </MapView>
  );
};

export default MainMap;
