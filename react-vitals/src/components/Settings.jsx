import React, { useState } from 'react';
import { Settings as SettingsIcon, Download, Upload, RefreshCw, AlertTriangle, FileText, Database } from 'lucide-react';

export default function Settings({
  profile,
  onUpdateProfile,
  onExportJSON,
  onExportCSV,
  onImportClick,
  onResetDatabase,
  onOpenReport
}) {
  const [formData, setFormData] = useState({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="eyebrow" style={{ color: 'var(--primary)' }}>SYSTEM CONFIGURATION</div>
          <h2 style={{ margin: '0.25rem 0' }}>Patient Profile &amp; Biometric Baselines</h2>
          <p className="caption" style={{ margin: 0 }}>
            Configure clinical parameters and client-side database synchronization.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="caption" style={{ fontWeight: 700 }}>LEGAL / CLINICAL NAME</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="caption" style={{ fontWeight: 700 }}>AGE (CHRONOLOGICAL)</label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="caption" style={{ fontWeight: 700 }}>BIOLOGICAL SEX</label>
              <select
                value={formData.gender || 'male'}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="caption" style={{ fontWeight: 700 }}>STANDING HEIGHT (CM)</label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="caption" style={{ fontWeight: 700 }}>TARGET WEIGHT (KG)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeight || ''}
                onChange={e => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="caption" style={{ fontWeight: 700 }}>DAILY HYDRATION GOAL (ML)</label>
              <input
                type="number"
                step="100"
                value={formData.waterTarget || ''}
                onChange={e => setFormData({ ...formData, waterTarget: Number(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary">SAVE PROFILE REVISIONS</button>
            {saveSuccess && <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Settings Updated!</span>}
          </div>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--hairline)', margin: '2rem 0' }} />

        {/* Data Management Section */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Client Database &amp; Dossier Operations</h3>
          <p className="caption" style={{ marginBottom: '1.5rem' }}>
            Zero-cloud guarantee: all operations execute locally in browser memory. Export data for clinical consultation or backup.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenReport} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} /> GENERATE CLINICAL DOSSIER
            </button>
            <button onClick={onExportJSON} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} /> EXPORT JSON BACKUP
            </button>
            <button onClick={onExportCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} /> EXPORT CSV DATA
            </button>
            <button onClick={onImportClick} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={16} /> RESTORE DATABASE
            </button>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--hairline)', margin: '2rem 0' }} />

        {/* Database Purge */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={16} color="var(--error)" />
            <strong style={{ color: 'var(--error)' }}>Purge Local Biometric Store</strong>
          </div>
          <p className="caption" style={{ margin: '0 0 1rem 0' }}>
            Irreversibly clears all logs, workouts, medications, and profile metrics from this browser.
          </p>
          <button
            onClick={onResetDatabase}
            className="btn btn-outline"
            style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
          >
            RESET ALL LOCAL STORAGE
          </button>
        </div>
      </div>
    </div>
  );
}
