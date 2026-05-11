import React from 'react';

const alertStyles = {
  warn: {
    wrapper: 'bg-amber-400/10 border border-amber-400/15',
    title: 'text-amber-300',
    icon: '⚠️'
  },
  info: {
    wrapper: 'bg-cyan-400/10 border border-cyan-400/15',
    title: 'text-cyan-300',
    icon: 'ℹ️'
  },
  error: {
    wrapper: 'bg-red-400/10 border border-red-400/15',
    title: 'text-red-300',
    icon: '❌'
  },
  success: {
    wrapper: 'bg-emerald-400/10 border border-emerald-400/15',
    title: 'text-emerald-300',
    icon: '✓'
  }
};

const Alerts = ({ alerts = [] }) => {
  const [dismissedAlerts, setDismissedAlerts] = React.useState(new Set());

  const handleDismiss = (index) => {
    setDismissedAlerts(prev => new Set([...prev, index]));
  };

  const filterAlerts = alerts.filter((_, index) => !dismissedAlerts.has(index));

  // Categorize alerts by severity
  const criticalAlerts = filterAlerts.filter(a => a.type === 'error' || a.type === 'warn');
  const normalAlerts = filterAlerts.filter(a => a.type === 'info' || a.type === 'success');

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-[#e6f1ff]">
            Alerts & Notifications
          </h2>
          {criticalAlerts.length > 0 && (
            <div className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-400/20">
              <span className="text-xs font-medium text-red-300">{criticalAlerts.length} Critical</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setDismissedAlerts(new Set())}
          className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          {dismissedAlerts.size > 0 ? 'Show All' : 'Clear'}
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-red-300 mb-3 uppercase">Critical Alerts</p>
            <div className="space-y-3">
              {criticalAlerts.map((alert, index) => {
                const s = alertStyles[alert.type] || alertStyles.warn;
                return (
                  <div
                    key={`critical-${index}`}
                    className={`rounded-xl border px-4 py-3 flex items-start justify-between gap-3 ${s.wrapper}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{s.icon}</span>
                        <span className={`text-xs font-medium ${s.title}`}>
                          {(alert.type || 'warn').toUpperCase()}
                        </span>
                        {alert.time && (
                          <span className="text-xs text-[#7c8aa5] ml-auto">{alert.time}</span>
                        )}
                      </div>
                      <p className="text-sm text-[#e6f1ff] font-medium">{alert.title}</p>
                      {alert.meta && (
                        <p className="mt-2 text-xs text-[#7c8aa5]">{alert.meta}</p>
                      )}
                      {alert.details && (
                        <p className="mt-2 text-xs text-[#7c8aa5] bg-black/30 rounded p-2">
                          {alert.details}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDismiss(filterAlerts.indexOf(alert))}
                      className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors mt-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Normal Alerts */}
        {normalAlerts.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-cyan-300 mb-3 uppercase">Notifications</p>
            <div className="space-y-3">
              {normalAlerts.map((alert, index) => {
                const s = alertStyles[alert.type] || alertStyles.info;
                return (
                  <div
                    key={`normal-${index}`}
                    className={`rounded-xl border px-4 py-3 flex items-start justify-between gap-3 ${s.wrapper}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{s.icon}</span>
                        <span className={`text-xs font-medium ${s.title}`}>
                          {(alert.type || 'info').toUpperCase()}
                        </span>
                        {alert.time && (
                          <span className="text-xs text-[#7c8aa5] ml-auto">{alert.time}</span>
                        )}
                      </div>
                      <p className="text-sm text-[#e6f1ff]">{alert.title}</p>
                      {alert.meta && (
                        <p className="mt-1 text-xs text-[#7c8aa5]">{alert.meta}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDismiss(filterAlerts.indexOf(alert))}
                      className="text-[#7c8aa5] hover:text-[#e6f1ff] transition-colors mt-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filterAlerts.length === 0 && (
          <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-8 text-center">
            <p className="text-lg text-[#7c8aa5]">✨ All clear!</p>
            <p className="text-sm text-[#7c8aa5] mt-1">No active alerts or notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;