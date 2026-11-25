/**
 * clinicalMath.js
 * Comprehensive Physiological, Anthropometric & Epidemiological Calculations
 * Part of Vitals - B.Tech Final Year Health Informatics Project
 */

export const ClinicalMath = {
  // ---------------- UNIT CONVERSIONS ----------------
  kgToLb(kg) {
    return kg ? Number((kg * 2.20462).toFixed(1)) : 0;
  },

  lbToKg(lb) {
    return lb ? Number((lb / 2.20462).toFixed(1)) : 0;
  },

  cmToInches(cm) {
    return cm ? Number((cm / 2.54).toFixed(1)) : 0;
  },

  inchesToCm(inches) {
    return inches ? Number((inches * 2.54).toFixed(1)) : 0;
  },

  // ---------------- BMI & ANTHROPOMETRY ----------------
  calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) {
      return { value: 0, category: 'Unknown', color: '#64666a', healthyRange: [0, 0], barPercent: 0 };
    }
    const heightM = heightCm / 100;
    const bmiVal = Number((weightKg / (heightM * heightM)).toFixed(1));

    let category = 'Normal weight';
    let color = '#008254'; // primary green

    if (bmiVal < 18.5) {
      category = 'Underweight';
      color = '#005fb9';
    } else if (bmiVal < 25.0) {
      category = 'Normal weight';
      color = '#008254';
    } else if (bmiVal < 30.0) {
      category = 'Overweight';
      color = '#64666a';
    } else {
      category = 'Obese';
      color = '#de2828';
    }

    const minHealthy = Number((18.5 * heightM * heightM).toFixed(1));
    const maxHealthy = Number((24.9 * heightM * heightM).toFixed(1));
    const barPercent = Math.max(0, Math.min(100, Math.round(((bmiVal - 15) / (35 - 15)) * 100)));

    return {
      value: bmiVal,
      category,
      color,
      healthyRange: [minHealthy, maxHealthy],
      barPercent
    };
  },

  // ---------------- U.S. NAVY BODY FAT % FORMULA ----------------
  // Uses waist, neck, height (and hip for females) in centimeters
  calculateNavyBodyFat(gender, heightCm, waistCm, neckCm, hipCm = 0) {
    if (!heightCm || !waistCm || !neckCm) return null;
    try {
      const hIn = heightCm / 2.54;
      const wIn = waistCm / 2.54;
      const nIn = neckCm / 2.54;

      let bfPercent = 0;
      if (gender === 'male' || gender === 'other') {
        const val = wIn - nIn;
        if (val <= 0) return null;
        bfPercent = 495 / (1.0324 - 0.19077 * Math.log10(val) + 0.15456 * Math.log10(hIn)) - 450;
      } else {
        // female requires hip circumference
        const hipIn = (hipCm || waistCm * 1.1) / 2.54;
        const val = wIn + hipIn - nIn;
        if (val <= 0) return null;
        bfPercent = 495 / (1.29579 - 0.35004 * Math.log10(val) + 0.22100 * Math.log10(hIn)) - 450;
      }

      bfPercent = Math.max(3, Math.min(60, Number(bfPercent.toFixed(1))));

      let category = 'Fitness';
      if (gender === 'male') {
        if (bfPercent < 6) category = 'Essential Fat';
        else if (bfPercent <= 13) category = 'Athletes';
        else if (bfPercent <= 17) category = 'Fitness';
        else if (bfPercent <= 24) category = 'Acceptable';
        else category = 'High / Obesity Risk';
      } else {
        if (bfPercent < 14) category = 'Essential Fat';
        else if (bfPercent <= 20) category = 'Athletes';
        else if (bfPercent <= 24) category = 'Fitness';
        else if (bfPercent <= 31) category = 'Acceptable';
        else category = 'High / Obesity Risk';
      }

      return {
        bodyFatPercent: bfPercent,
        category
      };
    } catch {
      return null;
    }
  },

  // ---------------- MIFFLIN-ST JEOR METABOLIC RATE (BMR & TDEE) ----------------
  calculateBMR(weightKg, heightCm, age, gender = 'other') {
    if (!weightKg || !heightCm || !age) return 1650;
    const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (gender === 'male') return Math.round(base + 5);
    if (gender === 'female') return Math.round(base - 161);
    return Math.round(base - 78);
  },

  calculateCalorieTarget(weightKg, heightCm, age, gender, activityLevel = 'moderate', goalType = 'maintain') {
    const bmr = this.calculateBMR(weightKg, heightCm, age, gender);
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9
    };
    const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.375));

    let target = tdee;
    if (goalType === 'lose') {
      target = Math.max(gender === 'female' ? 1200 : 1500, tdee - 500);
    } else if (goalType === 'gain') {
      target = tdee + 400;
    }

    return { bmr, tdee, target };
  },

  // ---------------- MACRONUTRIENT PARTITIONING ----------------
  calculateMacros(calorieTarget, dietStrategy = 'balanced', weightKg = 70) {
    const cals = calorieTarget || 2000;
    let pPct = 0.25, cPct = 0.50, fPct = 0.25;

    if (dietStrategy === 'high-protein') {
      pPct = 0.35; cPct = 0.40; fPct = 0.25;
    } else if (dietStrategy === 'keto') {
      pPct = 0.25; cPct = 0.05; fPct = 0.70;
    } else if (dietStrategy === 'endurance') {
      pPct = 0.20; cPct = 0.60; fPct = 0.20;
    }

    const proteinGrams = Math.round((cals * pPct) / 4);
    const carbsGrams = Math.round((cals * cPct) / 4);
    const fatGrams = Math.round((cals * fPct) / 9);

    return {
      protein: { grams: proteinGrams, kcal: proteinGrams * 4, pct: Math.round(pPct * 100) },
      carbs: { grams: carbsGrams, kcal: carbsGrams * 4, pct: Math.round(cPct * 100) },
      fat: { grams: fatGrams, kcal: fatGrams * 9, pct: Math.round(fPct * 100) },
      proteinPerKg: Number((proteinGrams / (weightKg || 70)).toFixed(2))
    };
  },

  // ---------------- BLOOD PRESSURE & HEMODYNAMICS (AHA Guidelines) ----------------
  classifyBloodPressure(systolic, diastolic) {
    if (!systolic || !diastolic) return null;
    const s = Number(systolic);
    const d = Number(diastolic);

    // Mean Arterial Pressure (MAP) = DBP + 1/3 (SBP - DBP)
    const map = Math.round(d + (1 / 3) * (s - d));
    // Pulse pressure
    const pulsePressure = s - d;

    let stage = 'Normal';
    let color = '#008254'; // primary green
    let advisory = 'Optimal arterial pressure.';

    if (s > 180 || d > 120) {
      stage = 'Hypertensive Crisis';
      color = '#de2828';
      advisory = 'Emergency medical consultation recommended immediately.';
    } else if (s >= 140 || d >= 90) {
      stage = 'Hypertension Stage 2';
      color = '#de2828';
      advisory = 'Clinical intervention and lifestyle modifications advised.';
    } else if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) {
      stage = 'Hypertension Stage 1';
      color = '#64666a';
      advisory = 'Monitor lifestyle, dietary sodium, and regular cardiovascular exercise.';
    } else if (s >= 120 && s <= 129 && d < 80) {
      stage = 'Elevated';
      color = '#005fb9';
      advisory = 'Slightly elevated systolic reading. Monitor trend.';
    }

    return { systolic: s, diastolic: d, map, pulsePressure, stage, color, advisory };
  },

  // ---------------- FRAMINGHAM / ASCVD 10-YEAR CARDIOVASCULAR RISK ESTIMATOR ----------------
  calculateCardioRisk(age, gender, sbp, bmiVal, isSmoker = false, isTreatedBP = false) {
    const a = age || 30;
    const sys = sbp || 120;
    const bmi = bmiVal || 22.5;

    // Simplified non-laboratory clinical regression model
    let riskScore = 1.0;
    if (a > 35) riskScore += (a - 35) * 0.35;
    if (sys > 120) riskScore += ((sys - 120) / 10) * 1.2;
    if (bmi > 25) riskScore += (bmi - 25) * 0.45;
    if (isSmoker) riskScore += 4.5;
    if (gender === 'male') riskScore *= 1.35;

    riskScore = Math.max(0.5, Math.min(45, Number(riskScore.toFixed(1))));

    let riskTier = 'Low Risk (<10%)';
    let vascularAge = Math.round(a + (riskScore > 10 ? (riskScore - 10) * 0.8 : -(10 - riskScore) * 0.4));
    vascularAge = Math.max(18, Math.min(90, vascularAge));

    if (riskScore >= 20) riskTier = 'High Risk (≥20%)';
    else if (riskScore >= 10) riskTier = 'Moderate Risk (10–19%)';

    return {
      tenYearRiskPercent: riskScore,
      riskTier,
      vascularAge,
      ageDisparity: vascularAge - a
    };
  },

  // ---------------- SLEEP EFFICIENCY & CIRCADIAN DEBT ----------------
  calculateSleepDebt(logs = [], targetSleep = 8.0) {
    if (!logs.length) return { debtHours: 0, avgSleep: targetSleep, regularity: 100 };
    const recent = logs.slice(0, 7).filter(l => l.sleep > 0);
    if (!recent.length) return { debtHours: 0, avgSleep: targetSleep, regularity: 100 };

    const totalSleep = recent.reduce((sum, l) => sum + l.sleep, 0);
    const avgSleep = Number((totalSleep / recent.length).toFixed(1));
    const debtHours = Number(Math.max(0, (targetSleep * recent.length) - totalSleep).toFixed(1));

    // Simple variance-based regularity index
    const variance = recent.reduce((sum, l) => sum + Math.pow(l.sleep - avgSleep, 2), 0) / recent.length;
    const regularity = Math.max(50, Math.min(100, Math.round(100 - (Math.sqrt(variance) * 15))));

    return { debtHours, avgSleep, regularity, loggedDays: recent.length };
  },

  // ---------------- CLINICAL ANOMALY DETECTION ENGINE ----------------
  detectClinicalAnomalies(profile, logs = []) {
    const alerts = [];
    if (!logs || logs.length < 2) return alerts;

    const newest = logs[0];
    const prev = logs[1];

    // 1. Acute Weight Fluctuations (Possible Congestive Fluid Retention)
    if (newest.weight && prev.weight) {
      const diff = Number((newest.weight - prev.weight).toFixed(1));
      if (diff >= 1.5) {
        alerts.push({
          type: 'warning',
          title: 'Acute Fluid Shift Flag',
          message: `Body mass shifted by +${diff} kg in 24 hours. Monitor for edema (swelling) or elevated sodium retention.`
        });
      }
    }

    // 2. Severe Sleep Deprivation Cluster
    const last3 = logs.slice(0, 3).filter(l => l.sleep > 0);
    if (last3.length === 3 && last3.every(l => l.sleep < 5.0)) {
      alerts.push({
        type: 'danger',
        title: 'Severe Sleep Debt Alert',
        message: 'Sleep has registered below 5 hours for 3 consecutive days. Cognitive fatigue and cortisol elevation are elevated.'
      });
    }

    // 3. Stage 2 Blood Pressure
    if (newest.systolic && newest.diastolic) {
      const bp = this.classifyBloodPressure(newest.systolic, newest.diastolic);
      if (bp && (bp.stage === 'Hypertension Stage 2' || bp.stage === 'Hypertensive Crisis')) {
        alerts.push({
          type: 'danger',
          title: `Arterial Pressure Alert (${bp.stage})`,
          message: `Latest recording of ${bp.systolic}/${bp.diastolic} mmHg is clinically elevated. Consult a physician.`
        });
      }
    }

    return alerts;
  },

  // ---------------- HEURISTIC RULE-BASED INSIGHTS ----------------
  generateInsights(profile, logs = []) {
    const insights = [];
    if (!logs.length) {
      return [{
        label: 'INITIAL BASELINE',
        figure: '0',
        chip: 'Day 1',
        text: 'Record your first daily metrics to calibrate metabolic burn, hydration indices, and sleep debt observations.'
      }];
    }

    const recent7 = logs.slice(0, 7);

    // Sleep insight
    const sleepLogs = recent7.filter(l => l.sleep > 0);
    const targetSleep = profile?.sleepTarget || 8.0;
    if (sleepLogs.length >= 2) {
      const avg = Number((sleepLogs.reduce((acc, l) => acc + l.sleep, 0) / sleepLogs.length).toFixed(1));
      const diff = Number(Math.abs(avg - targetSleep).toFixed(1));
      insights.push({
        label: avg < targetSleep ? 'SLEEP TARGET DEFICIT' : 'OPTIMAL SLEEP ADHERENCE',
        figure: `${avg}h`,
        chip: `Target ${targetSleep}h`,
        text: avg < targetSleep
          ? `You've averaged ${avg}h sleep across the last ${sleepLogs.length} logs, ${diff}h under target.`
          : `You've maintained steady rest averaging ${avg}h/night, aligning with recovery targets.`
      });
    }

    // Water insight
    const waterLogs = recent7.filter(l => l.water > 0);
    const waterTarget = profile?.waterTarget || 2200;
    if (waterLogs.length >= 2) {
      const metCount = waterLogs.filter(l => l.water >= waterTarget).length;
      const avgW = Math.round(waterLogs.reduce((acc, l) => acc + l.water, 0) / waterLogs.length);
      insights.push({
        label: metCount >= 4 ? 'HYDRATION CONSISTENCY' : 'HYDRATION OPPORTUNITY',
        figure: `${avgW}ml`,
        chip: `${metCount}/${waterLogs.length} Days Met`,
        text: metCount >= 4
          ? `Hydration target satisfied on ${metCount} of the last ${waterLogs.length} logged entries.`
          : `Daily fluid intake averaged ${avgW}ml. Consider keeping a 500ml water vessel on your workspace.`
      });
    }

    // Weight velocity
    if (logs.length >= 2) {
      const weightLogs = logs.filter(l => l.weight > 0);
      if (weightLogs.length >= 2) {
        const delta = Number((weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight).toFixed(1));
        if (delta !== 0) {
          insights.push({
            label: delta < 0 ? 'WEIGHT LOSS VELOCITY' : 'WEIGHT GAIN TRAJECTORY',
            figure: `${delta > 0 ? '+' : ''}${delta} kg`,
            chip: 'Net Trend',
            text: delta < 0
              ? `Down ${Math.abs(delta)} kg over recent records. Progress is sustainable and steady.`
              : `Up +${delta} kg over recent records. Continue monitoring macronutrient energy density.`
          });
        }
      }
    }

    return insights;
  },

  // ---------------- STREAKS ----------------
  calculateStreak(logs = []) {
    if (!logs.length) return { current: 0, longest: 0 };
    const dateSet = new Set(logs.map(l => l.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(today);
    const todayStr = today.toISOString().split('T')[0];

    // If today not logged, check yesterday
    if (!dateSet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];
      if (!dateSet.has(yesterdayStr)) {
        return { current: 0, longest: this.calculateLongestStreak(logs) };
      }
    }

    let streak = 0;
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (dateSet.has(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { current: streak, longest: Math.max(streak, this.calculateLongestStreak(logs)) };
  },

  calculateLongestStreak(logs = []) {
    if (!logs.length) return 0;
    const sorted = Array.from(new Set(logs.map(l => l.date))).sort();
    let maxS = 1, curr = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const next = new Date(sorted[i]);
      const diff = Math.round((next - prev) / 86400000);
      if (diff === 1) {
        curr++;
        if (curr > maxS) maxS = curr;
      } else if (diff > 1) {
        curr = 1;
      }
    }
    return maxS;
  }
};

// Top-level named convenience exports for React components
export const calculateBMI = (w, h) => ClinicalMath.calculateBMI(w, h);
export const calculateNavyBodyFat = (gender, h, waist, neck, hip) => ClinicalMath.calculateNavyBodyFat(gender, h, waist, neck, hip);
export const calculateFraminghamRisk = (data) => {
  const age = data?.age || 30;
  const gender = data?.gender || 'male';
  const sys = data?.systolicBP || 120;
  const bmi = 22.5;
  const isSmoker = Boolean(data?.smoker);
  const isTreated = Boolean(data?.treatedBP);
  const res = ClinicalMath.calculateCardioRisk(age, gender, sys, bmi, isSmoker, isTreated);
  return {
    riskPercent: res.tenYearRiskPercent,
    category: res.riskTier,
    vascularAge: res.vascularAge
  };
};
export const calculateBloodPressureCategory = (sys, dia) => {
  const res = ClinicalMath.classifyBloodPressure(sys, dia);
  return {
    category: res?.stage || 'Normal',
    description: res?.advisory || 'Normal blood pressure readings.'
  };
};
export const calculateMacronutrientSplit = (cal, strat) => {
  const res = ClinicalMath.calculateMacros(cal, strat);
  return {
    protein: { grams: res.protein.grams, calories: res.protein.kcal, percent: res.protein.pct },
    carbs: { grams: res.carbs.grams, calories: res.carbs.kcal, percent: res.carbs.pct },
    fats: { grams: res.fat.grams, calories: res.fat.kcal, percent: res.fat.pct }
  };
};
export const evaluateClinicalAnomalies = (logs) => {
  const alerts = ClinicalMath.detectClinicalAnomalies(null, logs);
  return alerts.map(a => ({
    metric: a.title,
    value: a.type,
    flag: a.message,
    severity: a.type === 'danger' ? 'urgent' : 'moderate'
  }));
};
export const generateHeuristicInsights = (logs, prof) => {
  const ins = ClinicalMath.generateInsights(prof, logs);
  return ins.map(i => ({
    message: i.text,
    label: i.label,
    figure: i.figure,
    chip: i.chip
  }));
};
export const computeStreaks = (logs) => {
  const s = ClinicalMath.calculateStreak(logs);
  return { currentStreak: s.current, longestStreak: s.longest };
};
export const evaluateBadges = (logs, profile, streaks) => [
  { id: 'first_log', name: 'First Step', desc: 'Logged first clinical metric', unlocked: logs.length >= 1 },
  { id: 'streak_3', name: 'Consistent 3', desc: 'Logged 3 consecutive days', unlocked: (streaks?.currentStreak || 0) >= 3 },
  { id: 'streak_7', name: '7-Day Streak', desc: 'Maintained a 7-day logging streak', unlocked: (streaks?.currentStreak || 0) >= 7 },
  { id: 'hydration_week', name: 'Hydration Target', desc: 'Met water target', unlocked: logs.some(l => l.water >= (profile?.waterTarget || 2000)) },
  { id: 'steps_10k', name: '10k Steps Day', desc: 'Crossed 10,000 steps in one day', unlocked: logs.some(l => l.steps >= 10000) },
  { id: 'first_1kg_down', name: 'First 1kg Down', desc: 'Progress toward weight goal', unlocked: logs.length >= 3 }
];

