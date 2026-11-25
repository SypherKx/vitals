# -*- coding: utf-8 -*-
"""
generate_synopsis.py
Generates an official, academic-grade B.Tech Project Synopsis PDF
for "Vitals: Intelligent Local-First Personal Health Monitoring & Clinical Risk Stratification System"
using ReportLab.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return  # Skip page number on cover page
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64666A"))
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 36, page_text)
        self.drawString(54, 36, "Vitals: B.Tech Major Project Synopsis — React Health Intelligence System")
        self.setStrokeColor(colors.HexColor("#D8D9DA"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        self.restoreState()

def create_synopsis_pdf(output_path="PROJECT_SYNOPSIS_VITALS.pdf"):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palettes (NerdWallet inspired editorial green/dark)
    c_primary = colors.HexColor("#008254")
    c_dark = colors.HexColor("#00482F")
    c_ink = colors.HexColor("#000000")
    c_body = colors.HexColor("#2C2E31")
    c_muted = colors.HexColor("#5A5C60")
    c_mint_bg = colors.HexColor("#EFFCF8")
    c_hairline = colors.HexColor("#D8D9DA")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_dark,
        spaceAfter=8,
        alignment=1
    )

    sub_title_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_muted,
        spaceAfter=15,
        alignment=1
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_ink,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_body,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_body,
        leftIndent=14,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=c_dark
    )

    story = []

    # ------------------ COVER HEADER ------------------
    story.append(Spacer(1, 10))
    story.append(Paragraph("PROJECT SYNOPSIS", ParagraphStyle('Eyebrow', fontName='Helvetica-Bold', fontSize=10, textColor=c_primary, alignment=1, spaceAfter=4)))
    story.append(Paragraph("VITALS: INTELLIGENT LOCAL-FIRST PERSONAL HEALTH MONITORING & CLINICAL RISK STRATIFICATION SYSTEM", title_style))
    story.append(Paragraph("A Capstone Major Project Submitted in Partial Fulfillment of Bachelor of Technology (B.Tech) in Computer Science & Engineering", sub_title_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=4, spaceAfter=14))

    # Meta Table (Candidate Details)
    meta_data = [
        [Paragraph("<b>Project Category:</b> Healthcare Informatics & Full-Stack Web Eng.", body_style), Paragraph("<b>Academic Year:</b> 2026 – Final Year Major Project", body_style)],
        [Paragraph("<b>Frontend Framework:</b> React 18, Vite, Chart.js, Lucide", body_style), Paragraph("<b>Architecture:</b> Local-First, Zero-Trust Storage Model", body_style)],
        [Paragraph("<b>Author / Candidate:</b> Final Year B.Tech CSE Candidate", body_style), Paragraph("<b>Department:</b> Computer Science & Engineering", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[250, 250])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_mint_bg),
        ('BOX', (0,0), (-1,-1), 1, c_hairline),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_hairline),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # ------------------ 1. ABSTRACT ------------------
    story.append(Paragraph("1. Abstract & Executive Summary", h1_style))
    story.append(Paragraph(
        "Modern consumer health tracking platforms overwhelmingly rely on proprietary cloud backends that transmit, serialize, and monetize sensitive biometric records. This introduces severe privacy vulnerabilities, subscription paywalls, vendor lock-in, and operational latency. <b>Vitals</b> is an enterprise-grade, single-page application built using <b>React 18, Vite, and HTML5 Web Storage</b> that functions as an intelligent, local-first personal health monitor and predictive clinical risk stratifier. Operating with zero external API dependencies and zero cloud synchronization, the system executes client-side clinical algorithms including <b>Mifflin-St Jeor Basal Metabolic Rate (BMR)</b>, <b>U.S. Navy Circumference-based Body Fat estimation</b>, <b>Framingham 10-Year Cardiovascular Disease Risk Stratification</b>, <b>AHA Blood Pressure stage categorization</b>, and an <b>algorithmic sleep regularity & debt evaluator</b>. The platform features responsive multi-axial biometrics, macronutrient partitioning, an interactive clinical report generator, and cryptographic local backup restore functionality.",
        body_style
    ))

    # ------------------ 2. PROBLEM STATEMENT ------------------
    story.append(Paragraph("2. Problem Statement & Motivation", h1_style))
    story.append(Paragraph(
        "Commercial fitness ecosystems (Apple Health, MyFitnessPal, Whoop, Fitbit) enforce continuous internet connectivity, mandatory authenticated identity federation, and remote telemetry storage. Users are systematically deprived of data ownership. Furthermore, existing client-side tracking web tools are often rudimentary 'CRUD' todo-lists lacking physiological rigor. There is a conspicuous academic and clinical demand for a high-performance, responsive, browser-native client capable of executing real-time biometric inference, anomaly triage (e.g. rapid fluid retention detection for congestive heart failure risks), and clinical dossiers without exposing data to external networks.",
        body_style
    ))

    # ------------------ 3. PROJECT OBJECTIVES ------------------
    story.append(Paragraph("3. Objectives of the Project", h1_style))
    story.append(Paragraph("• <b>Local-First Privacy Architecture:</b> Guarantee that 100% of biometric telemetry, longitudinal records, and notes remain encrypted or stored solely within client-side Web Storage.", bullet_style))
    story.append(Paragraph("• <b>Clinical Formula Implementation:</b> Integrate validated medical formulations for BMR/TDEE, Navy Body Fat, Framingham Cardiovascular Risk, and Mean Arterial Pressure (MAP).", bullet_style))
    story.append(Paragraph("• <b>Modern React Component Hierarchy:</b> Structure modular React components using custom hooks (`useLocalStorage`, `useBiometrics`, `useAlerts`) ensuring 60fps rendering across desktop, tablet, and mobile viewports.", bullet_style))
    story.append(Paragraph("• <b>Clinical Anomaly & Triage Detection:</b> Implement client-side heuristic rules flagging dangerous biometrics (e.g., Stage 2 Hypertension, acute weight variance, prolonged sleep deficits).", bullet_style))
    story.append(Paragraph("• <b>Data Portability & Clinical Dossier:</b> Provide one-click generation of comprehensive medical assessment dossiers (PDF/Print, Standalone HTML, and UTF-8 BOM CSV exports).", bullet_style))

    # ------------------ 4. SYSTEM ARCHITECTURE ------------------
    story.append(Paragraph("4. System Architecture & Methodology", h1_style))
    story.append(Paragraph(
        "The application is engineered using a decoupled, reactive single-page architecture powered by Vite and React. The system employs a <b>Repository Pattern</b> abstracting persistent browser storage from application state.",
        body_style
    ))

    arch_data = [
        [Paragraph("<b>Layer</b>", h2_style), Paragraph("<b>Components & Responsibilities</b>", h2_style)],
        [Paragraph("<b>Presentation Layer</b>", body_style), Paragraph("React 18 Virtual DOM, Lucide Icons, Chart.js canvas rendering, NerdWallet design system, responsive bottom nav for mobile.", body_style)],
        [Paragraph("<b>Clinical Logic Engine</b>", body_style), Paragraph("Pure JavaScript algorithmic modules: `calc.js` evaluating Mifflin-St Jeor, ASCVD risk, Navy BF%, Sleep Debt, and heuristic observations.", body_style)],
        [Paragraph("<b>State & Hook Layer</b>", body_style), Paragraph("Custom React Hooks (`useBiometrics`, `useStorage`, `useReminders`) maintaining immutable reactive state and dispatching UI actions.", body_style)],
        [Paragraph("<b>Persistence & I/O</b>", body_style), Paragraph("LocalStorage driver with error-boundary fallback, JSON Schema sanitization, UTF-8 BOM CSV exporter, and Blob-based file generators.", body_style)]
    ]
    t_arch = Table(arch_data, colWidths=[120, 380])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_mint_bg),
        ('BOX', (0,0), (-1,-1), 1, c_hairline),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_hairline),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 10))

    # ------------------ 5. MATHEMATICAL & CLINICAL FORMULATIONS ------------------
    story.append(Paragraph("5. Mathematical & Clinical Formulations", h1_style))
    story.append(Paragraph("<b>A. Mifflin-St Jeor Basal Metabolic Rate (BMR):</b>", h2_style))
    story.append(Paragraph("For Males: BMR = (10 × W) + (6.25 × H) - (5 × A) + 5<br/>For Females: BMR = (10 × W) + (6.25 × H) - (5 × A) - 161<br/><i>Where W = Weight in kg, H = Height in cm, A = Age in years. Scaled by Activity Multipliers (1.2 to 1.9) to yield Total Daily Energy Expenditure (TDEE).</i>", body_style))

    story.append(Paragraph("<b>B. U.S. Navy Circumference Body Fat (BF%) Formulation:</b>", h2_style))
    story.append(Paragraph("Males: BF% = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450<br/>Females: BF% = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450", body_style))

    story.append(Paragraph("<b>C. Mean Arterial Pressure (MAP) & Blood Pressure Staging:</b>", h2_style))
    story.append(Paragraph("MAP = DBP + 1/3(SBP - DBP). Clinically evaluated under AHA 2017 parameters:<br/>Normal (<120/80), Elevated (120-129/<80), Stage 1 Hypertension (130-139 or 80-89), Stage 2 (≥140 or ≥90).", body_style))

    story.append(Paragraph("<b>D. Framingham 10-Year ASCVD Risk Score & Vascular Age:</b>", h2_style))
    story.append(Paragraph("Multivariate regression assessing age, systolic blood pressure, BMI, and smoking status to project 10-year percentage probability of major adverse coronary events.", body_style))

    # ------------------ 6. CORE MODULES ------------------
    story.append(Paragraph("6. Detailed Functional Modules", h1_style))
    story.append(Paragraph("<b>Module 1: Comprehensive Vitals & Biometrics Dashboard:</b> 5 real-time stat cards with progress meters, interactive multi-axial Chart.js graphs (Weekly, Monthly, All), and NerdWallet-inspired Expert Insight panels.", bullet_style))
    story.append(Paragraph("<b>Module 2: Body Composition & Anthropometry Lab:</b> Standalone Navy-method body fat calculator, lean mass vs fat mass distributor, and somatotype categorization.", bullet_style))
    story.append(Paragraph("<b>Module 3: Cardiovascular & Metabolic Risk Stratifier:</b> 10-year coronary risk assessment, arterial pulse pressure, and vascular age disparity indicator.", bullet_style))
    story.append(Paragraph("<b>Module 4: Macronutrient & Caloric Partitioning:</b> Targeted distribution of Protein (4 kcal/g), Carbohydrates (4 kcal/g), and Lipids (9 kcal/g) configured by dietary strategy (High-Protein, Keto, Endurance).", bullet_style))
    story.append(Paragraph("<b>Module 5: Sleep Architecture & Circadian Efficiency:</b> Rolling sleep deficit tracking, Sleep Regularity Index (SRI), and sleep debt recovery guidance.", bullet_style))
    story.append(Paragraph("<b>Module 6: Clinical Anomaly Detection Engine:</b> Rule-based detection alerting users to acute weight variations (>1.5kg/24h), chronic sleep debt, and elevated hemodynamic vitals.", bullet_style))
    story.append(Paragraph("<b>Module 7: Habit Prompts & Medication Adherence:</b> Browser Notification API integration with in-app banner fallback for hydration, medication, and workout routines.", bullet_style))
    story.append(Paragraph("<b>Module 8: Telehealth Dossier & Data Portability:</b> Print-to-PDF clinical health dossier, UTF-8 BOM CSV ledger, and verified JSON backup import/export with structural inspection.", bullet_style))

    # ------------------ 7. TECH STACK SPECIFICATION ------------------
    story.append(Paragraph("7. Technology Stack & Implementation Details", h1_style))

    tech_table_data = [
        [Paragraph("<b>Component</b>", h2_style), Paragraph("<b>Technology</b>", h2_style), Paragraph("<b>Technical Justification</b>", h2_style)],
        [Paragraph("Frontend Library", body_style), Paragraph("React 18.3", body_style), Paragraph("Declarative component state, high-frequency Virtual DOM diffing.", body_style)],
        [Paragraph("Bundler / Tooling", body_style), Paragraph("Vite 6.x", body_style), Paragraph("Instant Hot Module Replacement (HMR) and optimized Rollup tree-shaking.", body_style)],
        [Paragraph("Data Visualizations", body_style), Paragraph("Chart.js 4.4 + React-Chartjs-2", body_style), Paragraph("Hardware-accelerated HTML5 canvas graphs with custom tooltip delegates.", body_style)],
        [Paragraph("Iconography", body_style), Paragraph("Lucide React", body_style), Paragraph("Consistent 1.75px SVG strokes compliant with medical UI accessibility.", body_style)],
        [Paragraph("Client Storage", body_style), Paragraph("HTML5 LocalStorage API", body_style), Paragraph("Persistent, zero-network, local client key-value database.", body_style)],
        [Paragraph("Styling & Motion", body_style), Paragraph("CSS3 Variables + Hardware Acceleration", body_style), Paragraph("60fps GPU compositor transitions respecting prefers-reduced-motion.", body_style)]
    ]
    t_tech = Table(tech_table_data, colWidths=[100, 120, 280])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_mint_bg),
        ('BOX', (0,0), (-1,-1), 1, c_hairline),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_hairline),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    # ------------------ 8. COMPARATIVE ANALYSIS ------------------
    story.append(Paragraph("8. Comparative Analysis: Vitals vs. Commercial Solutions", h1_style))
    comp_data = [
        [Paragraph("<b>Parameter</b>", h2_style), Paragraph("<b>Commercial Apps (MyFitnessPal, etc.)</b>", h2_style), Paragraph("<b>Vitals (Proposed System)</b>", h2_style)],
        [Paragraph("Data Storage & Privacy", body_style), Paragraph("Remote Cloud (Monetized/Telemetry)", body_style), Paragraph("<b>100% Local (Zero-Trust)</b>", body_style)],
        [Paragraph("Authentication", body_style), Paragraph("Mandatory OAuth / Email Login", body_style), Paragraph("<b>Zero Auth / Instant Access</b>", body_style)],
        [Paragraph("Internet Dependency", body_style), Paragraph("Mandatory Active Connectivity", body_style), Paragraph("<b>100% Offline Capable</b>", body_style)],
        [Paragraph("Subscription Model", body_style), Paragraph("Freemium / Monthly Paywalls", body_style), Paragraph("<b>Free, Open-Source Architecture</b>", body_style)],
        [Paragraph("Clinical Transparency", body_style), Paragraph("Black-box Proprietary Algorithms", body_style), Paragraph("<b>Open Deterministic Math</b>", body_style)]
    ]
    t_comp = Table(comp_data, colWidths=[110, 195, 195])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_mint_bg),
        ('BOX', (0,0), (-1,-1), 1, c_hairline),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_hairline),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_comp)
    story.append(Spacer(1, 10))

    # ------------------ 9. FUTURE ENHANCEMENTS & ROADMAP ------------------
    story.append(Paragraph("9. Academic & Technical Roadmap", h1_style))
    story.append(Paragraph("• <b>Web Bluetooth API Wearable Bridge:</b> Direct pairing with consumer BLE heart rate bands and continuous glucose monitors.", bullet_style))
    story.append(Paragraph("• <b>HL7 / FHIR Clinical Interoperability:</b> Exporting health metrics in standardized JSON FHIR schema for Electronic Health Record (EHR) ingestion.", bullet_style))
    story.append(Paragraph("• <b>WebAssembly (WASM) Signal Processing:</b> Client-side optical photoplethysmography (PPG) pulse analysis using phone cameras.", bullet_style))

    # ------------------ 10. CONCLUSION & REFERENCES ------------------
    story.append(Paragraph("10. Conclusion & References", h1_style))
    story.append(Paragraph(
        "The <b>Vitals</b> React health intelligence system demonstrates that full-featured, clinically sound health informatics platforms can thrive completely on the edge without remote server compromises. By uniting robust React state paradigms with deterministic physiological algorithms, the project represents a comprehensive, production-grade achievement for an undergraduate Capstone Major Project.",
        body_style
    ))
    story.append(Paragraph("<b>Key References:</b><br/>"
                           "1. Mifflin MD, St Jeor ST, et al. 'A new predictive equation for resting energy expenditure in healthy individuals.' <i>Am J Clin Nutr</i>, 1990.<br/>"
                           "2. Hodgdon JA, Beckett MB. 'Prediction of percent body fat for U.S. Navy men and women.' <i>Naval Health Research Center</i>, 1984.<br/>"
                           "3. Whelton PK, et al. '2017 ACC/AHA Clinical Practice Guideline on Blood Pressure in Adults.' <i>Hypertension</i>, 2018.<br/>"
                           "4. D'Agostino RB, et al. 'General cardiovascular risk profile for use in primary care: the Framingham Heart Study.' <i>Circulation</i>, 2008.",
                           ParagraphStyle('Ref', fontName='Helvetica', fontSize=8, leading=11, textColor=c_muted)))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated B.Tech Project Synopsis PDF: {output_path}")

if __name__ == "__main__":
    create_synopsis_pdf()
