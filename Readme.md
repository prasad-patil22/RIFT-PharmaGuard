PharmaGuard

AI-Powered Pharmacogenomic Risk Prediction Engine

PharmaGuard is a MERN-based AI clinical decision support system that analyzes patient VCF genomic data and predicts drug-specific pharmacogenomic risks using CPIC-aligned rules and LLM-generated explanations.

This system parses authentic VCF v4.2 files, detects pharmacogenomic variants across critical genes, determines diplotype and phenotype, and generates structured clinical recommendations in strict JSON format.

🌐 Live Application

Frontend: https://uksquad.vercel.app

Backend API: https://pharmaguard-gn0n.onrender.com

🎥 Demo Video (LinkedIn)

Public Video Link: https://www.linkedin.com/posts/darshan-nandagavi_rift2026-pharmaguard-pharmacogenomics-ugcPost-7430405842614792192--jYZ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEq6mkIBU1m5cpajZjo7tY6ctzs3UESDIuY

Hashtags used: #RIFT2026 #PharmaGuard #Pharmacogenomics #AIinHealthcare

🧬 Problem Overview

Adverse drug reactions cause over 100,000 deaths annually. Many are preventable through pharmacogenomic testing.

PharmaGuard:

• Parses VCF v4.2 files • Identifies variants in 6 pharmacogenomic genes • Determines diplotype and phenotype • Predicts risk per drug • Generates CPIC-aligned clinical recommendations • Produces explainable AI reasoning • Outputs strict JSON schema compliant with RIFT

🏗 Architecture Overview Frontend (React.js)

• Drag-and-drop VCF upload • Multi-select drug input (react-select) • Risk visualization • Color-coded severity • Population pharmacogenomics charts (Chart.js) • JSON modal viewer • Copy-to-clipboard + download JSON • Integrated AI chatbot

Backend (Node.js + Express)

• Multer file upload (5MB limit) • VCF streaming parser using readline • Gene-wise variant mapping (pgxMapping.js) • Diplotype calculation engine • Activity score calculation • CPIC phenotype classification • Drug-gene risk engine • Guideline-based recommendation system • LLM integration via Groq (LLaMA 3.1) • Strict JSON output formatting

AI Layer

Model: llama-3.1-8b-instant (Groq SDK)

• Low temperature (0.2) for deterministic output • Forced JSON output format • Structured explainability • Variant citation support

🧬 Supported Genes

• CYP2D6 • CYP2C19 • CYP2C9 • SLCO1B1 • TPMT • DPYD

💊 Supported Drugs

• CODEINE • WARFARIN • CLOPIDOGREL • SIMVASTATIN • AZATHIOPRINE • FLUOROURACIL

Multi-drug input supported via comma-separated submission.

⚙ Core Processing Pipeline

Upload VCF -> Parse line-by-line -> Extract rsID + genotype -> Match against pharmacogenomic mapping -> Calculate diplotype -> Compute activity score -> Determine phenotype (PM / IM / NM / RM / URM) -> Determine risk level -> Generate CPIC-aligned recommendation -> Call LLM for structured explanation -> Return strict JSON output -> 📤 API Documentation -> POST /analyze

Request: Multipart FormData Fields: vcfFile: .vcf file drug: comma-separated drug names

Example: drug=CODEINE,WARFARIN Response Schema (STRICT)

{ "patient_id": "PATIENT_001", "drug": "WARFARIN", "timestamp": "ISO8601", "risk_assessment": { "risk_label": "Adjust Dosage", "confidence_score": 0.91, "severity": "moderate" }, "pharmacogenomic_profile": { "primary_gene": "CYP2C9", "diplotype": "*2/*3", "phenotype": "PM", "detected_variants": [...] }, "clinical_recommendation": {...}, "llm_generated_explanation": {...}, "quality_metrics": {...} }

Multi-drug returns:

{ "patient_id": "...", "analyses": [...], "timestamp": "...", "drugCount": 2 }

🧠 Risk Engine Logic

Phenotype Classification (Activity Score Based)

0 → PM 0 < score < 1 → IM 1 ≤ score < 2 → NM 2 ≤ score < 2.5 → RM ≥ 2.5 → URM

Drug-specific logic implemented using CPIC-based interpretation.

📊 Frontend Features

• Clinical-grade UI • Color-coded risk alerts • Diplotype + phenotype display • Variant table visualization • Population pharmacogenomics age simulation • Treatment efficacy trend modeling • JSON viewer (developer-friendly modal) • Integrated AI chatbot for post-analysis queries

🔒 Validation & Error Handling

• File size limit (5MB) • Invalid drug detection • Missing file validation • Unsupported drug rejection • Graceful fallback if LLM returns malformed JSON • VCF header validation • Variant detection fallback to wild-type (*1/*1)

🚀 Installation

Clone repository:

git clonehttps://github.com/prasad-patil22/RIFT-PharmaGuard.git

cd pharmaguard

Backend

cd server npm install

Create .env:

PORT=8000 GROQ_API_KEY=your_key

Run:

node index.js

Frontend

cd client npm install npm start

🌍 Deployment

Frontend: Vercel Backend: Render Environment Variables configured in hosting dashboard

📁 Project Structure

pharmaguard/ 
│ ├── client/ │ 
├── PharmaGuard.jsx 
│ ├── PharmaGuardChatbot.jsx  
│ └── components/ 
│ 
├── server/ │ 
├── index.js 
│└── uploads/ 
│ └── README.md

🧪 Testing

• Tested with provided sample VCF files • Multi-drug validation • JSON schema compliance verified • LLM JSON strict mode enforced

🧩 Innovation Highlights

• Hybrid deterministic + AI explainability • Activity-score-driven phenotype modeling • Multi-drug concurrent analysis • Strict JSON schema compliance • Clean stateless backend design • Integrated clinical chatbot

👥 Team

Member 1 – Darshan N Nandagavi Member 2 – Prasad I Patil Member 3 – Shekhar M chandaragi member 4 - Pavan I Patil

