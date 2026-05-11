import React, { useEffect, useState } from "react";
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

const ZoneMap = () => {
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
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">My Zone · North</h2>
        <div className="flex items-center justify-center h-40">
          <div className="text-[#7c8aa5]">Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">My Zone · North</h2>
        <div className="flex items-center justify-center h-40">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">My Zone · North</h2>

      <div className="mb-5 rounded-lg border border-dashed border-cyan-400/20 bg-cyan-400/5 p-3">
        <div className="relative h-[120px] overflow-hidden rounded-lg border border-cyan-400/10">
          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
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

      <div className="flex flex-col">
        <div className="mb-2 text-xs text-[#7c8aa5] uppercase tracking-wide">
          Zone Statistics
        </div>
        <div className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-cyan-400/5 border-b border-cyan-400/10">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
            <span className="text-sm text-[#e6f1ff]">Open Issues</span>
          </div>
          <span className="text-xs font-medium text-red-400">
            {complaints.filter(c => c.status === 'OPEN').length}
          </span>
        </div>
        <div className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-cyan-400/5 border-b border-cyan-400/10">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
            <span className="text-sm text-[#e6f1ff]">In Progress</span>
          </div>
          <span className="text-xs font-medium text-amber-400">
            {complaints.filter(c => c.status === 'IN_PROGRESS').length}
          </span>
        </div>
        <div className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-cyan-400/5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
            <span className="text-sm text-[#e6f1ff]">Resolved</span>
          </div>
          <span className="text-xs font-medium text-emerald-400">
            {complaints.filter(c => c.status === 'RESOLVED').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ZoneMap;