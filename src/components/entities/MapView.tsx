import React from 'react';
import { MapPin } from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMap = React.lazy(() => import('./LeafletMapInner'));

interface Props {
  latitude?: number;
  longitude?: number;
  address: string;
  markers?: Array<{ lat: number; lng: number; label: string }>;
  height?: string;
}

export const MapView: React.FC<Props> = ({ latitude, longitude, address, markers, height = '300px' }) => {
  if (!latitude || !longitude) {
    return (
      <div
        className="liquid-glass rounded-2xl p-6 flex flex-col items-center justify-center"
        style={{ height }}
      >
        <MapPin className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No GPS coordinates available</p>
        <p className="text-xs text-gray-400 mt-1">{address}</p>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="rounded-2xl border border-gray-200 flex items-center justify-center" style={{ height }}>
          <p className="text-sm text-gray-400">Loading map...</p>
        </div>
      }
    >
      <LeafletMap
        latitude={latitude}
        longitude={longitude}
        address={address}
        markers={markers}
        height={height}
      />
    </React.Suspense>
  );
};
