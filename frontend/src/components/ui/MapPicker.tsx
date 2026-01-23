import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  defaultLocation?: Location;
}

// Fetch full address from coordinates
const getAddressFromCoords = async (lat: number, lng: number): Promise<string | undefined> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();

    if (data.address) {
      const addr = data.address;
      const fullAddress = [
        addr.road,
        addr.neighbourhood,
        addr.suburb,
        addr.city_district || addr.city,
        addr.city || addr.county,
        addr.state,
        addr.postcode,
        addr.country,
      ]
        .filter(Boolean)
        .join(", ");
      return fullAddress;
    }

    // fallback to display_name if address object missing
    return data.display_name;
  } catch (error) {
    console.error("Error fetching address:", error);
    return undefined;
  }
};

// Marker component
function LocationMarker({
  position,
  onLocationSelect,
}: {
  position: Location;
  onLocationSelect: (loc: Location) => void;
}) {
  const [markerPos, setMarkerPos] = useState<L.LatLng | null>(
    position ? L.latLng(position.lat, position.lng) : null
  );

  const map = useMapEvents({
    async click(e) {
      setMarkerPos(e.latlng);
      const address = await getAddressFromCoords(e.latlng.lat, e.latlng.lng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      const latlng = L.latLng(position.lat, position.lng);
      setMarkerPos(latlng);
      map.flyTo(latlng, map.getZoom());
    }
  }, [position, map]);

  return markerPos ? <Marker position={markerPos} /> : null;
}

export function MapPicker({ onLocationSelect, defaultLocation }: MapPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location>(
    defaultLocation || { lat: 6.9271, lng: 79.8612 } // Default: Colombo
  );
  const [address, setAddress] = useState<string | undefined>(defaultLocation?.address);

  // Sync default location with parent
  useEffect(() => {
    if (defaultLocation) {
      setAddress(defaultLocation.address);
      onLocationSelect(defaultLocation);
    }
  }, [defaultLocation, onLocationSelect]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const addr = await getAddressFromCoords(latitude, longitude);
          const newLoc = { lat: latitude, lng: longitude, address: addr };
          setCurrentLocation(newLoc);
          setAddress(addr);
          onLocationSelect(newLoc);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleLocationSelect = (loc: Location) => {
    setCurrentLocation(loc);
    setAddress(loc.address);
    onLocationSelect(loc);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Location</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          className="flex gap-2"
        >
          <MapPin className="w-4 h-4" />
          Use Current Location
        </Button>
      </div>

      <div className="h-[300px] w-full rounded-md overflow-hidden border">
        {currentLocation && (
          <MapContainer
            center={[currentLocation.lat, currentLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={currentLocation} onLocationSelect={handleLocationSelect} />
          </MapContainer>
        )}
      </div>

      {address && (
        <p className="text-sm text-muted-foreground border p-2 rounded-md bg-muted/20 break-words">
          <span className="font-semibold">Selected Address:</span> {address}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Click on the map to pin your exact location.
      </p>
    </div>
  );
}
