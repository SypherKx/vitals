import React from 'react';
import { Activity, Plus, AlertTriangle, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, anomalyCount, onQuickLog, onGoLanding, onLogout }) {
  const currentView = activeTab;
  const setView = setActiveTab;
  const alertsCount = anomalyCount;
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'daily-log', label: 'Daily Log' },
    { id: 'body-comp', label: 'Body Comp' },
    { id: 'cardio-risk', label: 'Cardio Risk' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'medications', label: 'Meds' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="top-nav no-print">
      <div className="container nav-inner">
        <button
          onClick={onGoLanding}
          className="nav-brand"
          title="Back to Landing Page"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <Activity size={22} strokeWidth={2.2} />
          <span>Vitals</span>
        </button>

        <nav>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => setView(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {alertsCount > 0 && (
            <button
              onClick={() => setView('cardio-risk')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#fff0f0',
                border: '1px solid #ffd0d0',
                color: 'var(--error)',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Clinical Anomaly Alert Active"
            >
              <AlertTriangle size={14} />
              <span>{alertsCount}</span>
            </button>
          )}

          <button
            type="button"
            className="btn-outline"
            onClick={onQuickLog}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <Plus size={14} />
            <span>Log</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="btn-outline"
            title="Log out to Landing Page"
            style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--muted)', borderColor: 'var(--hairline-strong)' }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

