import React, { useState } from "react";
import { createComplaint } from "../../services/complaintService";

const categories = [
  "Pothole/Road Damage",
  "Sanitation",
  "Electricity",
  "Water Problems",
  "Environmental factors",
  "Other",
];

const ReportForm = () => {
  const [form, setForm] = useState({
    category: categories[0],
    location: "",
    description: "",
  });

  // CHANGED: now storing actual file, not only file name
  const [photo, setPhoto] = useState(null);

  // CHANGED: added loading state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // CHANGED: now this function calls backend API
  const handleSubmit = async () => {
    if (!form.location.trim()) {
      alert("Please enter a location.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // CHANGED: backend requires title
      formData.append("title", form.category);

      formData.append("category", form.category);
      formData.append("description", form.description);

      // CHANGED: using location as address for backend
      formData.append("address", form.location);

      // CHANGED: default priority - must match backend enum
      formData.append("priority", "HIGH");

      // CHANGED: dummy coordinates for now
      // Later we can connect map/geolocation
      formData.append("latitude", 25.4358);
      formData.append("longitude", 81.8463);

      // CHANGED: attach actual image file
      if (photo) {
        formData.append("image", photo);
      }

      const res = await createComplaint(formData);

      console.log("COMPLAINT CREATED:", res.data);

      alert("Complaint submitted successfully!");

      setForm({
        category: categories[0],
        location: "",
        description: "",
      });

      setPhoto(null);

    } catch (error) {
      console.log("COMPLAINT CREATE ERROR:", error);

      alert(
        error.response?.data?.message || "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-cyan-400/10 bg-[#0b1628]/80 px-4 py-3 text-sm text-[#e6f1ff] outline-none transition-all placeholder:text-[#7c8aa5] focus:border-[#19e6d2] focus:ring-2 focus:ring-cyan-300/10";

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 shadow-[0_0_0_1px_rgba(25,230,210,0.02)] backdrop-blur-md">
      <h2 className="mb-1 text-base font-semibold text-[#e6f1ff]">
        Report a New Issue
      </h2>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className={`${inputClass} appearance-none`}
      >
        {categories.map((category) => (
          <option
            key={category}
            value={category}
            className="bg-[#0b1628] text-[#e6f1ff]"
          >
            {category}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="location"
        placeholder="Location: e.g. SV Road, Andheri West"
        value={form.location}
        onChange={handleChange}
        className={inputClass}
      />

      <textarea
        name="description"
        placeholder="Description..."
        value={form.description}
        onChange={handleChange}
        className={`${inputClass} min-h-[100px] resize-y`}
      />

      <div className="mt-1 flex gap-3">
        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 truncate rounded-xl border border-cyan-400/10 bg-[#0b1628]/80 px-5 py-3 text-sm font-medium text-[#7c8aa5] transition-all hover:border-cyan-300/30 hover:text-[#e6f1ff]">
          <span>📷</span>

          {/* CHANGED: show selected file name */}
          <span className="truncate">
            {photo ? photo.name : "Attach Photo"}
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"

            // CHANGED: storing file object
            onChange={(e) => setPhoto(e.target.files[0] || null)}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 rounded-xl bg-[#19e6d2] px-5 py-3 text-sm font-semibold text-[#031019] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

export default ReportForm;