import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getPublicHeatmapData } from '../../services/complaintService';

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

export default function LiveMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getPublicHeatmapData();
        if (response.data.success) {
          setComplaints(response.data.heatmapData);
        }
      } catch (err) {
        setError('Failed to load map data');
        console.error('Error fetching public heatmap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const createCustomIcon = (status, priority) => {
    const color = statusColors[status] || '#10b981'; // Default to green for resolved
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        box-shadow: 0 0 15px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">✓</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold mb-2">Live City Map</h1>
          <p className="text-[#7c8aa5]">Loading resolved issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Live City Map</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Live City Map</h1>
          <p className="text-xl text-[#7c8aa5] max-w-2xl mx-auto">
            See resolved issues across India. Our platform has successfully addressed {complaints.length} complaints.
          </p>
        </div>

        <div className="bg-[#09111f]/80 backdrop-blur-md rounded-2xl border border-cyan-400/10 p-6">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold text-[#e6f1ff] mb-2">
              Resolved Issues Map — India
            </h2>
            <p className="text-sm text-[#7c8aa5]">
              Green markers show successfully resolved complaints
            </p>
          </div>

          <div className="relative h-[600px] overflow-hidden rounded-2xl border border-cyan-400/10">
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
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 mb-1">{complaint.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{complaint.address}</p>
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          RESOLVED
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          complaint.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                          complaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Category: {complaint.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Resolved: {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0b1628]/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#e6f1ff] mb-1">{complaints.length}</div>
              <div className="text-sm text-[#7c8aa5]">Total Resolved</div>
            </div>
            <div className="bg-[#0b1628]/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#e6f1ff] mb-1">
                {complaints.filter(c => c.priority === 'HIGH').length}
              </div>
              <div className="text-sm text-[#7c8aa5]">High Priority</div>
            </div>
            <div className="bg-[#0b1628]/70 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#e6f1ff] mb-1">
                {new Set(complaints.map(c => c.category)).size}
              </div>
              <div className="text-sm text-[#7c8aa5]">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}