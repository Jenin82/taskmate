"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { Location } from "@/types";
import { cn } from "@/lib/utils";

const libraries: "places"[] = ["places"];

interface LiveMapProps {
  locations: Location[];
  taskerLocation?: { lat: number; lng: number } | null;
  animate?: boolean;
  className?: string;
  onTaskerMove?: (location: { lat: number; lng: number }) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export function LiveMap({
  locations,
  taskerLocation,
  animate = true,
  className,
  onTaskerMove,
}: LiveMapProps) {
  const [currentTaskerPos, setCurrentTaskerPos] = useState(taskerLocation);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const animationRef = useRef<number>();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Calculate center based on all markers
  const getCenter = useCallback(() => {
    const allPoints = [
      ...locations.map((l) => ({ lat: l.lat, lng: l.lng })),
      ...(taskerLocation ? [taskerLocation] : []),
    ];

    if (allPoints.length === 0) {
      return { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore
    }

    const avgLat =
      allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length;
    const avgLng =
      allPoints.reduce((sum, p) => sum + p.lng, 0) / allPoints.length;

    return { lat: avgLat, lng: avgLng };
  }, [locations, taskerLocation]);

  const centerValue = getCenter();

  // Animate tasker movement
  useEffect(() => {
    if (!animate || !taskerLocation || locations.length === 0) return;

    const targetLocation = locations[0];
    let progress = 0;
    const startLat = taskerLocation.lat;
    const startLng = taskerLocation.lng;

    const animateMovement = () => {
      progress += 0.002; // Adjust speed here

      if (progress >= 1) {
        setCurrentTaskerPos({
          lat: targetLocation.lat,
          lng: targetLocation.lng,
        });
        onTaskerMove?.({ lat: targetLocation.lat, lng: targetLocation.lng });
        return;
      }

      const newLat = startLat + (targetLocation.lat - startLat) * progress;
      const newLng = startLng + (targetLocation.lng - startLng) * progress;

      setCurrentTaskerPos({ lat: newLat, lng: newLng });
      onTaskerMove?.({ lat: newLat, lng: newLng });

      animationRef.current = requestAnimationFrame(animateMovement);
    };

    animationRef.current = requestAnimationFrame(animateMovement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, taskerLocation, locations, onTaskerMove]);

  // Update tasker position when prop changes
  useEffect(() => {
    if (!animate) {
      setCurrentTaskerPos(taskerLocation);
    }
  }, [taskerLocation, animate]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      // Fit bounds to show all markers
      if (locations.length > 0 || taskerLocation) {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach((loc) =>
          bounds.extend({ lat: loc.lat, lng: loc.lng })
        );
        if (taskerLocation) bounds.extend(taskerLocation);
        map.fitBounds(bounds, 50);
      }
    },
    [locations, taskerLocation]
  );

  // Create polyline path
  const polylinePath = [
    ...(currentTaskerPos ? [currentTaskerPos] : []),
    ...locations.map((l) => ({ lat: l.lat, lng: l.lng })),
  ];

  if (loadError) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted", className)}
      >
        <p className="text-sm text-muted-foreground">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted", className)}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={centerValue}
        zoom={14}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Tasker marker with pulsing effect */}
        {currentTaskerPos && (
          <Marker
            position={currentTaskerPos}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
                  <circle cx="20" cy="20" r="8" fill="#fff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
            animation={google.maps.Animation.BOUNCE}
          />
        )}

        {/* Location markers */}
        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            label={{
              text: String(index + 1),
              color: "#fff",
              fontWeight: "bold",
            }}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#ef4444"/>
                  <circle cx="16" cy="16" r="8" fill="#fff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 40),
              anchor: new google.maps.Point(16, 40),
              labelOrigin: new google.maps.Point(16, 16),
            }}
          />
        ))}

        {/* Route polyline */}
        {polylinePath.length > 1 && (
          <Polyline
            path={polylinePath}
            options={{
              strokeColor: "#3b82f6",
              strokeOpacity: 0.8,
              strokeWeight: 4,
              geodesic: true,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
