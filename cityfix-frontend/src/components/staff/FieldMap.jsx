import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getHeatmapData } from "../../services/complaintService";
import { useAuth } from "../../context/AuthContext";

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

const FieldMap = () => {
  const { selectedDomain } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await getHeatmapData();
        if (response.data.success) {
          setComplaints(response.data.heatmapData || []);
        }
      } catch (err) {
        setError('Failed to load map data');
        console.error('Error fetching map data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const createCustomIcon = (status) => {
    const color = statusColors[status] || '#6b7280';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">📍</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-500/15 border-red-400/30 text-red-300';
      case 'IN_PROGRESS':
        return 'bg-amber-500/15 border-amber-400/30 text-amber-300';
      case 'RESOLVED':
        return 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300';
      default:
        return 'bg-gray-500/15 border-gray-400/30 text-gray-300';
    }
  };

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'OPEN').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">Field Map · {selectedDomain}</h2>
          <div className="flex items-center justify-center h-80">
            <div className="text-[#7c8aa5]">Loading map data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">Field Map · {selectedDomain}</h2>
          <div className="flex items-center justify-center h-80">
            <div className="text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
        <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">
          Field Map · {selectedDomain || 'All Zones'}
        </h2>

        {/* Map Container */}
        <div className="mb-6 h-[400px] rounded-xl border border-cyan-400/10 bg-[#0b1628]/50 overflow-hidden">
          {complaints.length > 0 ? (
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              className="rounded-xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {complaints.map((complaint) => (
                <Marker
                  key={complaint.id}
                  position={[complaint.latitude, complaint.longitude]}
                  icon={createCustomIcon(complaint.status)}
                  eventHandlers={{
                    click: () => setSelectedComplaint(complaint),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-800 mb-1">{complaint.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{complaint.address}</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeStyles(complaint.status)}`}>
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
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <span className="mb-3 block text-5xl">📍</span>
                <p className="text-[#e6f1ff] font-semibold">No issues in your zone</p>
                <p className="text-sm text-[#7c8aa5]">Great work! Keep it up.</p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Complaint Details */}
        {selectedComplaint && (
          <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#e6f1ff]">
                  {selectedComplaint.title}
                </h3>
                <p className="text-sm text-[#7c8aa5] mt-1">
                  {selectedComplaint.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
                <p className="text-xs text-[#7c8aa5] mb-1">Status</p>
                <p className="text-sm font-bold text-cyan-300">{selectedComplaint.status}</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
                <p className="text-xs text-[#7c8aa5] mb-1">Priority</p>
                <p className="text-sm font-bold text-cyan-300">{selectedComplaint.priority}</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
                <p className="text-xs text-[#7c8aa5] mb-1">Category</p>
                <p className="text-sm font-bold text-cyan-300">{selectedComplaint.category}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-[#e6f1ff]">
            Issue Status Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-sm text-[#e6f1ff]">Open Issues</span>
              </div>
              <span className="text-sm font-semibold text-red-400">{stats.open}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-sm text-[#e6f1ff]">In Progress</span>
              </div>
              <span className="text-sm font-semibold text-amber-400">{stats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-[#e6f1ff]">Resolved</span>
              </div>
              <span className="text-sm font-semibold text-emerald-400">{stats.resolved}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-[#e6f1ff]">
            Coverage Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7c8aa5]">Total Issues Tracked</span>
              <span className="text-base font-bold text-cyan-300">
                {stats.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7c8aa5]">Active Issues</span>
              <span className="text-base font-bold text-cyan-300">
                {stats.open + stats.inProgress}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7c8aa5]">Resolution Rate</span>
              <span className="text-base font-bold text-emerald-400">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="h-1 bg-cyan-400/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMap;
