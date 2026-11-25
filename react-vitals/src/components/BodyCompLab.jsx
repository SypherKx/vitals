import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, Activity, Award } from 'lucide-react';
import { calculateNavyBodyFat } from '../services/clinicalMath';

export default function BodyCompLab({ profile, onUpdateCircumferences }) {
  const [gender, setGender] = useState(profile.gender || 'male');
  const [height, setHeight] = useState(profile.height || 175);
  const [weight, setWeight] = useState(profile.currentWeight || profile.weight || 71.4);
  const [neck, setNeck] = useState(profile.neckCircumference || 37);
  const [waist, setWaist] = useState(profile.waistCircumference || 80);
  const [hip, setHip] = useState(profile.hipCircumference || 94);

  const res = calculateNavyBodyFat(gender, height, waist, neck, hip);
  const leanMassKg = res ? ((100 - res.bodyFatPercent) / 100 * weight).toFixed(1) : 0;
  const fatMassKg = res ? (res.bodyFatPercent / 100 * weight).toFixed(1) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="eyebrow" style={{ color: 'var(--primary)' }}>ANTHROPOMETRIC LAB</div>
          <h2 style={{ margin: '0.25rem 0' }}>U.S. Navy Circumference Body Fat Assessment</h2>
          <p className="caption" style={{ margin: 0 }}>
            Standard Department of Defense anthropometric equation for tissue composition assessment without DXA scanning.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Controls */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>BIOLOGICAL SEX</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>STATURE (CM)</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>TOTAL MASS (KG)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>NECK CIRCUMFERENCE (CM)</label>
                <input type="number" step="0.5" value={neck} onChange={e => setNeck(Number(e.target.value))} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>ABDOMINAL / WAIST (CM)</label>
                <input type="number" step="0.5" value={waist} onChange={e => setWaist(Number(e.target.value))} className="input-field" />
              </div>
              {gender === 'female' && (
                <div>
                  <label className="caption" style={{ fontWeight: 700 }}>HIP CIRCUMFERENCE (CM)</label>
                  <input type="number" step="0.5" value={hip} onChange={e => setHip(Number(e.target.value))} className="input-field" />
                </div>
              )}
            </div>

            <button
              onClick={() => onUpdateCircumferences({ neckCircumference: neck, waistCircumference: waist, hipCircumference: hip })}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              SAVE CIRCUMFERENCES TO CLINICAL PROFILE
            </button>
          </div>

          {/* Results Display */}
          <div style={{ background: 'var(--mint-50)', padding: '1.5rem', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="caption" style={{ color: 'var(--primary-deep)', fontWeight: 700 }}>ESTIMATED BODY FAT</span>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-deep)', lineHeight: 1 }}>
                {res?.bodyFatPercent || '--'} <span style={{ fontSize: '1.5rem' }}>%</span>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
                Classification: <span style={{ color: 'var(--primary)' }}>{res?.category || 'Calculating...'}</span>
              </div>
            </div>

            {/* Mass Breakdown Bar */}
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Lean Mass: <strong>{leanMassKg} kg</strong> ({100 - (res?.bodyFatPercent || 0)}%)</span>
                <span>Fat Mass: <strong>{fatMassKg} kg</strong></span>
              </div>
              <div style={{ height: 16, background: '#d8d9da', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${100 - (res?.bodyFatPercent || 0)}%`, background: 'var(--primary)' }} />
                <div style={{ width: `${res?.bodyFatPercent || 0}%`, background: '#ddfa88' }} />
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', background: '#fff', padding: '0.75rem', border: '1px solid var(--hairline-strong)' }}>
              <strong>Clinical Relevance:</strong> Unlike standard BMI which fails to distinguish between dense skeletal muscle and visceral adipose tissue, Navy Circumference calculates physical volume density.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
