import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { GOOGLE_MAPS_API_KEY } from '@/lib/env';
import type { MapPoint } from '@/lib/locations';

type VoyageMapProps = {
  points: MapPoint[];
  selectedId?: string;
  onSelect?: (point: MapPoint) => void;
  height?: number;
  audience?: 'crew' | 'owner';
};

const kindColor = {
  job: '#E66E3A',
  vessel: '#0F766E',
  crew: '#365486',
} as const;

const mapStyle = [
  { featureType: 'water', stylers: [{ color: '#CFE8EF' }] },
  { featureType: 'landscape', stylers: [{ color: '#F9F6EF' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#4C6174' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
];

declare global {
  interface Window {
    google?: any;
    __yachtCrewGoogleMapsLoading?: Promise<void>;
  }
}

export function VoyageMap({ points, selectedId, onSelect, height = 420, audience = 'crew' }: VoyageMapProps) {
  const sorted = useMemo(() => points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)), [points]);

  if (Platform.OS === 'web' && GOOGLE_MAPS_API_KEY) {
    return (
      <GoogleVoyageMap
        points={sorted}
        selectedId={selectedId}
        onSelect={onSelect}
        height={height}
      />
    );
  }

  return (
    <FallbackVoyageMap
      points={sorted}
      selectedId={selectedId}
      onSelect={onSelect}
      height={height}
      audience={audience}
    />
  );
}

function GoogleVoyageMap({
  points,
  selectedId,
  onSelect,
  height,
}: Required<Pick<VoyageMapProps, 'points' | 'height'>> & Pick<VoyageMapProps, 'selectedId' | 'onSelect'>) {
  const hostRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps().then(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !hostRef.current || !window.google) return;

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(hostRef.current, {
        center: centerOf(points),
        zoom: points.length > 1 ? 3 : 5,
        disableDefaultUI: true,
        zoomControl: true,
        styles: mapStyle,
      });
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = points.map((point) => {
      const marker = new window.google.maps.Marker({
        map: mapRef.current,
        position: { lat: point.lat, lng: point.lng },
        title: point.title,
        icon: markerIcon(kindColor[point.kind], point.id === selectedId),
      });
      marker.addListener('click', () => onSelect?.(point));
      return marker;
    });

    if (points.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend({ lat: point.lat, lng: point.lng }));
      mapRef.current.fitBounds(bounds, 60);
    } else if (points[0]) {
      mapRef.current.setCenter({ lat: points[0].lat, lng: points[0].lng });
    }
  }, [onSelect, points, ready, selectedId]);

  return (
    <View className="overflow-hidden rounded-[28px] border border-slate-200 bg-sky-100" style={{ height }}>
      <View ref={hostRef as any} className="h-full w-full" />
      {!ready ? (
        <View className="absolute inset-0 items-center justify-center bg-sky-50/80">
          <Text className="text-base text-slate-600">Loading Google Maps...</Text>
        </View>
      ) : null}
    </View>
  );
}

function FallbackVoyageMap({ points, selectedId, onSelect, height, audience }: VoyageMapProps & { height: number }) {
  const display = points.length ? points : demoPoints(audience);

  return (
    <View className="overflow-hidden rounded-[28px] bg-[#D8EEF2]" style={{ height }}>
      <View className="absolute -left-20 top-12 h-44 w-80 rotate-[-14deg] rounded-full bg-[#FAF7EF]" />
      <View className="absolute right-[-42px] top-4 h-64 w-72 rotate-[18deg] rounded-full bg-[#FAF7EF]" />
      <View className="absolute bottom-4 left-20 h-56 w-80 rotate-[12deg] rounded-full bg-[#FAF7EF]" />
      <View className="absolute left-0 top-0 h-full w-full opacity-70">
        <View className="absolute left-48 top-10 h-1 w-72 rotate-[38deg] bg-teal-700" />
        <View className="absolute left-20 top-44 h-1 w-96 rotate-[-12deg] bg-teal-700" />
        <View className="absolute left-52 top-64 h-1 w-80 rotate-[-28deg] bg-teal-700" />
      </View>
      <Text className="absolute left-12 top-40 text-3xl font-semibold text-[#365486]/70">ATLANTIC</Text>
      <Text className="absolute bottom-16 right-10 text-2xl font-semibold text-[#365486]/70">MED SEA</Text>

      {display.map((point, index) => {
        const x = pointToX(point.lng, index);
        const y = pointToY(point.lat, index);
        const selected = selectedId === point.id || (!selectedId && index === 0);
        return (
          <Pressable
            key={`${point.kind}-${point.id}`}
            onPress={() => onSelect?.(point)}
            className={`absolute items-center justify-center rounded-2xl border-2 border-white ${
              selected ? 'h-16 w-16' : 'h-12 w-12'
            }`}
            style={{ left: x, top: y, backgroundColor: kindColor[point.kind] }}>
            <Text className="text-lg font-semibold text-white">{point.kind === 'crew' ? 'C' : point.kind === 'vessel' ? 'V' : index + 1}</Text>
          </Pressable>
        );
      })}

      <View className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 shadow">
        <Text className="text-sm font-semibold text-[#162B3A]">
          {GOOGLE_MAPS_API_KEY ? 'Chart fallback' : 'Set Google Maps key for live map'}
        </Text>
      </View>
    </View>
  );
}

function loadGoogleMaps() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__yachtCrewGoogleMapsLoading) return window.__yachtCrewGoogleMapsLoading;

  window.__yachtCrewGoogleMapsLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });

  return window.__yachtCrewGoogleMapsLoading;
}

function centerOf(points: MapPoint[]) {
  if (!points.length) return { lat: 39.5, lng: 12.5 };
  return {
    lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
    lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length,
  };
}

function markerIcon(color: string, selected: boolean) {
  const scale = selected ? 1.15 : 1;
  return {
    path: 'M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale,
    anchor: new window.google.maps.Point(12, 22),
  };
}

function pointToX(lng: number, index: number) {
  if (!Number.isFinite(lng)) return 40 + index * 52;
  return Math.max(24, Math.min(340, ((lng + 180) / 360) * 360));
}

function pointToY(lat: number, index: number) {
  if (!Number.isFinite(lat)) return 80 + index * 42;
  return Math.max(70, Math.min(330, ((90 - lat) / 180) * 350));
}

function demoPoints(audience?: 'crew' | 'owner'): MapPoint[] {
  return audience === 'owner'
    ? [
        { id: 'crew-1', kind: 'crew', title: 'Available Deckhand', subtitle: 'Palma', lat: 39.57, lng: 2.65 },
        { id: 'crew-2', kind: 'crew', title: 'Engineer', subtitle: 'Athens', lat: 37.98, lng: 23.72 },
      ]
    : [
        { id: 'job-1', kind: 'job', title: 'Deckhand needed', subtitle: 'Marseille', lat: 43.29, lng: 5.36 },
        { id: 'vessel-1', kind: 'vessel', title: 'M/Y Aurora', subtitle: 'At sea', lat: 39.4, lng: 12.1 },
      ];
}
