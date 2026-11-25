import React from 'react';
import {
  Activity,
  ArrowRight,
  Droplets,
  Moon,
  Footprints,
  Flame,
  Scale,
  HeartPulse,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export default function LandingPage({ profile, onEnterApp, onStartFresh }) {
  const hasProfile = Boolean(profile && profile.name);

  const trackItems = [
    { icon: Scale, title: 'Weight & BMI', desc: 'Track daily mass, goal pace, and U.S. Navy body fat composition.' },
    { icon: Droplets, title: 'Hydration', desc: 'Quick-increment water logging against your weight-calibrated target.' },
    { icon: Moon, title: 'Sleep Quality', desc: 'Monitor nightly duration, sleep debt, and circadian regularity.' },
    { icon: Footprints, title: 'Daily Steps', desc: 'Log pedometer volume and active workout expenditure.' },
    { icon: HeartPulse, title: 'Cardio & BP', desc: 'AHA blood pressure staging, MAP, and 10-year Framingham risk.' }
  ];

  const steps = [
    { num: '01', title: 'Set your baseline', desc: 'Configure height, weight, targets, and health goals locally in your browser.' },
    { num: '02', title: 'Log in 30 seconds', desc: 'Record daily vitals, water, sleep, meals, and workouts with zero friction.' },
    { num: '03', title: 'Review clinical insights', desc: 'Spot trends, anomaly alerts, and export physician-ready PDF dossiers.' }
  ];

  return (
    <div className="page-transition" style={{ minHeight: '100vh', background: 'var(--canvas)' }}>
      {/* Public Top Nav */}
      <header className="top-nav">
        <div className="container nav-inner">
          <div className="nav-brand">
            <Activity size={22} strokeWidth={2.2} />
            <span>Vitals</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {hasProfile && (
              <button
                type="button"
                onClick={onStartFresh}
                className="btn-outline"
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                New Session
              </button>
            )}
            <button
              type="button"
              onClick={onEnterApp}
              className="btn-primary"
              style={{ minHeight: '40px', padding: '10px 18px' }}
            >
              {hasProfile ? 'Open Dashboard' : 'Get Started'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Band */}
      <section className="hero-band" style={{ padding: '56px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <div className="hero-breadcrumb">PERSONAL HEALTH &amp; BIOMETRIC TRACKER</div>
              <h1 className="hero-headline text-display" style={{ fontSize: '40px', lineHeight: 1.15, marginBottom: '14px' }}>
                Clear health numbers, <span style={{ color: 'var(--lime-hero)' }}>zero</span> cloud tracking.
              </h1>
              <p className="hero-lead" style={{ marginBottom: '24px' }}>
                Track weight, hydration, sleep, steps, nutrition, and clinical cardiovascular risk in one private, local-first workspace.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={onEnterApp}
                  className="btn-primary"
                  style={{ background: '#ffffff', color: 'var(--primary-deep)' }}
                >
                  {hasProfile ? `Continue as ${profile.name}` : 'Get Started Free'}
                  <ArrowRight size={16} />
                </button>
                <div className="hero-chip">
                  <ShieldCheck size={14} />
                  <span>100% LocalStorage &middot; No Login</span>
                </div>
              </div>
            </div>

            {/* Static Editorial Preview Card */}
            <div className="landing-preview-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--hairline)' }}>
                <div>
                  <span className="text-eyebrow" style={{ color: 'var(--primary)' }}>LIVE PREVIEW</span>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>Daily Vitals Snapshot</div>
                </div>
                <span className="badge-ribbon">On Track</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{ background: 'var(--mint-50)', padding: '12px', borderRadius: '6px' }}>
                  <span className="text-caption" style={{ display: 'block' }}>Weight</span>
                  <strong style={{ fontSize: '20px', color: 'var(--ink)' }}>{profile?.currentWeight || 71.4} kg</strong>
                </div>
                <div style={{ background: 'var(--mint-50)', padding: '12px', borderRadius: '6px' }}>
                  <span className="text-caption" style={{ display: 'block' }}>Daily Steps</span>
                  <strong style={{ fontSize: '20px', color: 'var(--ink)' }}>8,950</strong>
                </div>
                <div style={{ background: 'var(--canvas-soft)', padding: '12px', borderRadius: '6px' }}>
                  <span className="text-caption" style={{ display: 'block' }}>Sleep</span>
                  <strong style={{ fontSize: '20px', color: 'var(--ink)' }}>7.5 hrs</strong>
                </div>
                <div style={{ background: 'var(--canvas-soft)', padding: '12px', borderRadius: '6px' }}>
                  <span className="text-caption" style={{ display: 'block' }}>Hydration</span>
                  <strong style={{ fontSize: '20px', color: 'var(--ink)' }}>2,350 ml</strong>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Framingham 10-Yr Risk: Low</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>MAP: 90 mmHg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you can track (Mint-50 Panel) */}
      <section style={{ background: 'var(--mint-50)', padding: '52px 0' }}>
        <div className="container">
          <div style={{ marginBottom: '28px' }}>
            <div className="text-eyebrow" style={{ color: 'var(--primary)', marginBottom: '6px' }}>COMPREHENSIVE MODULES</div>
            <h2 className="text-h1">What you can track</h2>
          </div>

          <div className="landing-tiles-grid">
            {trackItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="landing-tile">
                  <div className="stat-card-icon" style={{ marginBottom: '14px' }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-card-title" style={{ marginBottom: '6px' }}>{item.title}</h3>
                  <p className="text-caption" style={{ lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '52px 0', background: 'var(--canvas)' }}>
        <div className="container">
          <div style={{ marginBottom: '28px' }}>
            <div className="text-eyebrow" style={{ color: 'var(--primary)', marginBottom: '6px' }}>SIMPLE WORKFLOW</div>
            <h2 className="text-h1">How it works</h2>
          </div>

          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="card">
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>
                  STEP {s.num}
                </span>
                <h3 className="text-card-title" style={{ marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--body)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Insight Callout */}
      <section style={{ padding: '0 0 52px 0' }}>
        <div className="container">
          <div className="insight-panel" style={{ marginBottom: 0 }}>
            <div className="insight-header">
              <TrendingUp size={15} />
              <span>&rarr; SAMPLE VITALS INSIGHT</span>
            </div>
            <div className="insight-content" style={{ flexWrap: 'wrap' }}>
              <div className="dark-stat-block">7.6h avg</div>
              <div className="white-stat-chip">Target 8.0h</div>
              <p className="insight-text" style={{ flex: 1, minWidth: '240px' }}>
                You&apos;ve averaged 7.6h sleep this week, just 0.4h under your recovery target. Moving bedtime 25 minutes earlier closes the gap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--hairline-strong)', padding: '24px 0', background: 'var(--canvas-soft)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
            <Activity size={18} />
            <span>Vitals</span>
          </div>
          <p className="text-caption">
            All biometric data stays strictly in your browser&apos;s LocalStorage. Built with React &amp; Chart.js.
          </p>
        </div>
      </footer>
    </div>
  );
}
