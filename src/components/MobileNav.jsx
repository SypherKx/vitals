import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  HeartPulse,
  Dumbbell,
  MoreHorizontal,
  PieChart,
  Pill,
  Settings,
  Activity,
  X,
  LogOut
} from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, anomalyCount, onLogout }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryTabs = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'daily-log', label: 'Log', icon: Calendar },
    { id: 'cardio-risk', label: 'Cardio', icon: HeartPulse },
    { id: 'workouts', label: 'Workouts', icon: Activity },
  ];

  const moreTabs = [
    { id: 'body-comp', label: 'Body Comp Lab', desc: 'U.S. Navy body fat & lean mass', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition & Macros', desc: 'Atwater protein/carb/fat split', icon: PieChart },
    { id: 'medications', label: 'Medications', desc: 'Daily supplement & pharma adherence', icon: Pill },
    { id: 'settings', label: 'Settings & Export', desc: 'Profile, JSON/CSV & PDF Dossier', icon: Settings },
  ];

  const isMoreActive = moreTabs.some(t => t.id === activeTab);

  const handleSelect = (id) => {
    setActiveTab(id);
    setMoreOpen(false);
  };

  return (
    <>
      {/* Slide-up Sheet for Secondary Modules */}
      {moreOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="mobile-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="text-eyebrow" style={{ color: 'var(--primary)' }}>ALL MODULES</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', padding: '6px', cursor: 'pointer' }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {moreTabs.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                      background: active ? 'var(--mint-50)' : 'var(--canvas)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      minHeight: '52px'
                    }}
                  >
                    <div className="stat-card-icon">
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.desc}</div>
                    </div>
                  </button>
                );
              })}

              {onLogout && (
                <button
                  type="button"
                  onClick={() => { setMoreOpen(false); onLogout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    marginTop: '6px',
                    borderRadius: '8px',
                    border: '1px solid var(--hairline-strong)',
                    background: 'var(--canvas-soft)',
                    color: 'var(--body)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    minHeight: '46px'
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout to Landing Page</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Dock (iPhone & Tablet Safe-Area Ready) */}
      <nav className="mobile-bottom-nav no-print">
        <div className="mobile-nav-inner">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelect(tab.id)}
                className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              >
                <div style={{ position: 'relative', display: 'flex' }}>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.75} />
                  {tab.id === 'cardio-risk' && anomalyCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -3,
                        right: -5,
                        width: 8,
                        height: 8,
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

          <button
            type="button"
            onClick={() => setMoreOpen(prev => !prev)}
            className={`mobile-tab-btn ${isMoreActive || moreOpen ? 'active' : ''}`}
          >
            <MoreHorizontal size={20} />
            <span className="mobile-tab-label">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
