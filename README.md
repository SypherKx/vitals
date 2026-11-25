# Vitals — Local-First Clinical Health & Biometric Informatics Platform

> **B.Tech Computer Science & Engineering — Final Year Capstone Project**  
> A privacy-first, zero-telemetry personal health informatics and clinical self-monitoring web application built with **React 18**, **Vite**, **Chart.js**, and client-side physiological algorithms.

---

## 1. Project Meaning, Purpose & Real-World Importance

### What is Vitals?
**Vitals** is a **local-first Personal Health Record (PHR) and Biometric Surveillance System** that runs completely inside the user's browser without requiring any backend server, user login, or cloud database. All sensitive health telemetry (weight, blood pressure, fasting glucose, sleep, hydration, body composition, workouts, and medications) stays strictly on the user's device via `localStorage`, with full offline portability through JSON/CSV backups and printable clinical PDF dossiers.

### Why is it Important? (Problem Statement)
1. **Healthcare Data Privacy Crisis**: Commercial health apps routinely monetize, share, or expose sensitive biometric data on remote cloud servers. Vitals guarantees **100% data sovereignty**—zero network telemetry and zero third-party tracking.
2. **Preventive Cardiometabolic Screening**: Most consumer trackers only count steps or calories. Vitals bridges the gap between fitness apps and clinical informatics by computing **Framingham 10-Year ASCVD Risk**, **Mean Arterial Pressure (MAP)**, **AHA/ACC Hypertension Staging**, and **U.S. Navy Body Fat %** right on the client.
3. **Clinical Actionability for Telehealth**: Patients often struggle to summarize weeks of scattered readings during doctor visits. Vitals automatically detects **clinical anomalies** (hypertensive spikes, acute fluid shifts, severe sleep deprivation) and generates a structured **Telehealth Clinical Dossier** ready for physician review (`window.print()` PDF).

---

## 2. Core Use Cases

| User / Stakeholder | Use Case in Vitals |
|---|---|
| **Students & Young Adults** | Track daily hydration, sleep debt, campus step counts, workouts, and high-protein nutrition goals without subscriptions. |
| **Preventive Health Users** | Monitor Blood Pressure stages, Fasting Glucose, Mean Arterial Pressure (MAP), and 10-year cardiovascular risk trends. |
| **Fitness & Body Recomposition** | Measure true lean mass vs. fat mass using the U.S. Navy circumference formula rather than relying solely on BMI. |
| **Patients & Caregivers** | Manage daily medication/supplement adherence and export clean 14-day CSV/PDF clinical reports for doctor consultations. |

---

## 3. Clinical & Mathematical Engines (`clinicalMath.js`)

All physiological calculations run deterministically in pure JavaScript on the client:

1. **Basal Metabolic Rate & Total Daily Energy Expenditure (Mifflin-St Jeor Equation)**
   - **Male**: $\text{BMR} = (10 \times w) + (6.25 \times h) - (5 \times a) + 5$
   - **Female**: $\text{BMR} = (10 \times w) + (6.25 \times h) - (5 \times a) - 161$
   - Multiplied by physical activity factor (`1.2` to `1.9`) and adjusted for weight loss/gain targets.
2. **U.S. Navy Circumference Body Fat %**
   - Estimates body density and adipose percentage from neck, waist, hip (female), and height measurements using Department of Defense logarithmic equations.
3. **Framingham 10-Year ASCVD Risk & Vascular Age**
   - Multi-variable clinical risk stratification incorporating age, biological sex, systolic blood pressure, BMI, smoking status, and antihypertensive treatment, outputting both 10-year risk % and **Vascular Biological Age**.
4. **AHA/ACC 2017 Blood Pressure Staging & Mean Arterial Pressure (MAP)**
   - Computes $\text{MAP} = \text{DBP} + \frac{1}{3}(\text{SBP} - \text{DBP})$ and Pulse Pressure ($\text{SBP} - \text{DBP}$), classifying readings into *Normal*, *Elevated*, *Stage 1*, *Stage 2*, or *Hypertensive Crisis*.
5. **Macronutrient Partitioning (Atwater 4-4-9 Bioenergetic Model)**
   - Dynamically splits daily calorie targets into Protein ($4\text{ kcal/g}$), Carbohydrates ($4\text{ kcal/g}$), and Fats ($9\text{ kcal/g}$) across *Balanced*, *High-Protein*, *Ketogenic*, and *Endurance* strategies.
6. **Clinical Anomaly Surveillance & Heuristic Insights**
   - Screens recent logs for acute 24-hour fluid weight shifts ($\ge 1.5\text{ kg}$), 3-day severe sleep deprivation ($< 5\text{h}$), and Stage 2+ hypertension alerts, plus rule-based behavioral insights.

---

## 4. Tech Stack & System Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Component-driven SPA with fast HMR and optimized production bundling |
| **Data Visualization** | Chart.js + `react-chartjs-2` | Interactive longitudinal charts (Weight, Steps, Sleep, Water) with `7D / 14D / All` ranges |
| **Iconography** | Lucide React | Consistent clinical vector icons (zero emojis) |
| **Styling & Motion** | Vanilla CSS3 + Custom Properties | NerdWallet-inspired editorial design system, directional page transitions, responsive mobile bottom dock |
| **Client Persistence** | Web Storage API (`localStorage`) | Namespaced JSON persistence, UTF-8 BOM CSV export, JSON backup/restore |
| **Academic Documentation** | Python + ReportLab | Automated generation of `PROJECT_SYNOPSIS_VITALS.pdf` |

### Folder Structure
```text
personal health tracker/
├── react-vitals/                     # Main React 18 + Vite Application
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx                  # Entry point + global runtime error trap
│       ├── App.jsx                   # Routing, session/logout state, directional transitions
│       ├── index.css                 # Design tokens, responsive grids, print CSS, animations
│       ├── services/
│       │   ├── clinicalMath.js       # BMR/TDEE, Navy Body Fat, Framingham, MAP, Anomaly Engine
│       │   └── storageService.js     # LocalStorage repository, 14-day seeder, CSV/JSON export
│       └── components/
│           ├── LandingPage.jsx       # Public landing page with live snapshot preview
│           ├── Navbar.jsx            # Desktop editorial navigation + Logout + Alert badge
│           ├── MobileNav.jsx         # Touch-friendly bottom navigation bar (<=900px)
│           ├── Dashboard.jsx         # Hero band, 5 stat cards, BMI bar, Goal tracker, 4 charts, badges
│           ├── DailyLog.jsx          # Daily biometric entry + quick water steppers + audit table
│           ├── BodyCompLab.jsx       # U.S. Navy Body Fat & Lean/Fat Mass analyzer
│           ├── CardioRisk.jsx        # Framingham 10-year risk, vascular age & AHA BP staging
│           ├── NutritionLab.jsx      # Macro partitioning calculator across 4 diet strategies
│           ├── Workouts.jsx          # Exercise session logger & weekly active volume
│           ├── MedicationManager.jsx # Prescription/supplement adherence checklist
│           ├── Settings.jsx          # Profile configuration, JSON/CSV export, reset
│           └── ReportModal.jsx       # Printable Telehealth Clinical Dossier
├── generate_synopsis.py              # ReportLab script to generate academic synopsis PDF
├── PROJECT_SYNOPSIS_VITALS.pdf       # Ready-to-submit B.Tech Project Synopsis PDF
└── README.md                         # Project documentation
```

---

## 5. How to Run Locally

### Prerequisites
- **Node.js** (v18+ recommended) and **npm**

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/SypherKx/vitals.git
cd vitals/react-vitals

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

To build for production:
```bash
npm run build
npm run preview
```

---

## 6. LocalStorage Data Schema

All data is stored locally under isolated `vitals_react_*` keys:
- `vitals_react_profile` — Name, age, gender, height, start/current/target weight, targets, circumferences.
- `vitals_react_logs` — Date-indexed daily entries (`weight`, `water`, `sleep`, `steps`, `calories`, `systolic`, `diastolic`, `bloodGlucose`, `mood`, `note`).
- `vitals_react_workouts` — Exercise modality, duration (mins), RPE intensity, calories burned.
- `vitals_react_medications` — Regimen name, dosage, schedule time, daily taken status.
- `vitals_react_meals`, `vitals_react_goals`, `vitals_react_bodycomp`, `vitals_react_badges` — Supporting modules.

---

## 7. Viva & Faculty Evaluation Q&A

1. **Why did you choose a Local-First (`localStorage`) architecture instead of a SQL/MongoDB backend?**  
   *Answer:* Health telemetry is highly sensitive PII/PHI. Storing data strictly in the browser eliminates server breach risks, removes authentication friction, enables instant offline responsiveness, and preserves portability via JSON backup/restore and CSV export.
2. **How does the U.S. Navy Body Fat formula improve upon BMI?**  
   *Answer:* BMI ($\text{kg/m}^2$) only considers total mass and height, which misclassifies muscular individuals as overweight. The Navy equation incorporates neck, waist, and hip circumferences to estimate true body density and separate lean mass from fat mass.
3. **What is Mean Arterial Pressure (MAP) and why track it alongside Systolic/Diastolic BP?**  
   *Answer:* $\text{MAP} = \text{DBP} + \frac{1}{3}(\text{SBP} - \text{DBP})$ represents the average arterial pressure during a single cardiac cycle and indicates vital organ perfusion (healthy range: $70\text{–}105\text{ mmHg}$).
4. **How are the clinical insights and anomaly alerts generated without an external AI API?**  
   *Answer:* Using deterministic threshold rules and sliding-window statistics (`clinicalMath.js`) over the last 3–7 days of logs—guaranteeing zero hallucination, zero latency, and complete explainability for clinical metrics.
5. **How does the Telehealth Dossier export work without external PDF libraries in the browser?**  
   *Answer:* It uses a dedicated `@media print` CSS stylesheet (`index.css`) that hides interactive navigation chrome and formats the `ReportModal` into a clean clinical report with a physician sign-off block via `window.print()`.

---

## 8. Academic Synopsis Document

A formal 10-section academic synopsis PDF ([PROJECT_SYNOPSIS_VITALS.pdf](./PROJECT_SYNOPSIS_VITALS.pdf)) is included in the repository root for B.Tech project evaluation and submission.
