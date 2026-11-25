/**
 * storageService.js
 * Client-Side LocalStorage Repository with Schema Verification,
 * UTF-8 BOM CSV Generator & Backup Import/Export
 * Part of Vitals - B.Tech Final Year Health Informatics Project
 */

const STORAGE_KEYS = {
  PROFILE: 'vitals_react_profile',
  LOGS: 'vitals_react_logs',
  GOALS: 'vitals_react_goals',
  WORKOUTS: 'vitals_react_workouts',
  MEDICATIONS: 'vitals_react_medications',
  MEALS: 'vitals_react_meals',
  BODY_COMP: 'vitals_react_bodycomp',
  REMINDERS: 'vitals_react_reminders',
  BADGES: 'vitals_react_badges',
  SETTINGS: 'vitals_react_settings'
};

export const StorageService = {
  _get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`[StorageService] Failed to parse key ${key}:`, e);
      return fallback;
    }
  },

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[StorageService] Failed to set key ${key}:`, e);
      return false;
    }
  },

  // ---------------- PROFILE ----------------
  getProfile() {
    return this._get(STORAGE_KEYS.PROFILE, null);
  },

  saveProfile(profileData) {
    const existing = this.getProfile() || {};
    const updated = {
      ...existing,
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    if (!updated.createdAt) updated.createdAt = new Date().toISOString();
    this._set(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  hasCompletedOnboarding() {
    const p = this.getProfile();
    return !!(p && p.name && p.height && p.currentWeight);
  },

  // ---------------- DAILY LOGS ----------------
  getLogs() {
    const logs = this._get(STORAGE_KEYS.LOGS, []);
    return Array.isArray(logs) ? logs.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
  },

  saveLog(entry) {
    if (!entry || !entry.date) return false;
    const logs = this.getLogs();
    const idx = logs.findIndex(l => l.date === entry.date);

    const record = {
      date: entry.date,
      weight: entry.weight !== null && entry.weight !== '' ? Number(entry.weight) : null,
      water: Number(entry.water) || 0,
      sleep: Number(entry.sleep) || 0,
      steps: Number(entry.steps) || 0,
      calories: Number(entry.calories) || 0,
      systolic: entry.systolic ? Number(entry.systolic) : null,
      diastolic: entry.diastolic ? Number(entry.diastolic) : null,
      bloodGlucose: entry.bloodGlucose ? Number(entry.bloodGlucose) : null,
      mood: entry.mood ? Number(entry.mood) : null,
      note: (entry.note || '').trim(),
      updatedAt: new Date().toISOString()
    };

    if (idx >= 0) {
      logs[idx] = { ...logs[idx], ...record };
    } else {
      logs.unshift(record);
    }

    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    this._set(STORAGE_KEYS.LOGS, logs);

    // Keep profile current weight in sync if newest date
    if (record.weight && logs[0].date === record.date) {
      const p = this.getProfile();
      if (p) {
        p.currentWeight = record.weight;
        this.saveProfile(p);
      }
    }

    return record;
  },

  deleteLog(dateStr) {
    const filtered = this.getLogs().filter(l => l.date !== dateStr);
    this._set(STORAGE_KEYS.LOGS, filtered);
    return true;
  },

  // ---------------- GOALS ----------------
  getGoals() {
    const p = this.getProfile() || {};
    return this._get(STORAGE_KEYS.GOALS, {
      goalType: p.goalType || 'lose',
      targetWeight: p.targetWeight || 63.0,
      startWeight: p.startWeight || 68.0,
      targetDate: p.targetDate || '',
      dietStrategy: 'balanced'
    });
  },

  saveGoals(goals) {
    const current = this.getGoals();
    const updated = { ...current, ...goals, updatedAt: new Date().toISOString() };
    this._set(STORAGE_KEYS.GOALS, updated);
    return updated;
  },

  // ---------------- WORKOUTS ----------------
  getWorkouts() {
    const w = this._get(STORAGE_KEYS.WORKOUTS, []);
    return Array.isArray(w) ? w.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
  },

  saveWorkout(workout) {
    const list = this.getWorkouts();
    const rec = {
      id: workout.id || 'w_' + Date.now(),
      date: workout.date || new Date().toISOString().split('T')[0],
      type: workout.type || 'Running',
      duration: Number(workout.duration) || 0,
      intensity: workout.intensity || 'moderate',
      caloriesBurned: Number(workout.caloriesBurned) || 0,
      note: (workout.note || '').trim()
    };
    list.unshift(rec);
    this._set(STORAGE_KEYS.WORKOUTS, list);
    return rec;
  },

  deleteWorkout(id) {
    const list = this.getWorkouts().filter(w => w.id !== id);
    this._set(STORAGE_KEYS.WORKOUTS, list);
    return true;
  },

  // ---------------- MEDICATIONS & SUPPLEMENTS ----------------
  getMedications() {
    return this._get(STORAGE_KEYS.MEDICATIONS, []);
  },

  saveMedication(med) {
    const list = this.getMedications();
    const rec = {
      id: med.id || 'med_' + Date.now(),
      name: med.name,
      dosage: med.dosage || '',
      frequency: med.frequency || 'Daily',
      time: med.time || '08:00',
      takenToday: !!med.takenToday,
      notes: med.notes || ''
    };
    const idx = list.findIndex(m => m.id === rec.id);
    if (idx >= 0) list[idx] = rec;
    else list.push(rec);
    this._set(STORAGE_KEYS.MEDICATIONS, list);
    return rec;
  },

  toggleMedicationTaken(id) {
    const list = this.getMedications();
    const found = list.find(m => m.id === id);
    if (found) {
      found.takenToday = !found.takenToday;
      this._set(STORAGE_KEYS.MEDICATIONS, list);
    }
    return list;
  },

  deleteMedication(id) {
    const list = this.getMedications().filter(m => m.id !== id);
    this._set(STORAGE_KEYS.MEDICATIONS, list);
    return true;
  },

  // ---------------- MEALS & MACROS ----------------
  getMeals() {
    return this._get(STORAGE_KEYS.MEALS, []);
  },

  saveMeal(meal) {
    const list = this.getMeals();
    const rec = {
      id: meal.id || 'meal_' + Date.now(),
      date: meal.date || new Date().toISOString().split('T')[0],
      category: meal.category || 'Lunch',
      name: meal.name,
      calories: Number(meal.calories) || 0,
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fat: Number(meal.fat) || 0
    };
    list.unshift(rec);
    this._set(STORAGE_KEYS.MEALS, list);
    return rec;
  },

  deleteMeal(id) {
    const list = this.getMeals().filter(m => m.id !== id);
    this._set(STORAGE_KEYS.MEALS, list);
    return true;
  },

  // ---------------- BODY COMPOSITION (U.S. Navy) ----------------
  getBodyComp() {
    return this._get(STORAGE_KEYS.BODY_COMP, {
      waistCm: 76,
      neckCm: 37,
      hipCm: 92,
      bodyFatPercent: 21.4,
      lastUpdated: new Date().toISOString()
    });
  },

  saveBodyComp(comp) {
    const updated = { ...this.getBodyComp(), ...comp, lastUpdated: new Date().toISOString() };
    this._set(STORAGE_KEYS.BODY_COMP, updated);
    return updated;
  },

  // ---------------- REMINDERS ----------------
  getReminders() {
    return this._get(STORAGE_KEYS.REMINDERS, []);
  },

  saveReminder(rem) {
    const list = this.getReminders();
    const rec = {
      id: rem.id || 'rem_' + Date.now(),
      title: rem.title,
      type: rem.type || 'water',
      time: rem.time || '10:00',
      days: rem.days || [1, 2, 3, 4, 5],
      active: rem.active !== false
    };
    list.push(rec);
    this._set(STORAGE_KEYS.REMINDERS, list);
    return rec;
  },

  toggleReminder(id) {
    const list = this.getReminders();
    const found = list.find(r => r.id === id);
    if (found) {
      found.active = !found.active;
      this._set(STORAGE_KEYS.REMINDERS, list);
    }
    return list;
  },

  deleteReminder(id) {
    const list = this.getReminders().filter(r => r.id !== id);
    this._set(STORAGE_KEYS.REMINDERS, list);
    return true;
  },

  // ---------------- BADGES ----------------
  getBadges() {
    return this._get(STORAGE_KEYS.BADGES, []);
  },

  awardBadge(badge) {
    const list = this.getBadges();
    if (!list.some(b => b.id === badge.id)) {
      list.push({ ...badge, earnedAt: new Date().toISOString() });
      this._set(STORAGE_KEYS.BADGES, list);
    }
    return list;
  },

  // ---------------- EXPORT & IMPORT ----------------
  exportJSON() {
    const backup = {
      vitals_system: 'Vitals Health Intelligence Suite v2.0 (React/B.Tech Capstone)',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      goals: this.getGoals(),
      logs: this.getLogs(),
      workouts: this.getWorkouts(),
      medications: this.getMedications(),
      meals: this.getMeals(),
      bodyComp: this.getBodyComp(),
      reminders: this.getReminders(),
      badges: this.getBadges()
    };
    return JSON.stringify(backup, null, 2);
  },

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') throw new Error('Invalid JSON structure');

      if (data.profile) this._set(STORAGE_KEYS.PROFILE, data.profile);
      if (data.goals) this._set(STORAGE_KEYS.GOALS, data.goals);
      if (Array.isArray(data.logs)) this._set(STORAGE_KEYS.LOGS, data.logs);
      if (Array.isArray(data.workouts)) this._set(STORAGE_KEYS.WORKOUTS, data.workouts);
      if (Array.isArray(data.medications)) this._set(STORAGE_KEYS.MEDICATIONS, data.medications);
      if (Array.isArray(data.meals)) this._set(STORAGE_KEYS.MEALS, data.meals);
      if (data.bodyComp) this._set(STORAGE_KEYS.BODY_COMP, data.bodyComp);
      if (Array.isArray(data.reminders)) this._set(STORAGE_KEYS.REMINDERS, data.reminders);
      if (Array.isArray(data.badges)) this._set(STORAGE_KEYS.BADGES, data.badges);

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  exportCSV() {
    const logs = this.getLogs();
    const p = this.getProfile() || {};
    const h = p.height || 170;

    const headers = [
      'Date',
      'Weight (kg)',
      'BMI',
      'Systolic (mmHg)',
      'Diastolic (mmHg)',
      'Mean Arterial Pressure (mmHg)',
      'Blood Glucose (mg/dL)',
      'Water (ml)',
      'Sleep (hrs)',
      'Steps',
      'Calories (kcal)',
      'Mood (1-5)',
      'Clinical Notes'
    ];

    if (!logs.length) {
      return '\uFEFF' + headers.join(',') + '\n';
    }

    const rows = logs.map(l => {
      let bmi = '';
      if (l.weight && h > 0) {
        bmi = (l.weight / Math.pow(h / 100, 2)).toFixed(1);
      }
      let map = '';
      if (l.systolic && l.diastolic) {
        map = Math.round(l.diastolic + (1 / 3) * (l.systolic - l.diastolic));
      }

      return [
        l.date,
        l.weight !== null ? l.weight : '',
        bmi,
        l.systolic || '',
        l.diastolic || '',
        map,
        l.bloodGlucose || '',
        l.water || 0,
        l.sleep || 0,
        l.steps || 0,
        l.calories || 0,
        l.mood || '',
        `"${(l.note || '').replace(/"/g, '""')}"`
      ];
    });

    return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  resetAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    return true;
  },

  clearAll() {
    return this.resetAll();
  },

  seedClinicalDemo(force = true) {
    return this.seedDemoData(force);
  },

  // ---------------- SEED 14-DAY CLINICAL DATA ----------------
  seedDemoData(force = false) {
    if (!force && this.hasCompletedOnboarding() && this.getLogs().length > 0) {
      return;
    }

    const today = new Date();
    const fmt = d => {
      const yr = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${yr}-${m}-${day}`;
    };

    const targetDateObj = new Date(today);
    targetDateObj.setDate(targetDateObj.getDate() + 30);

    const profile = {
      name: 'Ashutosh',
      age: 21,
      gender: 'male',
      height: 175,
      startWeight: 73.5,
      currentWeight: 71.4,
      activityLevel: 'moderate',
      goalType: 'lose',
      targetWeight: 69.0,
      targetDate: fmt(targetDateObj),
      calorieTarget: 2350,
      waterTarget: 2500,
      sleepTarget: 8.0,
      stepsTarget: 8000,
      restingHR: 64,
      neckCircumference: 37,
      waistCircumference: 80,
      hipCircumference: 94,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
    };
    this._set(STORAGE_KEYS.PROFILE, profile);

    const goals = {
      goalType: 'lose',
      targetWeight: 69.0,
      targetDate: fmt(targetDateObj),
      startWeight: 73.5,
      weeklyPace: 0.5,
      dietStrategy: 'high-protein'
    };
    this._set(STORAGE_KEYS.GOALS, goals);

    const bodyComp = {
      waistCm: 80,
      neckCm: 37,
      hipCm: 94,
      bodyFatPercent: 15.6,
      lastUpdated: new Date().toISOString()
    };
    this._set(STORAGE_KEYS.BODY_COMP, bodyComp);

    const rawLogs = [
      { offset: 13, weight: 73.5, water: 2200, sleep: 6.5, steps: 7800, calories: 2450, sbp: 120, dbp: 78, glucose: 91, mood: 3, note: 'Day 1 baseline after morning lectures.' },
      { offset: 12, weight: 73.3, water: 2400, sleep: 7.5, steps: 8900, calories: 2380, sbp: 118, dbp: 76, glucose: 88, mood: 4, note: 'Walked across campus + evening gym.' },
      { offset: 11, weight: 73.1, water: 2500, sleep: 8.0, steps: 9400, calories: 2300, sbp: 118, dbp: 76, glucose: 87, mood: 5, note: 'Full hydration target hit.' },
      { offset: 10, weight: 72.9, water: 2300, sleep: 6.5, steps: 8200, calories: 2400, sbp: 122, dbp: 78, glucose: 92, mood: 3, note: 'Late night DSA & project lab coding.' },
      { offset: 9,  weight: 72.7, water: 2600, sleep: 7.5, steps: 10600, calories: 2320, sbp: 120, dbp: 78, glucose: 89, mood: 4, note: '10k+ steps + badminton with friends.' },
      { offset: 8,  weight: 72.5, water: 2500, sleep: 8.0, steps: 9100, calories: 2280, sbp: 116, dbp: 74, glucose: 86, mood: 5, note: 'First 1kg down milestone reached.' },
      { offset: 7,  weight: 72.4, water: 2450, sleep: 7.5, steps: 8700, calories: 2340, sbp: 118, dbp: 76, glucose: 88, mood: 4, note: 'Steady week of classes and workouts.' },
      { offset: 6,  weight: 72.2, water: 2350, sleep: 7.0, steps: 8400, calories: 2390, sbp: 119, dbp: 77, glucose: 90, mood: 4, note: 'Lab viva prep, stayed hydrated.' },
      { offset: 5,  weight: 72.0, water: 2700, sleep: 8.5, steps: 11200, calories: 2250, sbp: 116, dbp: 74, glucose: 85, mood: 5, note: 'Weekend 5k morning run on track.' },
      { offset: 4,  weight: 71.9, water: 2500, sleep: 7.5, steps: 8800, calories: 2310, sbp: 118, dbp: 76, glucose: 87, mood: 4, note: 'Upper body hypertrophy session.' },
      { offset: 3,  weight: 71.7, water: 2550, sleep: 8.0, steps: 9300, calories: 2290, sbp: 117, dbp: 75, glucose: 86, mood: 5, note: 'Good recovery and focus in lectures.' },
      { offset: 2,  weight: 71.6, water: 2400, sleep: 7.0, steps: 8600, calories: 2340, sbp: 118, dbp: 76, glucose: 89, mood: 4, note: 'Leg day + evening campus walk.' },
      { offset: 1,  weight: 71.5, water: 2600, sleep: 8.0, steps: 10100, calories: 2260, sbp: 116, dbp: 75, glucose: 86, mood: 5, note: 'Hit 10k steps and clean protein macros.' },
      { offset: 0,  weight: 71.4, water: 2350, sleep: 7.5, steps: 8950, calories: 2310, sbp: 118, dbp: 76, glucose: 88, mood: 4, note: 'Feeling energetic, capstone work on track.' }
    ];

    const logs = rawLogs.map(l => {
      const d = new Date(today);
      d.setDate(d.getDate() - l.offset);
      return {
        date: fmt(d),
        weight: l.weight,
        water: l.water,
        sleep: l.sleep,
        steps: l.steps,
        calories: l.calories,
        systolic: l.sbp,
        diastolic: l.dbp,
        bloodGlucose: l.glucose,
        mood: l.mood,
        note: l.note
      };
    });
    this._set(STORAGE_KEYS.LOGS, logs);

    const workouts = [
      { id: 'w1', date: fmt(new Date(today.getTime() - 1 * 86400000)), type: 'Running', duration: 35, intensity: 'moderate', caloriesBurned: 360, note: 'Morning 5k campus track run' },
      { id: 'w2', date: fmt(new Date(today.getTime() - 2 * 86400000)), type: 'Gym / Strength', duration: 60, intensity: 'high', caloriesBurned: 450, note: 'Squats, bench press, pull-ups' },
      { id: 'w3', date: fmt(new Date(today.getTime() - 4 * 86400000)), type: 'Badminton', duration: 50, intensity: 'high', caloriesBurned: 390, note: 'Evening court doubles with hostel mates' },
      { id: 'w4', date: fmt(new Date(today.getTime() - 7 * 86400000)), type: 'Cycling', duration: 40, intensity: 'moderate', caloriesBurned: 320, note: 'Campus perimeter ride' },
      { id: 'w5', date: fmt(new Date(today.getTime() - 9 * 86400000)), type: 'HIIT / Circuit', duration: 30, intensity: 'high', caloriesBurned: 310, note: 'Push-ups, burpees & core circuit' }
    ];
    this._set(STORAGE_KEYS.WORKOUTS, workouts);

    const medications = [
      { id: 'm1', name: 'Multivitamin + Zinc', dosage: '1 Tablet', frequency: 'Daily after breakfast', time: '09:00', takenToday: true, notes: 'Immunity & energy metabolism' },
      { id: 'm2', name: 'Omega-3 Fish Oil (EPA/DHA)', dosage: '1000 mg', frequency: 'Daily with lunch', time: '13:30', takenToday: true, notes: 'Brain focus & cardiovascular support' },
      { id: 'm3', name: 'Vitamin D3 (Cholecalciferol)', dosage: '2000 IU', frequency: 'Daily', time: '20:30', takenToday: false, notes: 'Bone strength & recovery' }
    ];
    this._set(STORAGE_KEYS.MEDICATIONS, medications);

    const meals = [
      { id: 'f1', date: fmt(today), category: 'Breakfast', name: 'Oats with Whey Protein, Banana & Peanut Butter', calories: 520, protein: 34, carbs: 64, fat: 14 },
      { id: 'f2', date: fmt(today), category: 'Lunch', name: 'Paneer / Chicken Breast, Dal, Rice & Salad', calories: 740, protein: 46, carbs: 84, fat: 20 },
      { id: 'f3', date: fmt(today), category: 'Snack', name: 'Boiled Eggs & Roasted Makhana / Chana', calories: 340, protein: 22, carbs: 32, fat: 12 },
      { id: 'f4', date: fmt(today), category: 'Dinner', name: 'Grilled Paneer / Chicken Wrap with Curd', calories: 710, protein: 44, carbs: 68, fat: 22 }
    ];
    this._set(STORAGE_KEYS.MEALS, meals);

    const reminders = [
      { id: 'r1', title: 'Hydration Target (500ml water)', type: 'water', time: '10:00', days: [0, 1, 2, 3, 4, 5, 6], active: true },
      { id: 'r2', title: 'Post-Lunch Movement Walk', type: 'workout', time: '14:00', days: [1, 2, 3, 4, 5], active: true },
      { id: 'r3', title: 'Evening Magnesium & Wind-down', type: 'medicine', time: '21:30', days: [0, 1, 2, 3, 4, 5, 6], active: true }
    ];
    this._set(STORAGE_KEYS.REMINDERS, reminders);

    const badges = [
      { id: 'first_log', name: 'First Step', description: 'Logged first clinical metric', earnedAt: new Date(Date.now() - 13 * 86400000).toISOString() },
      { id: 'streak_3', name: 'Consistent 3', description: 'Logged 3 consecutive days', earnedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
      { id: 'streak_7', name: '7-Day Streak', description: 'Maintained a 7-day logging streak', earnedAt: new Date(Date.now() - 6 * 86400000).toISOString() },
      { id: 'hydration_week', name: 'Hydration Week', description: 'Met water target 5+ days', earnedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: 'steps_10k', name: '10k Steps Day', description: 'Crossed 10,000 steps in one day', earnedAt: new Date(Date.now() - 8 * 86400000).toISOString() },
      { id: 'first_workout', name: 'Workout Starter', description: 'Logged first physical exercise', earnedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
      { id: 'first_1kg_down', name: 'First 1kg Down', description: 'Lost 1.0 kg toward goal', earnedAt: new Date(Date.now() - 7 * 86400000).toISOString() }
    ];
    this._set(STORAGE_KEYS.BADGES, badges);
    return true;
  }
};

// Top-level named convenience exports for React components
export const loadProfile = () => StorageService.getProfile();
export const saveProfile = (p) => StorageService.saveProfile(p);
export const loadLogs = () => StorageService.getLogs();
export const saveLogs = (logs) => StorageService._set(STORAGE_KEYS.LOGS, logs);
export const loadWorkouts = () => StorageService.getWorkouts();
export const saveWorkouts = (w) => StorageService._set(STORAGE_KEYS.WORKOUTS, w);
export const loadMedications = () => StorageService.getMedications();
export const saveMedications = (m) => StorageService._set(STORAGE_KEYS.MEDICATIONS, m);
export const exportDataJSON = () => StorageService.exportBackupJSON();
export const exportLogsCSV = (logs) => StorageService.exportLogsCSV();
export const importDataJSON = (str) => StorageService.restoreBackupJSON(str);
export const resetAllData = () => StorageService.clearAll();
export const seedClinicalDemoData = () => {
  StorageService.seedClinicalDemo();
  return StorageService.getLogs();
};

