import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Calendar, Check, Save } from 'lucide-react';

export default function DailyLog({ logs, profile, onSaveLog, onDeleteLog }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const existingEntry = logs.find(l => l.date === selectedDate) || {};

  const [formData, setFormData] = useState({
    date: selectedDate,
    weight: existingEntry.weight || profile.weight || '',
    water: existingEntry.water || 2000,
    sleep: existingEntry.sleep || 7.5,
    steps: existingEntry.steps || 8000,
    calories: existingEntry.calories || profile.calorieTarget || 2000,
    systolic: existingEntry.systolic || 120,
    diastolic: existingEntry.diastolic || 80,
    bloodGlucose: existingEntry.bloodGlucose || 95,
    mood: existingEntry.mood || 4,
    notes: existingEntry.notes || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync form when date changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const entry = logs.find(l => l.date === newDate) || {};
    setFormData({
      date: newDate,
      weight: entry.weight || profile.weight || '',
      water: entry.water || 2000,
      sleep: entry.sleep || 7.5,
      steps: entry.steps || 8000,
      calories: entry.calories || profile.calorieTarget || 2000,
      systolic: entry.systolic || 120,
      diastolic: entry.diastolic || 80,
      bloodGlucose: entry.bloodGlucose || 95,
      mood: entry.mood || 4,
      notes: entry.notes || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveLog({
      ...formData,
      weight: Number(formData.weight),
      water: Number(formData.water),
      sleep: Number(formData.sleep),
      steps: Number(formData.steps),
      calories: Number(formData.calories),
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
      bloodGlucose: Number(formData.bloodGlucose),
      mood: Number(formData.mood)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const adjustWater = (delta) => {
    setFormData(prev => ({
      ...prev,
      water: Math.max(0, (Number(prev.water) || 0) + delta)
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>Daily Biometric Telemetry Entry</h2>
            <p className="caption" style={{ margin: 0 }}>Capture physiological metrics and subjective wellness parameters</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="var(--primary)" />
            <input
              type="date"
              value={selectedDate}
              max={todayStr}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input-field"
              style={{ padding: '6px 12px' }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                BODY MASS (KG)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                HYDRATION (ML)
              </label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <input
                  type="number"
                  step="50"
                  min="0"
                  value={formData.water}
                  onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                  className="input-field"
                />
                <button type="button" onClick={() => adjustWater(250)} className="btn btn-secondary" style={{ padding: '0 12px' }}>+250</button>
                <button type="button" onClick={() => adjustWater(-250)} className="btn btn-secondary" style={{ padding: '0 12px' }}>-250</button>
              </div>
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                SLEEP DURATION (HOURS)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={formData.sleep}
                onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                PEDOMETER STEPS
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                ENERGY CONSUMED (KCAL)
              </label>
              <input
                type="number"
                step="50"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                BLOOD PRESSURE (SYS / DIA)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Sys"
                  value={formData.systolic}
                  onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                  className="input-field"
                />
                <span>/</span>
                <input
                  type="number"
                  placeholder="Dia"
                  value={formData.diastolic}
                  onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                FASTING GLUCOSE (MG/DL)
              </label>
              <input
                type="number"
                min="40"
                max="400"
                value={formData.bloodGlucose}
                onChange={(e) => setFormData({ ...formData, bloodGlucose: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
                SUBJECTIVE WELLBEING (1-5)
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="input-field"
              >
                <option value="1">1 - Highly Fatigued / Stressed</option>
                <option value="2">2 - Low Energy</option>
                <option value="3">3 - Normal / Neutral</option>
                <option value="4">4 - High Vitality &amp; Focus</option>
                <option value="5">5 - Optimal Peak State</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="caption" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 700 }}>
              CLINICAL SYMPTOM &amp; DIETARY NOTES
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Mild headache post-lunch, completed 45 min resistance workout..."
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} />
              COMMIT LOG ENTRY
            </button>
            {savedSuccess && (
              <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={18} /> Telemetry Persisted to Client Database
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Historical Telemetry Registry */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Historical Audit Log</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>BP (mmHg)</th>
                <th>Hydration</th>
                <th>Sleep</th>
                <th>Steps</th>
                <th>Energy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 14).map((log) => (
                <tr key={log.date}>
                  <td data-label="Date"><strong>{log.date}</strong></td>
                  <td data-label="Weight">{log.weight} kg</td>
                  <td data-label="BP">{log.systolic}/{log.diastolic}</td>
                  <td data-label="Water">{log.water} ml</td>
                  <td data-label="Sleep">{log.sleep}h</td>
                  <td data-label="Steps">{log.steps?.toLocaleString()}</td>
                  <td data-label="Calories">{log.calories} kcal</td>
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleDateChange(log.date)}
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => onDeleteLog(log.date)}
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
