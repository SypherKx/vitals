import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import DailyLog from './components/DailyLog';
import BodyCompLab from './components/BodyCompLab';
import CardioRisk from './components/CardioRisk';
import NutritionLab from './components/NutritionLab';
import Workouts from './components/Workouts';
import MedicationManager from './components/MedicationManager';
import Settings from './components/Settings';
import ReportModal from './components/ReportModal';

import {
  loadProfile,
  saveProfile,
  loadLogs,
  saveLogs,
  loadWorkouts,
  saveWorkouts,
  loadMedications,
  saveMedications,
  exportDataJSON,
  exportLogsCSV,
  importDataJSON,
  resetAllData,
  seedClinicalDemoData
} from './services/storageService';

import {
  evaluateClinicalAnomalies,
  generateHeuristicInsights,
  computeStreaks,
  evaluateBadges
} from './services/clinicalMath';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fff', color: '#de2828', fontFamily: 'sans-serif' }}>
          <h2>Clinical App Rendering Exception</h2>
          <pre style={{ background: '#f8f8f8', padding: '1rem', border: '1px solid #ddd', overflowX: 'auto' }}>
            {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
          </pre>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ marginTop: '1rem', padding: '8px 16px', background: '#008254', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Clear LocalStorage &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TAB_ORDER = [
  'dashboard',
  'daily-log',
  'body-comp',
  'cardio-risk',
  'nutrition',
  'workouts',
  'medications',
  'settings'
];

export default function App() {
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('vitals_session_active') === 'false';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transitionDir, setTransitionDir] = useState('forward');
  const [navSweepKey, setNavSweepKey] = useState(0);

  const navigateTab = (nextTab) => {
    if (nextTab === activeTab) return;
    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = TAB_ORDER.indexOf(nextTab);
    setTransitionDir(nextIdx >= prevIdx ? 'forward' : 'backward');
    setNavSweepKey(k => k + 1);
    setActiveTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [profile, setProfile] = useState(() => {
    let p = loadProfile();
    if (!p || !p.height || p.name === 'Alex Morgan' || p.name === 'Alex Vance') {
      seedClinicalDemoData();
      p = loadProfile() || {
        name: 'Ashutosh',
        age: 21,
        gender: 'male',
        height: 175,
        weight: 71.4,
        currentWeight: 71.4,
        startWeight: 73.5,
        targetWeight: 69.0,
        calorieTarget: 2350,
        waterTarget: 2500,
        sleepTarget: 8.0,
        stepsTarget: 8000
      };
    }
    return p;
  });
  const [logs, setLogs] = useState(() => {
    const existing = loadLogs();
    if (!existing || existing.length === 0) {
      return seedClinicalDemoData();
    }
    return existing;
  });
  const [workouts, setWorkouts] = useState(() => loadWorkouts());
  const [medications, setMedications] = useState(() => loadMedications());

  const [isReportOpen, setIsReportOpen] = useState(false);

  // Derived clinical calculations
  const anomalies = evaluateClinicalAnomalies(logs);
  const insights = generateHeuristicInsights(logs, profile);
  const streaks = computeStreaks(logs);
  const badges = evaluateBadges(logs, profile, streaks);

  const handleSaveLog = (entry) => {
    const updated = [entry, ...logs.filter(l => l.date !== entry.date)].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setLogs(updated);
    saveLogs(updated);
  };

  const handleDeleteLog = (date) => {
    if (window.confirm(`Delete log entry for ${date}?`)) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      saveLogs(updated);
    }
  };

  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleAddWorkout = (w) => {
    const updated = [w, ...workouts];
    setWorkouts(updated);
    saveWorkouts(updated);
  };

  const handleAddMedication = (med) => {
    const updated = [med, ...medications];
    setMedications(updated);
    saveMedications(updated);
  };

  const handleToggleMedication = (id) => {
    const updated = medications.map(m =>
      m.id === id ? { ...m, takenToday: !m.takenToday } : m
    );
    setMedications(updated);
    saveMedications(updated);
  };

  const handleDeleteMedication = (id) => {
    const updated = medications.filter(m => m.id !== id);
    setMedications(updated);
    saveMedications(updated);
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importDataJSON(event.target.result);
        if (result.success) {
          alert('Database restored successfully from local JSON backup!');
          window.location.reload();
        } else {
          alert('Failed to parse file: ' + result.error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm('WARNING: Irreversibly delete all local clinical data?')) {
      resetAllData();
      window.location.reload();
    }
  };

  const handleEnterApp = () => {
    localStorage.setItem('vitals_session_active', 'true');
    setShowLanding(false);
    setTransitionDir('forward');
    setNavSweepKey(k => k + 1);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.setItem('vitals_session_active', 'false');
    setShowLanding(true);
  };

  const handleStartFresh = () => {
    if (window.confirm('Start a fresh session? This resets demo data and opens a clean profile.')) {
      resetAllData();
      localStorage.setItem('vitals_session_active', 'true');
      window.location.reload();
    }
  };

  if (showLanding) {
    return (
      <ErrorBoundary>
        <LandingPage
          profile={profile}
          onEnterApp={handleEnterApp}
          onStartFresh={handleStartFresh}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-layout">
        {navSweepKey > 0 && <div key={`sweep-${navSweepKey}`} className="route-progress-bar" />}

        {/* Top Desktop Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={navigateTab}
          anomalyCount={anomalies.length}
          onQuickLog={() => navigateTab('daily-log')}
          onGoLanding={() => setShowLanding(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Area with Directional Page Transition */}
        <main className="main-content">
          <div key={activeTab} className={transitionDir === 'forward' ? 'page-transition-forward' : 'page-transition-backward'}>
            {activeTab === 'dashboard' ? (
              <Dashboard
                profile={profile}
                logs={logs}
                anomalies={anomalies}
                insights={insights}
                streaks={streaks}
                badges={badges}
                setActiveTab={navigateTab}
                onQuickLog={() => navigateTab('daily-log')}
              />
            ) : (
              <div className="container">
                {activeTab === 'daily-log' && (
                  <DailyLog
                    logs={logs}
                    profile={profile}
                    onSaveLog={handleSaveLog}
                    onDeleteLog={handleDeleteLog}
                  />
                )}

                {activeTab === 'body-comp' && (
                  <BodyCompLab
                    profile={profile}
                    onUpdateCircumferences={(circs) => handleUpdateProfile({ ...profile, ...circs })}
                  />
                )}

                {activeTab === 'cardio-risk' && (
                  <CardioRisk
                    profile={profile}
                    latestLog={logs[0]}
                  />
                )}

                {activeTab === 'nutrition' && (
                  <NutritionLab
                    profile={profile}
                  />
                )}

                {activeTab === 'workouts' && (
                  <Workouts
                    workouts={workouts}
                    onAddWorkout={handleAddWorkout}
                  />
                )}

                {activeTab === 'medications' && (
                  <MedicationManager
                    medications={medications}
                    onAddMedication={handleAddMedication}
                    onToggleMedication={handleToggleMedication}
                    onDeleteMedication={handleDeleteMedication}
                  />
                )}

                {activeTab === 'settings' && (
                  <Settings
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    onExportJSON={exportDataJSON}
                    onExportCSV={() => exportLogsCSV(logs)}
                    onImportClick={handleImportFile}
                    onResetDatabase={handleReset}
                    onOpenReport={() => setIsReportOpen(true)}
                  />
                )}
              </div>
            )}
          </div>
        </main>

        {/* Mobile Fixed Bottom Nav */}
        <MobileNav
          activeTab={activeTab}
          setActiveTab={navigateTab}
          anomalyCount={anomalies.length}
        />

        {/* Telehealth Dossier Report Modal */}
        {isReportOpen && (
          <ReportModal
            profile={profile}
            logs={logs}
            anomalies={anomalies}
            onClose={() => setIsReportOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
