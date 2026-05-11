import React, { useState } from 'react';
import { changePassword } from '../../services/authService';

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setMessage('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md max-w-lg">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Change Password</h2>

      {message && (
        <div className="mb-4 rounded-lg border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 text-sm rounded-lg bg-[#0b1628]/70 border border-cyan-400/10 text-[#e6f1ff] placeholder-[#7c8aa5] outline-none focus:border-cyan-400/30 transition-colors"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 text-sm rounded-lg bg-[#0b1628]/70 border border-cyan-400/10 text-[#e6f1ff] placeholder-[#7c8aa5] outline-none focus:border-cyan-400/30 transition-colors"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7c8aa5] mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 text-sm rounded-lg bg-[#0b1628]/70 border border-cyan-400/10 text-[#e6f1ff] placeholder-[#7c8aa5] outline-none focus:border-cyan-400/30 transition-colors"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-200 disabled:cursor-not-allowed"
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default Settings;