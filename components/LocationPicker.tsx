"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Location, LocationType } from "@/types";
import { generateId } from "@/lib/utils";

const libraries: "places"[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

interface LocationPickerProps {
  value?: Location;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  locationType?: LocationType;
  showMap?: boolean;
  className?: string;
}

export function LocationPicker({
  value,
  onChange,
  placeholder = "Enter location...",
  locationType = "general",
  showMap = true,
  className,
}: LocationPickerProps) {
  const [address, setAddress] = useState(value?.address || "");
  const [mapCenter, setMapCenter] = useState(
    value ? { lat: value.lat, lng: value.lng } : defaultCenter
  );
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(value ? { lat: value.lat, lng: value.lng } : null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name || "";

        setAddress(formattedAddress);
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });

        onChange({
          id: value?.id || generateId(),
          address: formattedAddress,
          lat,
          lng,
          type: locationType,
        });
      }
    }
  }, [onChange, locationType, value?.id]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const formattedAddress = results[0].formatted_address;
            setAddress(formattedAddress);

            onChange({
              id: value?.id || generateId(),
              address: formattedAddress,
              lat,
              lng,
              type: locationType,
            });
          }
        });
      }
    },
    [onChange, locationType, value?.id]
  );

  const handleClear = useCallback(() => {
    setAddress("");
    setMarkerPosition(null);
    onChange(null);
  }, [onChange]);

  if (loadError) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-2 text-destructive">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            Error loading maps. Please check your API key.
          </span>
        </div>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={placeholder}
          className="mt-2"
        />
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading maps...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-3">
        <div className="relative">
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9"
              />
              {address && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Autocomplete>
        </div>
      </div>

      {showMap && (
        <div className="border-t">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={14}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                animation={google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        </div>
      )}
    </Card>
  );
}
