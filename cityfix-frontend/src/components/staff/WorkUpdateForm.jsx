import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { complaintService } from "../../services/complaintService";

const WorkUpdateForm = ({ complaint, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    remark: "",
    beforeImages: [],
    afterImages: [],
    latitude: null,
    longitude: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [geoLocation, setGeoLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.log("Location access denied:", error)
      );
    }
  }, []);

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      [type]: files
    }));
  };

  const handleStartWork = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await complaintService.startWork(complaint._id, {
        remark: formData.remark || "Work started"
      });
      setSuccess("Work started successfully!");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start work");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWork = async () => {
    if (!formData.latitude || !formData.longitude) {
      setError("GPS location is required to complete work");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("remark", formData.remark || "Work completed");
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);

      // Append images
      formData.beforeImages.forEach((file) => {
        formDataToSend.append("proofImages", file);
      });
      formData.afterImages.forEach((file) => {
        formDataToSend.append("proofImages", file);
      });

      const response = await complaintService.completeWork(complaint._id, formDataToSend);
      
      if (response.data.geoData?.flagged) {
        setSuccess(`Work completed! ⚠️ GPS distance: ${response.data.geoData.distance}m from complaint location`);
      } else {
        setSuccess("Work completed successfully!");
      }
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete work");
    } finally {
      setLoading(false);
    }
  };

  const isStartingWork = complaint.status === "ASSIGNED" || complaint.status === "OPEN";
  const isCompletingWork = complaint.status === "IN_PROGRESS";

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#e6f1ff]">
            {isStartingWork ? "Start Work" : "Complete Work"}
          </h2>
          <p className="text-sm text-[#7c8aa5] mt-1">
            Complaint #{complaint._id.slice(-6)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Complaint Details */}
      <div className="mb-6 rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
        <h3 className="text-sm font-semibold text-[#e6f1ff] mb-3">Complaint Details</h3>
        <div className="space-y-2 text-sm text-[#7c8aa5]">
          <p><strong className="text-[#e6f1ff]">Title:</strong> {complaint.title}</p>
          <p><strong className="text-[#e6f1ff]">Category:</strong> {complaint.category}</p>
          <p><strong className="text-[#e6f1ff]">Location:</strong> {complaint.address}</p>
          <p><strong className="text-[#e6f1ff]">Priority:</strong> {complaint.priority}</p>
          <p><strong className="text-[#e6f1ff]">Status:</strong> {complaint.status}</p>
        </div>
      </div>

      {/* Remark Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#e6f1ff] mb-2">
          Work Remarks
        </label>
        <textarea
          value={formData.remark}
          onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
          placeholder={isStartingWork ? "Add remarks about work starting..." : "Describe the work completed..."}
          className="w-full rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 text-[#e6f1ff] placeholder-[#7c8aa5] p-3 text-sm focus:outline-none focus:border-cyan-400/30"
          rows="3"
        />
      </div>

      {/* Proof Images - Only for completing work */}
      {isCompletingWork && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#e6f1ff] mb-2">
              Before Images
            </label>
            <div className="rounded-lg border-2 border-dashed border-cyan-400/30 p-4 text-center cursor-pointer hover:border-cyan-400/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageChange(e, "beforeImages")}
                className="hidden"
                id="beforeImages"
              />
              <label htmlFor="beforeImages" className="cursor-pointer">
                <p className="text-[#7c8aa5]">Click to upload before images</p>
                {formData.beforeImages.length > 0 && (
                  <p className="text-xs text-cyan-400 mt-1">{formData.beforeImages.length} file(s) selected</p>
                )}
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#e6f1ff] mb-2">
              After Images
            </label>
            <div className="rounded-lg border-2 border-dashed border-cyan-400/30 p-4 text-center cursor-pointer hover:border-cyan-400/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageChange(e, "afterImages")}
                className="hidden"
                id="afterImages"
              />
              <label htmlFor="afterImages" className="cursor-pointer">
                <p className="text-[#7c8aa5]">Click to upload after images</p>
                {formData.afterImages.length > 0 && (
                  <p className="text-xs text-cyan-400 mt-1">{formData.afterImages.length} file(s) selected</p>
                )}
              </label>
            </div>
          </div>

          {/* GPS Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#e6f1ff] mb-2">
              GPS Location
            </label>
            <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-3 text-sm">
              {geoLocation ? (
                <div className="space-y-2 text-[#7c8aa5]">
                  <p>📍 Latitude: <span className="text-cyan-300">{formData.latitude?.toFixed(6)}</span></p>
                  <p>📍 Longitude: <span className="text-cyan-300">{formData.longitude?.toFixed(6)}</span></p>
                  <p className="text-xs text-green-400">✓ Location captured</p>
                </div>
              ) : (
                <p className="text-red-400">Location not available. Please enable location access.</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/15 border border-red-400/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/15 border border-green-400/30 p-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-cyan-400/20 bg-transparent px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-400/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={isStartingWork ? handleStartWork : handleCompleteWork}
          disabled={loading}
          className="flex-1 rounded-lg bg-cyan-500/20 text-cyan-300 px-4 py-2.5 text-sm font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : isStartingWork ? "Start Work" : "Complete Work"}
        </button>
      </div>
    </div>
  );
};

export default WorkUpdateForm;
