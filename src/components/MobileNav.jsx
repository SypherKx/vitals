import React from 'react';
import { LayoutDashboard, Calendar, Dumbbell, ShieldAlert, HeartPulse, PieChart, Pill, Settings } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, anomalyCount }) {
  const tabs = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'daily-log', label: 'Log', icon: Calendar },
    { id: 'cardio-risk', label: 'Cardio', icon: HeartPulse },
    { id: 'body-comp', label: 'Body', icon: Dumbbell },
    { id: 'nutrition', label: 'Macros', icon: PieChart },
    { id: 'medications', label: 'Meds', icon: Pill },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={18} />
                {tab.id === 'cardio-risk' && anomalyCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -5,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'var(--error)'
                    }}
                  />
                )}
              </div>
              <span className="mobile-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
