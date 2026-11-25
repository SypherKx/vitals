import React, { useState } from 'react';
import { Dumbbell, Plus, Flame, Clock, Calendar } from 'lucide-react';

export default function Workouts({ workouts, onAddWorkout }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [type, setType] = useState('Cardio / Running');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('Moderate');
  const [caloriesBurned, setCaloriesBurned] = useState(250);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWorkout({
      id: Date.now().toString(),
      date: todayStr,
      type,
      duration: Number(duration),
      intensity,
      caloriesBurned: Number(caloriesBurned),
      notes
    });
    setNotes('');
  };

  const totalWeeklyMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalWeeklyCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--primary)' }}>KINESIOLOGY &amp; EXERCISE</div>
            <h2 style={{ margin: '0.25rem 0' }}>Physical Activity &amp; Volumetric Load</h2>
            <p className="caption" style={{ margin: 0 }}>
              Track resistance stimuli, zone-2 metabolic cardio, and active energy expenditure.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'var(--mint-50)', padding: '0.5rem 1rem', borderRadius: 4 }}>
              <span className="caption" style={{ display: 'block', color: 'var(--primary-deep)', fontWeight: 700 }}>ACTIVE TIME</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary-deep)' }}>{totalWeeklyMinutes} mins</strong>
            </div>
            <div style={{ background: 'var(--mint-50)', padding: '0.5rem 1rem', borderRadius: 4 }}>
              <span className="caption" style={{ display: 'block', color: 'var(--primary-deep)', fontWeight: 700 }}>EXPENDITURE</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary-deep)' }}>{totalWeeklyCalories} kcal</strong>
            </div>
          </div>
        </div>

        {/* Workout Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>EXERCISE MODALITY</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field">
              <option value="Cardio / Running">Cardio / Running</option>
              <option value="Resistance / Hypertrophy">Resistance / Hypertrophy</option>
              <option value="HIIT / Circuit">HIIT / Circuit</option>
              <option value="Cycling / Ergometer">Cycling / Ergometer</option>
              <option value="Swimming">Swimming</option>
              <option value="Mobility / Yoga">Mobility / Yoga</option>
            </select>
          </div>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>DURATION (MINUTES)</label>
            <input type="number" min="5" max="300" value={duration} onChange={e => setDuration(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>RPE INTENSITY</label>
            <select value={intensity} onChange={e => setIntensity(e.target.value)} className="input-field">
              <option value="Low (RPE 4-5)">Low (RPE 4-5)</option>
              <option value="Moderate (RPE 6-7)">Moderate (RPE 6-7)</option>
              <option value="High (RPE 8-9)">High (RPE 8-9)</option>
              <option value="Maximal (RPE 10)">Maximal (RPE 10)</option>
            </select>
          </div>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>ENERGY EXPENDED (KCAL)</label>
            <input type="number" min="10" value={caloriesBurned} onChange={e => setCaloriesBurned(e.target.value)} className="input-field" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="caption" style={{ fontWeight: 700 }}>SESSION LOG &amp; METRIC NOTES</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="e.g. 5x5 squats @ 100kg, 10 min cooldown"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                RECORD SESSION
              </button>
            </div>
          </div>
        </form>

        {/* Workout History */}
        <h4 style={{ marginBottom: '1rem' }}>Recent Exercise Sessions</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {workouts.map(w => (
            <div
              key={w.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 4
              }}
            >
              <div>
                <strong>{w.type}</strong> &bull; <span className="caption">{w.intensity}</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>{w.notes || 'No session notes'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{w.duration} mins</span>
                <div className="caption">{w.caloriesBurned} kcal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
