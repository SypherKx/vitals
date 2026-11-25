import React, { useState } from 'react';
import { HeartPulse, ShieldAlert, Activity, CheckCircle, Info } from 'lucide-react';
import { calculateFraminghamRisk, calculateBloodPressureCategory } from '../services/clinicalMath';

export default function CardioRisk({ profile, latestLog }) {
  const [age, setAge] = useState(profile.age || 21);
  const [gender, setGender] = useState(profile.gender || 'male');
  const [systolic, setSystolic] = useState(latestLog?.systolic || 120);
  const [diastolic, setDiastolic] = useState(latestLog?.diastolic || 80);
  const [cholesterol, setCholesterol] = useState(185);
  const [hdl, setHdl] = useState(52);
  const [smoker, setSmoker] = useState(false);
  const [hypertensionTreatment, setHypertensionTreatment] = useState(false);

  const riskResult = calculateFraminghamRisk({
    age,
    gender,
    systolicBP: systolic,
    totalCholesterol: cholesterol,
    hdlCholesterol: hdl,
    smoker,
    treatedBP: hypertensionTreatment
  });

  const bpStage = calculateBloodPressureCategory(systolic, diastolic);
  const map = Math.round(((2 * diastolic) + systolic) / 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="eyebrow" style={{ color: 'var(--primary)' }}>CARDIOMETABOLIC ENGINE</div>
          <h2 style={{ margin: '0.25rem 0' }}>10-Year ASCVD Cardiovascular Risk Stratification</h2>
          <p className="caption" style={{ margin: 0 }}>
            Framingham Heart Study adult regression model &amp; AHA/ACC Blood Pressure Staging.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Diagnostic Inputs */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Patient Biomarkers</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>AGE (YEARS)</label>
                <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>BIOLOGICAL SEX</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>SYSTOLIC (MMHG)</label>
                <input type="number" value={systolic} onChange={e => setSystolic(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>DIASTOLIC (MMHG)</label>
                <input type="number" value={diastolic} onChange={e => setDiastolic(Number(e.target.value))} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>TOTAL CHOLESTEROL</label>
                <input type="number" value={cholesterol} onChange={e => setCholesterol(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="caption" style={{ fontWeight: 700 }}>HDL CHOLESTEROL</label>
                <input type="number" value={hdl} onChange={e => setHdl(Number(e.target.value))} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} />
                Current tobacco cigarette smoker
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={hypertensionTreatment} onChange={e => setHypertensionTreatment(e.target.checked)} />
                Prescribed antihypertensive medical therapy
              </label>
            </div>
          </div>

          {/* Clinical Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--mint-50)', padding: '1.5rem', borderRadius: 8 }}>
              <span className="caption" style={{ color: 'var(--primary-deep)', fontWeight: 700 }}>
                10-YEAR CARDIAC ARREST / STROKE PROBABILITY
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-deep)', margin: '0.25rem 0' }}>
                {riskResult.riskPercent}%
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                Risk Stratum: <span style={{ color: riskResult.category === 'Low Risk' ? 'var(--primary)' : 'var(--error)' }}>{riskResult.category}</span>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--body)' }}>
                Vascular Biological Age: <strong>{riskResult.vascularAge} years</strong> ({riskResult.vascularAge - age > 0 ? `+${riskResult.vascularAge - age} yrs advanced` : 'Optimal physiological alignment'})
              </div>
            </div>

            {/* Blood Pressure Category & MAP */}
            <div style={{ border: '1px solid var(--hairline-strong)', padding: '1.25rem', borderRadius: 8, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="caption" style={{ display: 'block' }}>AHA/ACC 2017 BP STAGE</span>
                  <strong style={{ fontSize: '1.1rem', color: bpStage.category === 'Normal' ? 'var(--primary)' : '#c27803' }}>
                    {bpStage.category}
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="caption" style={{ display: 'block' }}>MEAN ARTERIAL PRESSURE</span>
                  <strong style={{ fontSize: '1.1rem' }}>{map} mmHg</strong>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                {bpStage.description} Standard perfusion equilibrium maintained between 70-105 mmHg MAP.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
