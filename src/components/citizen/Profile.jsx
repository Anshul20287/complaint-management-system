import React, { useState } from "react";

const Profile = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    name: "Anshul Bansal",
    email: "anshul@email.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
  });

  const [form, setForm] = useState(user);

  const handleSave = () => {
    setUser(form);
    setShowEdit(false);
  };

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md relative">
      <h2 className="mb-6 text-xl font-semibold text-[#e6f1ff]">Profile</h2>

      {/* PROFILE INFO */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl text-cyan-300">
          👤
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#e6f1ff]">{user.name}</h3>
          <p className="text-sm text-[#7c8aa5]">{user.email}</p>
          <p className="mt-1 text-sm text-[#7c8aa5]">Citizen ID: CTZ-20481</p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-5">
          <p className="mb-1 text-sm text-[#7c8aa5]">Phone</p>
          <p className="text-[#e6f1ff]">{user.phone}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-5">
          <p className="mb-1 text-sm text-[#7c8aa5]">City</p>
          <p className="text-[#e6f1ff]">{user.city}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-5">
          <p className="mb-1 text-sm text-[#7c8aa5]">Total Reports</p>
          <p className="text-[#e6f1ff]">8</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-5">
          <p className="mb-1 text-sm text-[#7c8aa5]">Resolved Reports</p>
          <p className="text-[#19e6d2]">5</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setShowEdit(true)}
          className="rounded-xl bg-[#19e6d2] px-5 py-3 text-sm font-semibold text-[#031019] hover:brightness-110"
        >
          Edit Profile
        </button>

        <button
          onClick={() => setShowPassword(true)}
          className="rounded-xl border border-cyan-400/15 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15"
        >
          Change Password
        </button>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-[#09111f] p-6 border border-cyan-400/10">
            <h3 className="mb-4 text-lg font-semibold text-white">Edit Profile</h3>

            <input
              className="w-full mb-3 p-3 rounded-lg bg-[#0b1628] border border-cyan-400/10 text-white"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full mb-3 p-3 rounded-lg bg-[#0b1628] border border-cyan-400/10 text-white"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              className="w-full mb-4 p-3 rounded-lg bg-[#0b1628] border border-cyan-400/10 text-white"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 text-sm text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#19e6d2] rounded-lg text-black font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {showPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-[#09111f] p-6 border border-cyan-400/10">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Change Password
            </h3>

            <input
              type="password"
              className="w-full mb-3 p-3 rounded-lg bg-[#0b1628] border border-cyan-400/10 text-white"
              placeholder="Current Password"
            />

            <input
              type="password"
              className="w-full mb-3 p-3 rounded-lg bg-[#0b1628] border border-cyan-400/10 text-white"
              placeholder="New Password"
            />

            <input
              type="password"
              className="w-full mb-4 p-3 rounded-lg bg-[#0b1628] border border-cyan-400/10 text-white"
              placeholder="Confirm Password"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPassword(false)}
                className="px-4 py-2 text-sm text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  alert("Password changed successfully!");
                  setShowPassword(false);
                }}
                className="px-4 py-2 bg-[#19e6d2] rounded-lg text-black font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;