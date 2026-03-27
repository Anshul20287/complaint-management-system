import React, { useState } from "react";

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

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.location.trim()) {
      alert("Please enter a location.");
      return;
    }

    alert(`Report submitted!\nCategory: ${form.category}\nLocation: ${form.location}`);

    setForm({
      category: categories[0],
      location: "",
      description: "",
    });
    setPhoto(null);
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
          <option key={category} value={category} className="bg-[#0b1628] text-[#e6f1ff]">
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
          <span className="truncate">{photo ? photo : "Attach Photo"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files[0]?.name || null)}
          />
        </label>

        <button
          onClick={handleSubmit}
          className="flex-1 rounded-xl bg-[#19e6d2] px-5 py-3 text-sm font-semibold text-[#031019] transition-all hover:brightness-110"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;