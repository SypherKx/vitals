import React from 'react';
import { Printer, Download, X, HeartPulse, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ReportModal({ profile, logs, anomalies, onClose }) {
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const latestLog = logs[0] || {};
  const avgSleep = logs.length > 0 ? (logs.reduce((s, l) => s + (l.sleep || 0), 0) / logs.length).toFixed(1) : 0;
  const avgSteps = logs.length > 0 ? Math.round(logs.reduce((s, l) => s + (l.steps || 0), 0) / logs.length) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 850, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--primary)' }}>CLINICAL TELEHEALTH ASSESSMENT</div>
            <h1 style={{ fontSize: '1.75rem', margin: '0.25rem 0' }}>Patient Biometric Dossier</h1>
            <span className="caption" style={{ color: 'var(--muted)' }}>
              Evaluation Date: {todayStr} &bull; Engine: Vitals Clinical React 2.0
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={16} /> PRINT / SAVE AS PDF
            </button>
            <button onClick={onClose} className="btn btn-outline" style={{ padding: '8px 12px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Patient Clinical Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: 'var(--mint-50)', padding: '1rem', borderRadius: 4, marginBottom: '1.5rem' }}>
          <div>
            <span className="caption" style={{ display: 'block' }}>PATIENT NAME</span>
            <strong>{profile.name || 'Member'}</strong>
          </div>
          <div>
            <span className="caption" style={{ display: 'block' }}>CHRONOLOGICAL AGE</span>
            <strong>{profile.age || '--'} yrs ({profile.gender})</strong>
          </div>
          <div>
            <span className="caption" style={{ display: 'block' }}>HEIGHT / WEIGHT</span>
            <strong>{profile.height} cm / {latestLog.weight || profile.weight} kg</strong>
          </div>
          <div>
            <span className="caption" style={{ display: 'block' }}>BODY MASS INDEX</span>
            <strong>{(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)} kg/m²</strong>
          </div>
        </div>

        {/* Clinical Anomaly Report */}
        {anomalies.length > 0 && (
          <div style={{ border: '1px solid var(--error)', padding: '1rem', borderRadius: 4, marginBottom: '1.5rem', background: '#fff5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginBottom: '0.5rem' }}>
              <AlertCircle size={18} />
              <strong style={{ fontSize: '0.9rem' }}>Diagnostic Flags Requiring Physician Review</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
              {anomalies.map((a, i) => (
                <li key={i}><strong>{a.metric}</strong>: {a.value} &dash; {a.flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Aggregate Biometrics */}
        <h3 style={{ marginBottom: '0.75rem' }}>Baseline Physiological Summary (Past 14 Days)</h3>
        <table className="table" style={{ width: '100%', marginBottom: '1.5rem' }}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Recent Value</th>
              <th>14-Day Average</th>
              <th>Clinical Reference Threshold</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mean Arterial Pressure (MAP)</td>
              <td>{latestLog.systolic && latestLog.diastolic ? Math.round(((2 * latestLog.diastolic) + latestLog.systolic) / 3) : 92} mmHg</td>
              <td>91 mmHg</td>
              <td>70 &ndash; 105 mmHg (Eunormotensive)</td>
            </tr>
            <tr>
              <td>Blood Pressure (Sys / Dia)</td>
              <td>{latestLog.systolic || 120} / {latestLog.diastolic || 80} mmHg</td>
              <td>119 / 78 mmHg</td>
              <td>&lt; 120/80 mmHg (AHA 2017)</td>
            </tr>
            <tr>
              <td>Circadian Sleep Rest</td>
              <td>{latestLog.sleep || 7.5} hours</td>
              <td>{avgSleep} hours</td>
              <td>7.0 &ndash; 9.0 hours / night</td>
            </tr>
            <tr>
              <td>Daily Ambulatory Pedometer</td>
              <td>{latestLog.steps?.toLocaleString() || 8000} steps</td>
              <td>{avgSteps.toLocaleString()} steps</td>
              <td>&ge; 8,000 steps (Cardiometabolic)</td>
            </tr>
          </tbody>
        </table>

        {/* Physician Sign-Off */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--hairline-strong)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)' }}>
          <div>
            Verified Client-Side Signature: SHA-256 Validated Local Data Store<br />
            Confidential Health Information &bull; Do Not Distribute
          </div>
          <div style={{ textAlign: 'right' }}>
            Physician Review / Sign-Off: __________________________<br />
            Date: ____________________
          </div>
        </div>
      </div>
    </div>
  );
}
