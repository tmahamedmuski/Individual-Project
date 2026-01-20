import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
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

// Helper function to get address from coordinates
const getAddressFromCoords = async (lat: number, lng: number): Promise<string | undefined> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error("Error fetching address:", error);
        return undefined;
    }
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (loc: Location) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const map = useMapEvents({
        async click(e) {
            setPosition(e.latlng);
            const address = await getAddressFromCoords(e.latlng.lat, e.latlng.lng);
            onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address });
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export function MapPicker({ onLocationSelect, defaultLocation }: MapPickerProps) {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(
        defaultLocation || { lat: 6.9271, lng: 79.8612 } // Default to Colombo, Sri Lanka
    );
    const [address, setAddress] = useState<string | undefined>(defaultLocation?.address);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const address = await getAddressFromCoords(latitude, longitude);
                    const newLoc = { lat: latitude, lng: longitude, address };
                    setCurrentLocation(newLoc);
                    setAddress(address);
                    onLocationSelect(newLoc);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    };

    // Wrapper for onLocationSelect to update local address state
    const handleLocationSelect = (loc: Location) => {
        setAddress(loc.address);
        onLocationSelect(loc);
    }

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
                        <LocationMarker onLocationSelect={handleLocationSelect} />
                    </MapContainer>
                )}
            </div>
            {address && (
                <p className="text-sm text-muted-foreground border p-2 rounded-md bg-muted/20">
                    <span className="font-semibold">Selected Address:</span> {address}
                </p>
            )}
            <p className="text-xs text-muted-foreground">
                Click on the map to pin your exact location.
            </p>
        </div>
    );
}
