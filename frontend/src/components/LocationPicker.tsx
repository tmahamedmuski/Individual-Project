// import { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import { Button } from "@/components/ui/button";
// import { MapPin, Loader2 } from "lucide-react";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix Leaflet marker icon
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// /* ---------- Types ---------- */
// export interface Location {
//     lat: number;
//     lng: number;
//     address?: string;
// }

// interface Props {
//     onLocationSelect: (location: Location) => void;
//     defaultLocation?: Location;
// }

// /* ---------- Reverse Geocode ---------- */
// const fetchAddressFromCoords = async (lat: number, lng: number) => {
//     try {
//         // Option 1: ArcGIS (Very reliable, free for non-commercial use, robust)
//         // Note: ArcGIS takes lng,lat
//         const arcRes = await fetch(
//             `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&featureTypes=&location=${lng},${lat}`
//         );
//         if (arcRes.ok) {
//             const data = await arcRes.json();
//             if (data.address && data.address.LongLabel) {
//                 return data.address.LongLabel;
//             } else if (data.address && data.address.Address) {
//                 return data.address.Address;
//             }
//         }
//         throw new Error("ArcGIS failed");
//     } catch (e1) {
//         console.warn("ArcGIS failed, trying Nominatim...", e1);
//         try {
//             // Option 2: Nominatim (OpenStreetMap)
//             const nomRes = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
//             );
//             if (nomRes.ok) {
//                 const data = await nomRes.json();
//                 if (data.display_name) return data.display_name;
//             }
//             throw new Error("Nominatim failed");
//         } catch (e2) {
//             console.warn("Nominatim failed, trying BigDataCloud...", e2);
//             try {
//                 // Option 3: BigDataCloud
//                 const bdcRes = await fetch(
//                     `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//                 );
//                 if (bdcRes.ok) {
//                     const data = await bdcRes.json();
//                     const parts = [
//                         data.locality,
//                         data.city,
//                         data.principalSubdivision,
//                         data.countryName
//                     ].filter(Boolean);
//                     if (parts.length > 0) return parts.join(", ");
//                 }
//             } catch (e3) {
//                 console.error("All geocoding services failed", e3);
//             }
//         }
//     }
//     return "Pin selected. Please enter address manually.";
// };

// /* ---------- Map Components ---------- */
// function MapClickHandler({
//     onSelect,
//     setLoading,
// }: {
//     onSelect: (loc: Location) => void;
//     setLoading: (loading: boolean) => void;
// }) {
//     useMapEvents({
//         async click(e) {
//             const { lat, lng } = e.latlng;
//             setLoading(true);

//             const fetchedAddress = await fetchAddressFromCoords(lat, lng);
//             console.log("📍 Marker clicked:", { lat, lng, address: fetchedAddress });

//             onSelect({ lat, lng, address: fetchedAddress });
//             setLoading(false);
//         },
//     });
//     return null;
// }

// function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
//     const map = useMapEvents({});
//     // Fly to the new center whenever it changes
//     // using useEffect would be better but simple logic here:
//     map.flyTo(center, map.getZoom());
//     return null;
// }

// /* ---------- Main Component ---------- */
// export default function LocationPicker({
//     onLocationSelect,
//     defaultLocation,
// }: Props) {
//     // Center of the map view
//     const [viewCenter, setViewCenter] = useState<{ lat: number; lng: number }>(
//         defaultLocation || { lat: 6.9271, lng: 79.8612 } // Colombo
//     );
//     // Actual selected pin location
//     const [selectedLocation, setSelectedLocation] = useState<Location | null>(
//         defaultLocation || null
//     );

//     // Loading state for geocoding
//     const [loading, setLoading] = useState(false);

//     // Unified handler for both Click and GPS events
//     const handleLocationUpdate = (loc: Location) => {
//         setSelectedLocation(loc);
//         onLocationSelect(loc);
//     };

//     const handleUseCurrentLocation = () => {
//         if (!navigator.geolocation) return;

//         setLoading(true);
//         navigator.geolocation.getCurrentPosition(
//             async (pos) => {
//                 const { latitude, longitude } = pos.coords;
//                 const addr = await fetchAddressFromCoords(latitude, longitude);

//                 const newLoc = { lat: latitude, lng: longitude, address: addr };

//                 // Update everything
//                 setViewCenter({ lat: latitude, lng: longitude }); // Move map
//                 handleLocationUpdate(newLoc); // Set pin and form
//                 setLoading(false);
//             },
//             (err) => {
//                 console.error("Geolocation error", err);
//                 setLoading(false);
//             }
//         );
//     };

//     return (
//         <div className="space-y-4">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <label className="text-sm font-medium">Location</label>
//                 <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={handleUseCurrentLocation}
//                     className="flex gap-2"
//                     disabled={loading}
//                 >
//                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
//                     Use Current Location
//                 </Button>
//             </div>

//             {/* Map */}
//             <div className="h-[300px] w-full rounded-md overflow-hidden border">
//                 <MapContainer
//                     center={viewCenter}
//                     zoom={13}
//                     scrollWheelZoom={false}
//                     style={{ height: "100%", width: "100%" }}
//                 >
//                     <TileLayer
//                         attribution="&copy; OpenStreetMap contributors"
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />

//                     {/* Handles Map Clicks */}
//                     <MapClickHandler onSelect={handleLocationUpdate} setLoading={setLoading} />

//                     {/* Handles Map Panning (flyTo) */}
//                     <MapUpdater center={viewCenter} />

//                     {/* Renders the Pin */}
//                     {selectedLocation && (
//                         <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
//                             <Popup>
//                                 {selectedLocation.address || "Fetching address..."}
//                             </Popup>
//                         </Marker>
//                     )}
//                 </MapContainer>
//             </div>

//             {/* Address Display */}
//             {selectedLocation?.address && (
//                 <p className="text-sm text-muted-foreground border p-2 rounded-md bg-muted/20">
//                     <span className="font-semibold">Selected Address:</span> {selectedLocation.address}
//                 </p>
//             )}

//             <p className="text-xs text-muted-foreground">
//                 Click on the map to pin your exact location.
//             </p>
//         </div>
//     );
// }
