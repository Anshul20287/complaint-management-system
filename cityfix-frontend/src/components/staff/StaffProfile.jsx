import React, { useState } from "react";
import { staffUser } from "../../data/staffData";

const StaffProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: staffUser.name,
    zone: staffUser.zone,
    email: "ravi.s@cityfix.gov",
    phone: "+91 98765 43210",
    designation: "Field Staff",
    experience: "3 years",
    joinDate: "Jan 2023",
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-3xl font-bold text-[#030712]">
              {staffUser.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#e6f1ff]">
                {profile.name}
              </h1>
              <p className="text-sm text-[#7c8aa5] mt-1">{profile.designation}</p>
              <p className="text-xs text-cyan-300 font-medium mt-2">
                {profile.zone}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-1">Issues Resolved</p>
            <p className="text-2xl font-bold text-emerald-400">156</p>
          </div>
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-1">Current Assignments</p>
            <p className="text-2xl font-bold text-cyan-300">14</p>
          </div>
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-1">Avg. Resolution</p>
            <p className="text-2xl font-bold text-cyan-300">18h</p>
          </div>
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-1">Satisfaction Rating</p>
            <p className="text-2xl font-bold text-amber-300">4.8/5 ⭐</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
        <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
          Contact Information
        </h2>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/50 px-4 py-2.5 text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/50 px-4 py-2.5 text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/50 px-4 py-2.5 text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 py-2.5 text-sm font-semibold text-[#030712] hover:shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer">
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-lg border border-cyan-400/10 bg-cyan-400/5 py-2.5 text-sm font-medium text-[#7c8aa5] hover:bg-cyan-400/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-4 border border-cyan-400/10">
              <div>
                <p className="text-xs text-[#7c8aa5] mb-1">Email Address</p>
                <p className="text-sm text-[#e6f1ff] font-medium">
                  {profile.email}
                </p>
              </div>
              <span className="text-xl">📧</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-4 border border-cyan-400/10">
              <div>
                <p className="text-xs text-[#7c8aa5] mb-1">Phone Number</p>
                <p className="text-sm text-[#e6f1ff] font-medium">
                  {profile.phone}
                </p>
              </div>
              <span className="text-xl">📱</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-4 border border-cyan-400/10">
              <div>
                <p className="text-xs text-[#7c8aa5] mb-1">Designation</p>
                <p className="text-sm text-[#e6f1ff] font-medium">
                  {profile.designation}
                </p>
              </div>
              <span className="text-xl">👨‍💼</span>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
        <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
          Employment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-2">Experience</p>
            <p className="text-lg font-semibold text-[#e6f1ff]">
              {profile.experience}
            </p>
          </div>
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-2">Joined</p>
            <p className="text-lg font-semibold text-[#e6f1ff]">
              {profile.joinDate}
            </p>
          </div>
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-2">Assigned Zone</p>
            <p className="text-lg font-semibold text-[#19e6d2]">
              {profile.zone}
            </p>
          </div>
          <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
            <p className="text-xs text-[#7c8aa5] mb-2">Status</p>
            <p className="text-lg font-semibold">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
