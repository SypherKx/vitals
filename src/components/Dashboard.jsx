import React, { useState } from 'react';
import {
  Droplets,
  Moon,
  Footprints,
  Flame,
  Scale,
  HeartPulse,
  AlertTriangle,
  Award,
  TrendingUp,
  ArrowRight,
  Target
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function getGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({
  profile,
  logs,
  anomalies,
  insights,
  streaks,
  badges,
  setActiveTab,
  onQuickLog
}) {
  const [chartRange, setChartRange] = useState('14d');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = (logs && logs.find(l => l.date === todayStr)) || (logs && logs[0]) || {};

  const currentWeight = Number(todayLog.weight || profile?.currentWeight || profile?.weight || 71.4);
  const startWeight = Number(profile?.startWeight || (logs && logs.length ? logs[logs.length - 1].weight : currentWeight) || 73.5);
  const targetWeight = Number(profile?.targetWeight || 69.0);
  const userHeight = Number(profile?.height || 175);

  const bmiNum = userHeight > 0 ? Number((currentWeight / Math.pow(userHeight / 100, 2)).toFixed(1)) : 23.2;
  let bmiCat = 'Normal weight';
  if (bmiNum < 18.5) bmiCat = 'Underweight';
  else if (bmiNum < 25) bmiCat = 'Normal weight';
  else if (bmiNum < 30) bmiCat = 'Overweight';
  else bmiCat = 'Obese';

  const bmiPercent = Math.max(2, Math.min(98, ((bmiNum - 15) / (35 - 15)) * 100));

  const totalToLose = Math.abs(startWeight - targetWeight);
  const lostSoFar = Math.abs(startWeight - currentWeight);
  const goalPct = totalToLose > 0 ? Math.min(100, Math.round((lostSoFar / totalToLose) * 100)) : 100;
  const remainingKg = Math.abs(currentWeight - targetWeight).toFixed(1);

  const waterVal = todayLog.water || 0;
  const waterGoal = profile?.waterTarget || 2350;
  const waterPct = Math.min(100, Math.round((waterVal / waterGoal) * 100));

  const sleepVal = todayLog.sleep || 0;
  const sleepGoal = profile?.sleepTarget || 8;
  const sleepPct = Math.min(100, Math.round((sleepVal / sleepGoal) * 100));

  const stepsVal = todayLog.steps || 0;
  const stepsGoal = profile?.stepsTarget || 8000;
  const stepsPct = Math.min(100, Math.round((stepsVal / stepsGoal) * 100));

  const caloriesVal = todayLog.calories || 0;
  const caloriesGoal = profile?.calorieTarget || 1780;
  const caloriesPct = Math.min(100, Math.round((caloriesVal / caloriesGoal) * 100));

  const mapVal = todayLog.systolic && todayLog.diastolic
    ? Math.round(((2 * todayLog.diastolic) + todayLog.systolic) / 3)
    : 90;

  // Chart data
  const sortedLogs = [...(logs || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filteredLogs = chartRange === '7d'
    ? sortedLogs.slice(-7)
    : chartRange === '14d'
      ? sortedLogs.slice(-14)
      : sortedLogs;

  const chartLabels = filteredLogs.map(l => {
    const d = new Date(l.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#000000',
        bodyColor: '#3d4045',
        borderColor: '#d8d9da',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64666a', font: { family: 'Montserrat', size: 11, weight: 500 } }
      },
      y: {
        grid: { color: '#ebebec' },
        border: { display: false },
        ticks: { color: '#64666a', font: { family: 'Montserrat', size: 11, weight: 500 } }
      }
    }
  };

  const weightChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Weight (kg)',
      data: filteredLogs.map(l => l.weight),
      borderColor: '#008254',
      backgroundColor: 'rgba(0, 130, 84, 0.08)',
      borderWidth: 2,
      fill: true,
      tension: 0.25,
      pointRadius: 3,
      pointBackgroundColor: '#008254'
    }]
  };

  const stepsChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Steps',
      data: filteredLogs.map(l => l.steps),
      backgroundColor: '#b7ecda',
      hoverBackgroundColor: '#008254',
      borderRadius: 2
    }]
  };

  const sleepChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Sleep (hrs)',
      data: filteredLogs.map(l => l.sleep),
      borderColor: '#005fb9',
      backgroundColor: 'rgba(0, 95, 185, 0.06)',
      borderWidth: 2,
      fill: true,
      tension: 0.25,
      pointRadius: 3,
      pointBackgroundColor: '#005fb9'
    }]
  };

  const waterChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Water (ml)',
      data: filteredLogs.map(l => l.water),
      backgroundColor: '#008254',
      borderRadius: 2
    }]
  };

  const avgSteps = filteredLogs.length ? Math.round(filteredLogs.reduce((s, l) => s + (l.steps || 0), 0) / filteredLogs.length) : 0;
  const avgSleep = filteredLogs.length ? (filteredLogs.reduce((s, l) => s + (l.sleep || 0), 0) / filteredLogs.length).toFixed(1) : 0;
  const avgWater = filteredLogs.length ? Math.round(filteredLogs.reduce((s, l) => s + (l.water || 0), 0) / filteredLogs.length) : 0;
  const weightDelta = filteredLogs.length >= 2
    ? (filteredLogs[filteredLogs.length - 1].weight - filteredLogs[0].weight).toFixed(1)
    : '0.0';

  return (
    <div>
      {/* Full-bleed NerdWallet-style Green Gradient Hero Band */}
      <section className="hero-band">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="hero-breadcrumb">VITALS &middot; DAILY OVERVIEW</div>
              <h1 className="hero-headline text-display">
                {getGreeting()}, <span style={{ color: 'var(--lime-hero)' }}>{profile?.name || 'Ashutosh'}</span>.
              </h1>
              <p className="hero-lead" style={{ marginBottom: 0 }}>
                You&apos;re {remainingKg} kg from your target weight, with {logs?.length || 0} days of tracked metrics.
              </p>
            </div>

            <div className="hero-chips">
              <div className="hero-chip">
                <Flame size={14} />
                <span>Streak: {streaks?.currentStreak || 0} days</span>
              </div>
              <div className="hero-chip">
                <HeartPulse size={14} />
                <span>MAP: {mapVal} mmHg</span>
              </div>
              <button
                type="button"
                onClick={onQuickLog}
                className="btn-primary"
                style={{ background: '#ffffff', color: 'var(--primary-deep)', minHeight: '40px', padding: '10px 18px' }}
              >
                Log Today
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main White / Soft Body */}
      <div className="container" style={{ paddingTop: '28px' }}>
        {/* Clinical Anomaly Alerts (if any) */}
        {anomalies && anomalies.length > 0 && (
          <section className="anomaly-banner" style={{ marginBottom: '24px' }}>
            <AlertTriangle size={20} color="var(--error)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div className="anomaly-title">
                Clinical Surveillance: {anomalies.length} Biometric Flag(s)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {anomalies.map((a, i) => (
                  <div key={i} className="anomaly-desc">
                    <strong>{a.metric}:</strong> {a.flag}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Today's Snapshot: 4 Stat Cards */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
            <h2 className="text-h2">Today&apos;s Snapshot</h2>
            <span className="text-caption">vs. daily targets</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div>
                <div className="stat-card-header">
                  <span className="text-ui-label">Weight</span>
                  <div className="stat-card-icon"><Scale size={16} /></div>
                </div>
                <div className="text-stat-val">
                  {currentWeight} <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--muted)' }}>kg</span>
                </div>
                <div className="text-caption" style={{ marginTop: '4px' }}>
                  {remainingKg} kg to {targetWeight} kg goal
                </div>
              </div>
              <div className="stat-progress-bar-bg">
                <div className="stat-progress-bar-fill" style={{ width: `${goalPct}%` }} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-card-header">
                  <span className="text-ui-label">Hydration</span>
                  <div className="stat-card-icon"><Droplets size={16} /></div>
                </div>
                <div className="text-stat-val">
                  {waterVal.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--muted)' }}>ml</span>
                </div>
                <div className="text-caption" style={{ marginTop: '4px' }}>
                  {waterPct}% of {waterGoal.toLocaleString()} ml
                </div>
              </div>
              <div className="stat-progress-bar-bg">
                <div className="stat-progress-bar-fill" style={{ width: `${waterPct}%` }} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-card-header">
                  <span className="text-ui-label">Sleep</span>
                  <div className="stat-card-icon"><Moon size={16} /></div>
                </div>
                <div className="text-stat-val">
                  {sleepVal} <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--muted)' }}>hrs</span>
                </div>
                <div className="text-caption" style={{ marginTop: '4px' }}>
                  Target: {sleepGoal} hrs ({(sleepVal - sleepGoal) >= 0 ? '+' : ''}{(sleepVal - sleepGoal).toFixed(1)}h)
                </div>
              </div>
              <div className="stat-progress-bar-bg">
                <div className="stat-progress-bar-fill" style={{ width: `${sleepPct}%` }} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-card-header">
                  <span className="text-ui-label">Steps</span>
                  <div className="stat-card-icon"><Footprints size={16} /></div>
                </div>
                <div className="text-stat-val">
                  {stepsVal.toLocaleString()}
                </div>
                <div className="text-caption" style={{ marginTop: '4px' }}>
                  {stepsPct}% of {stepsGoal.toLocaleString()} steps
                </div>
              </div>
              <div className="stat-progress-bar-bg">
                <div className="stat-progress-bar-fill" style={{ width: `${stepsPct}%` }} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-card-header">
                  <span className="text-ui-label">Calories</span>
                  <div className="stat-card-icon"><Flame size={16} /></div>
                </div>
                <div className="text-stat-val">
                  {caloriesVal.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--muted)' }}>kcal</span>
                </div>
                <div className="text-caption" style={{ marginTop: '4px' }}>
                  {caloriesPct}% of {caloriesGoal.toLocaleString()} kcal
                </div>
              </div>
              <div className="stat-progress-bar-bg">
                <div className="stat-progress-bar-fill" style={{ width: `${caloriesPct}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* Expert Tip / Algorithmic Insight Panel */}
        <section className="insight-panel">
          <div className="insight-header">
            <TrendingUp size={15} />
            <span>&rarr; VITALS INSIGHT</span>
          </div>
          <div className="insight-content" style={{ flexWrap: 'wrap' }}>
            <div className="dark-stat-block">
              {insights?.[0]?.figure || `${bmiNum} BMI`}
            </div>
            <div className="white-stat-chip">
              {insights?.[0]?.chip || bmiCat}
            </div>
            <p className="insight-text" style={{ flex: 1, minWidth: '240px' }}>
              {insights?.[0]?.text || insights?.[0]?.message || 'Consistent hydration and circadian regularity keep metabolic recovery on track.'}
            </p>
          </div>
        </section>

        {/* BMI Range & Goal Progress Row */}
        <section className="charts-grid" style={{ marginBottom: '28px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="text-card-title">Body Mass Index (BMI)</h3>
              <span className="badge-ribbon">{bmiCat}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
              <span className="text-stat-val" style={{ fontSize: '28px' }}>{bmiNum}</span>
              <span className="text-caption">kg/m&sup2; (Healthy: 18.5 &ndash; 24.9)</span>
            </div>
            {/* BMI Spectrum Bar */}
            <div style={{ position: 'relative', height: '10px', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '8px' }}>
              <div style={{ width: '17.5%', background: '#005fb9' }} title="Underweight (<18.5)" />
              <div style={{ width: '32%', background: '#008254' }} title="Normal (18.5-24.9)" />
              <div style={{ width: '25.5%', background: '#b1b3b5' }} title="Overweight (25-29.9)" />
              <div style={{ width: '25%', background: '#de2828' }} title="Obese (30+)" />
            </div>
            <div style={{ position: 'relative', height: '14px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${bmiPercent}%`,
                  transform: 'translateX(-50%)',
                  top: 0,
                  width: '10px',
                  height: '10px',
                  background: 'var(--ink)',
                  borderRadius: '2px'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="text-card-title">Goal Progress</h3>
              <button
                type="button"
                onClick={() => setActiveTab('body-comp')}
                style={{ background: 'none', border: 'none', color: 'var(--link)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Body Comp Lab
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="text-caption" style={{ display: 'block' }}>START</span>
                <strong style={{ fontSize: '16px' }}>{startWeight} kg</strong>
              </div>
              <ArrowRight size={16} color="var(--muted)" />
              <div>
                <span className="text-caption" style={{ display: 'block', color: 'var(--primary)' }}>CURRENT</span>
                <strong style={{ fontSize: '20px', color: 'var(--primary)' }}>{currentWeight} kg</strong>
              </div>
              <ArrowRight size={16} color="var(--muted)" />
              <div style={{ textAlign: 'right' }}>
                <span className="text-caption" style={{ display: 'block' }}>TARGET</span>
                <strong style={{ fontSize: '16px' }}>{targetWeight} kg</strong>
              </div>
            </div>
            <div className="stat-progress-bar-bg" style={{ height: '8px', marginBottom: '8px' }}>
              <div className="stat-progress-bar-fill" style={{ width: `${goalPct}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>
              <span>{goalPct}% complete</span>
              <span>{remainingKg} kg remaining</span>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="text-h2">Health Trends</h2>
              <p className="text-caption">Weight, activity, sleep, and hydration over time</p>
            </div>
            <div className="chart-toggles">
              {[
                { id: '7d', label: 'Weekly' },
                { id: '14d', label: '14 Days' },
                { id: 'all', label: 'All' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setChartRange(r.id)}
                  className={`chart-toggle-btn ${chartRange === r.id ? 'active' : ''}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="text-card-title">Weight Trend (kg)</h3>
                  <span className="text-caption">Target: {targetWeight} kg</span>
                </div>
                <span className="badge-ribbon">{Number(weightDelta) <= 0 ? `${weightDelta} kg` : `+${weightDelta} kg`}</span>
              </div>
              <div className="chart-canvas-wrapper">
                <Line data={weightChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="text-card-title">Daily Steps</h3>
                  <span className="text-caption">Target: {stepsGoal.toLocaleString()}</span>
                </div>
                <span className="badge-ribbon">Avg: {avgSteps.toLocaleString()}</span>
              </div>
              <div className="chart-canvas-wrapper">
                <Bar data={stepsChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="text-card-title">Sleep Duration (hrs)</h3>
                  <span className="text-caption">Target: {sleepGoal} hrs</span>
                </div>
                <span className="badge-ribbon">Avg: {avgSleep}h</span>
              </div>
              <div className="chart-canvas-wrapper">
                <Line data={sleepChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="text-card-title">Water Intake (ml)</h3>
                  <span className="text-caption">Target: {waterGoal} ml</span>
                </div>
                <span className="badge-ribbon">Avg: {avgWater.toLocaleString()} ml</span>
              </div>
              <div className="chart-canvas-wrapper">
                <Bar data={waterChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </section>

        {/* Streaks & Badges */}
        <section className="mint-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={20} color="var(--primary)" />
            <h2 className="text-h2">Milestones &amp; Badges</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px' }}>
            {badges.map(b => (
              <div
                key={b.id}
                style={{
                  padding: '14px 16px',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: '8px',
                  background: b.unlocked ? '#ffffff' : 'var(--canvas-soft)',
                  opacity: b.unlocked ? 1 : 0.6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '14px', color: b.unlocked ? 'var(--ink)' : 'var(--muted)' }}>
                    {b.name}
                  </strong>
                  {b.unlocked && <span className="badge-ribbon">Earned</span>}
                </div>
                <p className="text-caption">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
