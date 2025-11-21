import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const locations = [
    {
        name: "Sani Sport Brossard",
        address: "7777 Bd Marie-Victorin, Brossard, QC J4W 3H3",
        coords: [45.4333, -73.4667] as [number, number] // Approx, need to verify if possible or use these
    },
    {
        name: "Stade IGA",
        address: "285 Rue Gary-Carter, Montréal, QC H2R 2W1",
        coords: [45.5333, -73.6229] as [number, number]
    },
    {
        name: "Complexe Sportif Longueuil",
        address: "550 Boulevard Curé-Poirier O, Longueuil, QC J4J 2H6",
        coords: [45.5397, -73.5036] as [number, number]
    },
    {
        name: "Tennis - parc Jeanne-Mance",
        address: "4422 Av. de l'Esplanade, Montréal, QC H2W 1B9",
        coords: [45.5167, -73.5864] as [number, number]
    }
];

const Map = () => {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg z-0">
            <MapContainer
                center={[45.5017, -73.5673]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc, index) => (
                    <Marker key={index} position={loc.coords}>
                        <Popup>
                            <div className="text-slate-900">
                                <h3 className="font-bold text-sm">{loc.name}</h3>
                                <p className="text-xs">{loc.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
