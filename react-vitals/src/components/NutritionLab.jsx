import React, { useState } from 'react';
import { PieChart, Apple, Flame, Check } from 'lucide-react';
import { calculateMacronutrientSplit } from '../services/clinicalMath';

export default function NutritionLab({ profile }) {
  const [strategy, setStrategy] = useState('balanced');
  const [calorieIntake, setCalorieIntake] = useState(profile.calorieTarget || 2200);

  const macros = calculateMacronutrientSplit(calorieIntake, strategy);

  const strategies = [
    { id: 'balanced', name: 'Zone Balanced (30P / 45C / 25F)', desc: 'General athletic maintenance, metabolic flexibility and glycogen replenishment.' },
    { id: 'high_protein', name: 'Hypertrophy / Fat Loss (40P / 35C / 25F)', desc: 'Maximizes muscle protein synthesis and postprandial thermogenesis.' },
    { id: 'keto', name: 'Ketogenic Lipolytic (25P / 5C / 70F)', desc: 'Forces cellular ketone body hepatic biosynthesis through severe carbohydrate restriction.' },
    { id: 'endurance', name: 'Endurance Carb-Load (20P / 60C / 20F)', desc: 'High intramuscular glycogen supercompensation for endurance pacing.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="eyebrow" style={{ color: 'var(--primary)' }}>NUTRITIONAL BIOENERGETICS</div>
          <h2 style={{ margin: '0.25rem 0' }}>Macronutrient Partitioning &amp; Caloric Strategy</h2>
          <p className="caption" style={{ margin: 0 }}>
            Dynamic Gram-Partitioning algorithms based on metabolic demand and body composition goals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="caption" style={{ fontWeight: 700 }}>DAILY ENERGY CEILING (KCAL)</label>
              <input
                type="number"
                step="50"
                value={calorieIntake}
                onChange={e => setCalorieIntake(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <label className="caption" style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              SELECT METABOLIC STRATEGY
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {strategies.map(s => (
                <div
                  key={s.id}
                  onClick={() => setStrategy(s.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: `1px solid ${strategy === s.id ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                    background: strategy === s.id ? 'var(--mint-50)' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: strategy === s.id ? 'var(--primary-deep)' : 'var(--ink)' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Macro Breakdown Visuals */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ background: 'var(--mint-50)', padding: '1.5rem', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Daily Gram Partitioning</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--hairline-strong)' }}>
                  <span className="caption" style={{ display: 'block', fontWeight: 700, color: 'var(--primary)' }}>PROTEIN</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{macros.protein.grams}g</div>
                  <span className="caption">{macros.protein.calories} kcal</span>
                </div>

                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--hairline-strong)' }}>
                  <span className="caption" style={{ display: 'block', fontWeight: 700, color: '#005fb9' }}>CARBS</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{macros.carbs.grams}g</div>
                  <span className="caption">{macros.carbs.calories} kcal</span>
                </div>

                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--hairline-strong)' }}>
                  <span className="caption" style={{ display: 'block', fontWeight: 700, color: '#c27803' }}>FATS</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{macros.fats.grams}g</div>
                  <span className="caption">{macros.fats.calories} kcal</span>
                </div>
              </div>

              {/* Stacked Percentage Bar */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ height: 12, borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${macros.protein.percent}%`, background: 'var(--primary)' }} />
                  <div style={{ width: `${macros.carbs.percent}%`, background: '#005fb9' }} />
                  <div style={{ width: `${macros.fats.percent}%`, background: '#ddfa88' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--muted)' }}>
                  <span>Protein {macros.protein.percent}%</span>
                  <span>Carbs {macros.carbs.percent}%</span>
                  <span>Fats {macros.fats.percent}%</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', background: '#fff', padding: '0.75rem', border: '1px solid var(--hairline-strong)', borderRadius: 4 }}>
              <strong>Bioenergetic Constant:</strong> Protein and Carbohydrates yield 4.0 kcal/gram at standard Atwater factor; Lipids yield 9.0 kcal/gram.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
