import React, { useState, useEffect } from 'react';
import { getComplaintTimeline } from '../../services/complaintService';
import ImageGallery from './ImageGallery';

const ComplaintTimeline = ({ complaint, onClose }) => {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await getComplaintTimeline(complaint._id);
        setTimeline(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load timeline');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [complaint._id]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'created':
        return '📝';
      case 'status_change':
        return '🔄';
      case 'remark':
        return '💬';
      case 'proof_uploaded':
        return '📸';
      case 'verification':
        return '✅';
      default:
        return '📌';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'created':
        return 'bg-blue-500/15 border-blue-400/30';
      case 'status_change':
        return 'bg-cyan-500/15 border-cyan-400/30';
      case 'remark':
        return 'bg-purple-500/15 border-purple-400/30';
      case 'proof_uploaded':
        return 'bg-amber-500/15 border-amber-400/30';
      case 'verification':
        return 'bg-emerald-500/15 border-emerald-400/30';
      default:
        return 'bg-gray-500/15 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#e6f1ff]">Complaint Timeline</h2>
          <button
            onClick={onClose}
            className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-[#7c8aa5]">Loading timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#e6f1ff]">Complaint Timeline</h2>
          <button
            onClick={onClose}
            className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="rounded-xl bg-red-500/15 border border-red-400/30 p-4 text-sm text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#09111f]/95 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#e6f1ff]">Complaint Timeline</h2>
          <p className="text-sm text-[#7c8aa5] mt-1">#{complaint._id.slice(-6)} • {complaint.title}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Complaint Info */}
      <div className="mb-6 rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-[#7c8aa5]">Category</p>
            <p className="text-sm font-medium text-[#e6f1ff]">{timeline.complaint.category}</p>
          </div>
          <div>
            <p className="text-xs text-[#7c8aa5]">Priority</p>
            <p className="text-sm font-medium text-[#e6f1ff]">{timeline.complaint.priority}</p>
          </div>
          <div>
            <p className="text-xs text-[#7c8aa5]">Status</p>
            <p className="text-sm font-medium text-[#e6f1ff]">{timeline.complaint.status}</p>
          </div>
          <div>
            <p className="text-xs text-[#7c8aa5]">Address</p>
            <p className="text-sm font-medium text-[#e6f1ff]">{timeline.complaint.address}</p>
          </div>
        </div>
        
        {/* Alerts */}
        {timeline.complaint.geoVerification?.flagged && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-400/30 mb-4">
            <p className="text-xs text-red-300 font-medium">⚠️ Suspicious GPS Alert</p>
            <p className="text-xs text-red-300 mt-1">Work completed {timeline.complaint.geoVerification.distance}m from complaint location</p>
          </div>
        )}
      </div>

      {/* Proof Images */}
      {complaint.workProofImages && complaint.workProofImages.length > 0 && (
        <div className="mb-6">
          <ImageGallery images={complaint.workProofImages} title="Work Proof Images" />
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {timeline.timeline.map((event, index) => (
          <div key={index} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getEventColor(event.type)} border`}>
                {getEventIcon(event.type)}
              </div>
              {index < timeline.timeline.length - 1 && (
                <div className="w-0.5 h-12 bg-cyan-400/20 mt-2"></div>
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1 pt-1">
              <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-[#e6f1ff]">
                      {event.description}
                    </p>
                    {event.actor && (
                      <p className="text-xs text-[#7c8aa5] mt-1">
                        By: <span className="text-cyan-300">{event.actor.name}</span>
                        {event.role && <span className="text-[#7c8aa5]"> ({event.role})</span>}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-[#7c8aa5]">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Event-specific details */}
                {event.remark && (
                  <p className="text-sm text-[#7c8aa5] mt-2 p-2 rounded bg-[#0b1628]/50 border border-cyan-400/5">
                    💬 {event.remark}
                  </p>
                )}

                {event.status && event.type === 'status_change' && (
                  <p className="text-sm font-medium text-cyan-300 mt-2">
                    Status → <span className="font-bold">{event.status}</span>
                  </p>
                )}

                {event.message && (
                  <p className="text-sm text-[#7c8aa5] mt-2 italic">
                    {event.message}
                  </p>
                )}

                {event.proofCount && (
                  <p className="text-sm text-amber-300 mt-2">
                    📸 {event.proofCount} proof image(s) uploaded
                  </p>
                )}

                {event.feedback && (
                  <p className="text-sm text-[#7c8aa5] mt-2 p-2 rounded bg-[#0b1628]/50 border border-emerald-400/10">
                    Feedback: {event.feedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Close Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg bg-cyan-500/20 text-cyan-300 px-4 py-2 text-sm font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-400/30"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComplaintTimeline;
