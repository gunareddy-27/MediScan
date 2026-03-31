# MediScan AI - Next-Gen Health Diagnosis

## 🌟 Introduction
MediScan AI is a state-of-the-art health pre-diagnosis platform. It combines Machine Learning, NLP, and Computer Vision to provide users with immediate medical insights, emergency alerts, and personalized recovery roadmaps.

## 🚀 Advanced AI Features
- **🚨 Emergency "Red Flag" Detection**: Real-time monitoring for critical symptoms (heart attack, stroke markers) with immediate emergency service escalation.
- **👁️ SkinScan AI (Computer Vision)**: Analyze skin concerns via image uploads using simulated pattern recognition logic.
- **🧠 NLP 2.0 Semantic Mapping**: Understands "how you feel" using a rich synonym map; recognizes slang and descriptive phrases (e.g., "head pressure" instead of "headache").
- **🕺 Interactive Body Map**: A visual silhouette selector for quick symptom entry based on body regions.
- **🎤 Voice Command Diagnosis**: Integrated Web Speech API for hands-free symptom reporting with real-time transcription.
- **🗺️ 7-Day Personalized Roadmap**: Generates a phase-based recovery plan for detected conditions, including diet and rest schedules.
- **🤖 MediScan Counsel**: An AI reasoning engine that explains the "Why" behind every diagnosis.
- **📄 Report Analyzer AI (Advanced Parsing)**: Automated study of medical reports (PDF/Image) with vitals extraction and keyword-based explanation of parameters.
- **💊 Pharmacy AI Lookup (Database Integration)**: Suggests typical medications and treatments for detected conditions with a dedicated disease-med lookup engine.
- **📊 Health Trends Dashboard**: Persistent historical tracking using SQLite and data visualization via **Chart.js**.

## 🛠️ Technology Stack
- **Backend**: Flask, Scikit-Learn (Random Forest), NumPy, Pandas
- **Frontend**: Vanilla JS, Chart.js, CSS3 (Glassmorphism), Web Speech API
- **Storage**: SQLite (History Tracking), MySQL (Optional User Data)

## 📦 Setup Instructions
1. **Prerequisites**: Python 3.11+
2. **Install Dependencies**:
   ```bash
   pip install flask scikit-learn pandas numpy
   ```
3. **Initialize Database**:
   - The app uses **SQLite** (`medical_checker.db`) by default for local history.
   - For MySQL integration, run the `schema.sql` script and update `DB_CONFIG` in `app.py`.
4. **Execution**:
   ```bash
   python app.py
   ```
5. **URL**: Visit `http://127.0.0.1:5000`

## 🩺 AI Logic & Clinical Accuracy
The platform utilizes an **Ensemble Prediction Model** paired with a **Clinical Refinement Layer** that cross-references serious conditions (AIDS, Hypertension, Diabetes) against mandatory clinical markers to prevent over-diagnosis and ensure patient safety.

---
*Disclaimer: MediScan AI is an educational tool and does not replace professional medical advice. Always consult a doctor for serious concerns.*
