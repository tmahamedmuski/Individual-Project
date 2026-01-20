
import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

// Fix for default marker icon in leaflet with react
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<string>("");

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition({ lat, lng });
                fetchAddress(lat, lng);
            },
        });

        return position === null ? null : (
            <Marker position={position}></Marker>
        );
    };

    const fetchAddress = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            // Using OpenStreetMap Nominatim for Reverse Geocoding
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (response.data && response.data.display_name) {
                setAddress(response.data.display_name);
                onLocationSelect({ lat, lng, address: response.data.display_name });
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Address not found");
            onLocationSelect({ lat, lng, address: "Address not found" });
        } finally {
            setLoading(false);
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition({ lat: latitude, lng: longitude });
                    fetchAddress(latitude, longitude);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLoading(false);
                }
            );
        }
    };

    return (
        <div className="space-y-4">
            <div className="h-[300px] w-full rounded-md overflow-hidden border border-input relative z-0">
                {/* Z-index 0 to ensure it doesn't overlap modals mistakenly, but map needs its context */}
                <MapContainer center={[6.9271, 79.8612]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                </MapContainer>
            </div>

            <div className="flex flex-col gap-2">
                <Button type="button" variant="outline" onClick={handleCurrentLocation} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    Use My Current Location
                </Button>

                {address && (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded border border-border">
                        <span className="font-semibold">Selected Address:</span> {address}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPicker;
