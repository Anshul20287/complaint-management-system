import React from 'react';
import { alerts as staticAlerts } from '../../data/adminData';

const alertStyles = {
  warn: {
    wrapper: 'bg-amber-400/10 border border-amber-400/15',
    title: 'text-amber-300',
  },
  info: {
    wrapper: 'bg-cyan-400/10 border border-cyan-400/15',
    title: 'text-cyan-300',
  },
};

// Map admin alerts to citizen-style format if needed
const Alerts = () => {
  const alerts = staticAlerts && staticAlerts.length > 0 
    ? staticAlerts.map(a => ({ 
        title: a.title, 
        time: '2 hours ago',
        type: a.type === 'warn' ? 'warn' : 'info' 
      }))
    : [];

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          Alerts
        </h2>
        <button className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const s = alertStyles[alert.type] || alertStyles.info;
            return (
              <div
                key={index}
                className={`rounded-xl border px-4 py-3 ${s.wrapper}`}
              >
                <div className="mb-1 flex items-center justify-between gap-4">
                  <span className={`text-xs font-medium ${s.title}`}>
                    {alert.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-[#7c8aa5]">{alert.time}</span>
                </div>
                <p className="text-sm text-[#e6f1ff]">{alert.title}</p>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-4">
            <p className="text-sm text-[#7c8aa5]">No alerts at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;