import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const StaffProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    resolved: 0,
    assigned: 0,
    avgResolution: "18h",
    rating: "4.8/5"
  });
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    assignedCategories: user?.assignedCategories || [],
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const profileRes = await api.get("/auth/profile");
        if (profileRes.data.success) {
          const userData = profileRes.data.user;
          setProfile({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            address: userData.address || "",
            assignedCategories: userData.assignedCategories || [],
          });
        }

        // Fetch staff dashboard stats
        const dashRes = await api.get("/dashboard/staff");
        if (dashRes.data.success) {
          const dashboardStats = dashRes.data.stats;
          setStats({
            assigned: dashboardStats.assignedToMe || 0,
            resolved: dashboardStats.resolved || 0,
            avgResolution: "18h",
            rating: "4.8/5"
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <div className="text-center text-[#7c8aa5]">Loading profile...</div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-3xl font-bold text-[#030712]">
                  {profile.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "ST"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#e6f1ff]">
                    {profile.name}
                  </h1>
                  <p className="text-sm text-[#7c8aa5] mt-1">Field Staff</p>
                  <p className="text-xs text-cyan-300 font-medium mt-2">
                    {profile.address || "Zone not assigned"}
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
                <p className="text-2xl font-bold text-emerald-400">{stats.resolved}</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
                <p className="text-xs text-[#7c8aa5] mb-1">Current Assignments</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.assigned}</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
                <p className="text-xs text-[#7c8aa5] mb-1">Avg. Resolution</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.avgResolution}</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
                <p className="text-xs text-[#7c8aa5] mb-1">Satisfaction Rating</p>
                <p className="text-2xl font-bold text-amber-300">{stats.rating} ⭐</p>
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
                    disabled
                    className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/50 px-4 py-2.5 text-[#7c8aa5] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none transition-colors opacity-60"
                  />
                  <p className="text-xs text-[#7c8aa5] mt-1">Email cannot be changed</p>
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
                <div>
                  <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
                    Address / Zone
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
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
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                  <span className="text-xl">📱</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-4 border border-cyan-400/10">
                  <div>
                    <p className="text-xs text-[#7c8aa5] mb-1">Address / Zone</p>
                    <p className="text-sm text-[#e6f1ff] font-medium">
                      {profile.address || "Not provided"}
                    </p>
                  </div>
                  <span className="text-xl">📍</span>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Categories */}
          <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
            <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
              Assigned Categories
            </h2>

            {profile.assignedCategories && profile.assignedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {profile.assignedCategories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-sm text-cyan-300"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    {category}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#7c8aa5]">No categories assigned yet.</p>
            )}
          </div>

          {/* Employment Status */}
          <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
            <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
              Employment Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
                <p className="text-xs text-[#7c8aa5] mb-2">Current Status</p>
                <p className="text-lg font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
                <p className="text-xs text-[#7c8aa5] mb-2">Designation</p>
                <p className="text-lg font-semibold text-[#e6f1ff]">Field Staff</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffProfile;
