import React, { useState } from 'react';
import { Pill, Plus, Check, Clock, Trash2, AlertCircle } from 'lucide-react';

export default function MedicationManager({ medications, onAddMedication, onToggleMedication, onDeleteMedication }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily Morning');
  const [time, setTime] = useState('08:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddMedication({
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim() || 'Standard Dose',
      frequency,
      time,
      takenToday: false
    });
    setName('');
    setDosage('');
  };

  const takenCount = medications.filter(m => m.takenToday).length;
  const adherenceRate = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--primary)' }}>PHARMACOLOGICAL ADHERENCE</div>
            <h2 style={{ margin: '0.25rem 0' }}>Prescription &amp; Micronutrient Adherence Hub</h2>
            <p className="caption" style={{ margin: 0 }}>
              Track daily therapeutic compliance with client-side compliance verification.
            </p>
          </div>
          <div style={{ background: 'var(--mint-50)', padding: '0.5rem 1rem', borderRadius: 4 }}>
            <span className="caption" style={{ display: 'block', color: 'var(--primary-deep)', fontWeight: 700 }}>TODAY'S COMPLIANCE</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
              {adherenceRate}% ({takenCount}/{medications.length})
            </span>
          </div>
        </div>

        {/* Add Medication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>PHARMA / COMPOUND NAME</label>
            <input
              type="text"
              placeholder="e.g. Omega-3 / Lisinopril"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>DOSAGE</label>
            <input
              type="text"
              placeholder="e.g. 1000mg / 10mg"
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>FREQUENCY</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input-field">
              <option value="Daily Morning">Daily Morning</option>
              <option value="Daily Evening">Daily Evening</option>
              <option value="Twice Daily">Twice Daily</option>
              <option value="As Needed (PRN)">As Needed (PRN)</option>
            </select>
          </div>
          <div>
            <label className="caption" style={{ fontWeight: 700 }}>SCHEDULED TIME</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input-field" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> ADD REGIMEN
          </button>
        </form>

        {/* Regimen List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {medications.length === 0 ? (
            <p className="caption" style={{ textAlign: 'center', padding: '2rem' }}>No active pharmacology schedules configured.</p>
          ) : (
            medications.map(med => (
              <div
                key={med.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: 4,
                  background: med.takenToday ? 'var(--mint-50)' : '#fff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => onToggleMedication(med.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: `2px solid ${med.takenToday ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                      background: med.takenToday ? 'var(--primary)' : '#fff',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {med.takenToday && <Check size={16} />}
                  </button>
                  <div>
                    <strong style={{ fontSize: '0.95rem', textDecoration: med.takenToday ? 'line-through' : 'none' }}>
                      {med.name}
                    </strong>
                    <div className="caption" style={{ color: 'var(--muted)' }}>
                      {med.dosage} &bull; {med.frequency} &bull; {med.time}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMedication(med.id)}
                  className="btn btn-outline"
                  style={{ padding: '6px 10px', borderColor: 'var(--hairline-strong)', color: 'var(--muted)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
