import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getHeatmapData } from '../../services/complaintService';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const statusColors = {
  OPEN: '#ef4444', // red
  IN_PROGRESS: '#f59e0b', // amber
  RESOLVED: '#10b981', // emerald
};

const priorityColors = {
  LOW: '#6b7280',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
};

const MapView = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getHeatmapData();
        if (response.data.success) {
          setComplaints(response.data.heatmapData);
        }
      } catch (err) {
        setError('Failed to load map data');
        console.error('Error fetching heatmap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const createCustomIcon = (status, priority) => {
    const color = statusColors[status] || '#6b7280';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
      ">${priority === 'HIGH' ? '!' : priority === 'MEDIUM' ? '!' : ''}</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
        <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">Live Map View</h2>
        <div className="flex items-center justify-center h-80">
          <div className="text-[#7c8aa5]">Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
        <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">Live Map View</h2>
        <div className="flex items-center justify-center h-80">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
        Live Map View
      </h2>

      <div className="mb-6 rounded-2xl border border-cyan-400/10 bg-[#08101d] p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-[#7c8aa5]">
          Live City Map — India ({complaints.length} active issues)
        </div>

        <div className="relative h-[340px] overflow-hidden rounded-2xl border border-cyan-400/10">
          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="rounded-2xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {complaints.map((complaint) => (
              <Marker
                key={complaint.id}
                position={[complaint.latitude, complaint.longitude]}
                icon={createCustomIcon(complaint.status, complaint.priority)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
                    <p className="text-sm text-gray-600">{complaint.address}</p>
                    <div className="mt-2 flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        complaint.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                        complaint.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        complaint.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="space-y-3">
        {complaints.slice(0, 4).map((complaint) => (
          <div
            key={complaint.id}
            className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 px-4 py-4"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-2 h-2.5 w-2.5 rounded-full`} style={{ backgroundColor: statusColors[complaint.status] || '#6b7280' }} />
              <div>
                <p className="font-medium text-[#e6f1ff]">{complaint.title}</p>
                <p className="text-sm text-[#7c8aa5]">
                  {complaint.address} · #{complaint.id.slice(-4)}
                </p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              complaint.status === 'OPEN' ? 'text-red-400 bg-red-400/10' :
              complaint.status === 'IN_PROGRESS' ? 'text-amber-400 bg-amber-400/10' :
              'text-emerald-400 bg-emerald-400/10'
            }`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;