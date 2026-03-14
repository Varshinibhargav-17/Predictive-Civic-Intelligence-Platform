NagaraIQ — Predictive Civic Intelligence Platform

A pothole in Koramangala gets fixed in 3 days. The same pothole in Yelahanka takes 47 days. NagaraIQ finds that pattern — and exposes it.

Built for Build for Bengaluru 2.0 · Civic-tech & Governance · PS 4.4

What It Does
NagaraIQ is an AI-powered civic complaint platform with two views built on the same engine.
For ward officers — complaints come in, get classified automatically, sorted by urgency, and displayed as a prioritized queue with a ward heatmap and 7-day forecast.
For journalists and citizens — the same data surfaces as a bias heatmap showing which wards get ignored, which resolutions are fake, and auto-generates investigation briefs with RTI query templates.

Features

Image + Text Classification — upload a photo or type a complaint, AI identifies the issue
Urgency Scoring — every complaint gets a 0–100 priority score automatically
Ward Heatmap — live Bengaluru map showing complaint density per ward
Resolution Bias Detector — statistically flags wards with unfair resolution times
Fake Resolution Detector — catches complaints marked resolved but re-filed within 14 days
7-Day Forecast — predicts complaint spikes before they happen
Investigation Brief — one-click AI-generated brief for journalists with RTI templates


Tech Stack

Backend-FastAPI + Python
Database-PostgreSQL
Frontend-React + Vite + Tailwind
Map-Leaflet.js
Text AI-distilBERT (HuggingFace)
Image AI-CLIP ViT-B/32 (HuggingFace)

Getting Started
1. Clone and set up environment
bashgit clone https://github.com/Varshinibhargav-17/Predictive-Civic-Intelligence-Platform.git
cd Predictive-Civic-Intelligence-Platform
cp .env.example .env

Fill in .env:
envPOSTGRES_URL=postgresql://postgres:password@localhost:5432/nagaraiq

2. Backend setup
bashcd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm

Pre-download ML models :
bashpython -c "
from transformers import pipeline, CLIPModel, CLIPProcessor
pipeline('zero-shot-classification', model='cross-encoder/nli-distilroberta-base')
CLIPModel.from_pretrained('openai/clip-vit-base-patch32')
print('Models ready.')
"

3. Database setup
bashcreatedb nagaraiq
python data/load_csv.py
uvicorn main:app --reload --port 8000

4. Frontend setup
bashcd ../frontend
npm install
npm run dev
App runs at http://localhost:5173 · API docs at http://localhost:8000/docs

Testing Image Classification
bashcurl -X POST -F "file=@pothole.jpg" http://127.0.0.1:8000/classify-image
json{
  "predicted_category": "Road & Potholes",
  "confidence": 0.74,
  "needs_manual_confirmation": false
}
If confidence is below 0.20 (blurry or unclear image), needs_manual_confirmation returns true and the frontend shows a manual category dropdown.

Dataset
1000 civic complaints across 25 Bengaluru wards — 30 real complaints sourced from consumercomplaints.in, 970 synthetic complaints modelled on real BBMP ward statistics.
The bias is baked in and measurable:

Affluent wards average 6.9 days to resolve complaints
Non-affluent wards average 70.4 days
