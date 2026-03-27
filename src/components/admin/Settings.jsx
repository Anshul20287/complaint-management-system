import React from 'react';

const Settings = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md max-w-lg">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Settings</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Admin Name"
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-[#0b1628]/70 border border-cyan-400/10 text-[#e6f1ff] placeholder-[#7c8aa5] outline-none focus:border-cyan-400/30 transition-colors"
        />

        <input
          type="password"
          placeholder="Change Password"
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-[#0b1628]/70 border border-cyan-400/10 text-[#e6f1ff] placeholder-[#7c8aa5] outline-none focus:border-cyan-400/30 transition-colors"
        />

        <button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-200">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;