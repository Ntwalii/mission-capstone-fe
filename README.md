# Rwanda Trade Pulse

Welcome to the mission capstone frontend. This app powers interactive analysis, forecasting, and risk detection for Rwanda’s agricultural trade, backed by a microservices stack.

Backend services live separately in mission-capstone-be (auth, basic data, model). [Rwanda Trade Pulse Backend.](https://github.com/Ntwalii/mission-capstone-fe)

Deployed URL: https://mission-capstone-fe.vercel.app/

Video Demo: 

[Loom video recording.](https://www.loom.com/share/25b73debe2c44016a87adcfbaec622f5)

## Table of Contents

Technology Stack

Architecture

Getting Started

Testing Results

Model Performance

Analysis

Discussion

Recommendations & Future Work

## Technology Stack
Area	Technology
Frontend	React, TypeScript, Vite, Tailwind CSS
Backend	Node.js (Express), Python (FastAPI)
DB	PostgreSQL (via Knex.js)
Auth	JWT, OAuth 2.0
ML	scikit-learn, pandas (time-series model)

## Architecture

mission-capstone-fe (this repo): React UI for dashboards, forecasting.

mission-capstone-be:

intelligence-auth-service: registration/login with JWT & OAuth.

basic-data-service: trades, commodities, partners; stats & market-opportunities endpoints.

model-service: FastAPI; forecasting.

The platform follows a microservices pattern with a web-only presentation layer, API gateway for auth/routing, and separate data/ML services for maintainability and scale. 

## Getting Started
Prereqs

Node.js ≥ 18

npm / bun

Backend services running locally or reachable remotely

Setup
## 1) Clone
git clone https://github.com/your-username/mission-capstone-fe.git
cd mission-capstone-fe

## 2) Install
npm install

## 3) Env
#### Create .env at project root
#### VITE_API_URL points to basic data service with all the trade data(e.g., http://localhost:8000)
#### VITE_AUTH_API_URL points to auth service (e.g., http://localhost:8001)
#### VITE_MODEL_SERVICE_URL points to model service(e.g http://localhost:1738)

# 4) Run
npm run dev


.env

VITE_API_URL=http://localhost:8000
VITE_AUTH_API_URL=http://localhost:8001

Testing Results (illustrative)
Strategies

E2E smoke: critical flows (login → dashboard → forecast)

Scenarios

Auth Flow: user can sign up, log in, hit a protected route.

Dashboard Data: stats fetched and summarized correctly.

Empty Data Case: graceful “No data” rendering.

Large Series Rendering: time-series chart handles 10k+ points acceptably.

### Perf (qualitative)
#### Spec	Load	Interactivity	Notes
1. High-end desktop	~1.2s	Smooth	Local services
2. Mid-range laptop	~2.5s	Smooth	
3. Mobile	~4.0s	Acceptable


Analysis

The system shifts from static, descriptive reporting toward predictive and anomaly-aware analytics targeted at non-government stakeholders (researchers, NGOs, investors).

Mixed-methods evaluation (quant + qual) ensures both technical validity and usability. 


Discussion

Authentication unblocked role-based features and secure routes.

The frontend integrates three distinct backends cleanly, supporting the microservices goal of independent evolution/deployment.

Accessibility & simplicity were prioritized so non-technical users can act on insights. 


Recommendations & Future Work

Recommendations

Keep microservices boundaries clear for scale and team velocity.

Invest in UX for interpretability: plain-language insights, exportable summaries.

Future Work

Add exogenous features (macro, prices) to improve forecasts.

Expand “what-if” simulations (e.g., growth shocks, tariff changes).

Productionize anomaly alerts with configurable thresholds & notifications.
