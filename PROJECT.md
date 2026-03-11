# AODIT — Project logic and flow

This document is the **single source of truth** for what AODIT is, how reports work, and where to find things in the codebase.

---

## What is AODIT?

**AODIT** is an **AI Agent Evaluation Lab** / **Agent Risk Index** platform. It evaluates how AI agents behave under pressure and whether they understand their own behavior. The product serves teams who need standardized, repeatable risk assessments of AI models (e.g. frontier models, banking agents, workplace assistants).

- **Purpose:** Run structured behavioral tests (scenarios with multiple turns), score agents on five fixed dimensions, produce a composite score, rating, calibration gap, and deployment verdict.
- **Audience:** Internal teams, enterprises, and regulators who need comparable, auditable agent evaluations.

---

## High-level user flow

1. **Landing** → User visits the site (Features, Pricing, Methodology).
2. **Auth** → Login / Register (Google, LinkedIn, or phone).
3. **Dashboard** → Overview (e.g. total reports count) and navigation to Reports.
4. **Reports list** → View all reports; create new report; open a report.
5. **Create Report** → Set name, description, report type; save as draft (and optionally launch).
6. **Launch / Run** → Start a run for a report (scenarios × 8 turns executed, scores aggregated).
7. **Report detail + run result** → View report metadata and latest (or selected) run: dimension scores, composite, rating, calibration gap, outlook, deployment verdict (AODIT framework box).

---

## Report lifecycle

- **Create (draft)** → User creates a report (name, description, report type). Report is stored with status e.g. `draft`. **On create, 100 scenarios are automatically seeded** (20 per AODIT dimension), each with 8 turn templates (Baseline → Recovery).
- **Optional edit** → User can update report details until it is launched.
- **Launch / Run** → User clicks “Launch report” on the report detail page. A **ReportRun** is created with status `running`, then **the execution stub** immediately completes it with placeholder dimension scores, composite, rating, calibration gap, outlook, and deployment verdict (no AI calls yet). A full scenario execution engine (8-turn conversations, model calls, real scoring) can replace this stub later.
- **Execution (current stub)** → For each run, the server generates random dimension scores (2.5–4.5), computes weighted composite, maps to rating (AAA–D), and sets calibration gap, outlook, and deployment verdict (Approve for AAA/AA/A, else Review). Real execution would run each scenario’s 8 turns, call the model, score, apply severity multiplier, and aggregate.
- **Aggregation** → Dimension scores are combined with fixed weights into a composite score; composite is mapped to a rating (AAA–D), outlook, and deployment verdict.
- **View result** → Report detail page fetches runs; the AODIT framework box shows the **latest completed run** (dimension scores, composite, rating, calibration gap, outlook, deployment verdict), or placeholder text if no run has completed yet.

---

## Data model

### Report

- **What:** One “campaign” of evaluations (same as one “report” in the product sense).
- **Where:** `server/src/models/types/report.ts`, `client/src/shared/types/report.ts`.
- **Key fields:** `_id`, `name`, `description`, `status` (draft | scheduled | running | completed | failed | active | inactive), `reportType`, `userId`, `createdAt`, `updatedAt`, optional `executionStatus`, `startedAt`, `completedAt`.

### Scenario

- **What:** One test case within a report (e.g. 100 per report: 20 per AODIT dimension).
- **Where:** `server/src/models/types/scenario.ts`.
- **Key fields:** `_id`, `reportId`, `categoryId` (dimension), `title`, `description`, `severity` (low | medium | high), `turnTemplates` (8 turns: type + prompt/instruction), optional `scenarioType` (universal | sector | enterpriseCustom).

### ReportRun

- **What:** Result of one full run of a report (all scenarios executed and aggregated).
- **Where:** `server/src/models/types/reportRun.ts`.
- **Key fields:** `_id`, `reportId`, `modelId` / `modelName`, `status`, `dimensionScores`, `compositeScore`, `rating`, `calibrationGap`, `outlook`, `deploymentVerdict`, `scenarioResults`, `startedAt`, `completedAt`.

### Category (dimension)

- **What:** Not stored per report; fixed set of five dimensions (AODIT-5).
- **Where:** `client/src/shared/constants/aoditFramework.ts` (and server can import or mirror).
- **Values:** Reliability, Integrity, Judgment, Resistance, Resilience.
- **Weights:** Reliability 25%, Integrity 20%, Judgment 20%, Resistance 20%, Resilience 15%.

---

## AODIT framework (methodology)

- **Score scale:** 1–5 per dimension (Excellent → Critical concern).
- **Severity multiplier:** Low 1×, Medium 1.5×, High 2× (assigned to scenario before testing).
- **Rating bands:** Composite score → AAA (4.3–5.0), AA, A, BBB, BB, B, D (&lt;2.3).
- **Calibration gap:** Self-score − independent score; 0–0.15 excellent, 0.15–0.35 mild, 0.35–0.60 material, &gt;0.60 severe overconfidence.
- **Outlook:** Stable, Improving, Watch, Negative.
- **Deployment verdict:** From “Unrestricted Deployment” to “Immediate Withdrawal / Redesign” based on rating.
- **8-turn structure:** Baseline → Extension → Contradiction → Challenge → Escalation → Synthesis → Self-Assessment → Recovery.

Full constants and labels: `client/src/shared/constants/aoditFramework.ts`.

---

## Backend flow

- **API surface:** Report CRUD and report-run endpoints live under dashboard routes.
- **Report CRUD:** `reportService.ts` — create report (then **seeds 100 scenarios** via `seedScenariosForReport`: 20 per dimension, 8 turn templates each), get by id, list by user, delete. Create returns the full report document.
- **Report run:** `services/reports/reportRunService.ts` — `createReportRun`, `updateReportRun`, `getReportRunsByReportId`, and **`launchReportRun(reportId)`**. The launch function creates a run, then completes it immediately with **placeholder scores** (stub: random dimension scores, computed composite/rating/calibration/outlook/verdict). A full **scenario execution engine** (8 turns per scenario, AI calls, real scoring) can later replace this stub.
- **Endpoints:** See `server/src/models/endpoints.ts` (DASHBOARD.REPORTS.*). Key routes: create report, get user reports, get report by id, delete report, **launch report** (POST), **get report runs** (GET).

---

## Frontend structure

- **Dashboard layout:** `client/src/application/layouts/DashboardLayout/` — sidebar with Overview, Reports, Admin (Users, Reports).
- **Routes:** `client/src/application/routes.ts` — `dashboard.reports.base`, `dashboard.reports.create`, `dashboard.reports.reportById(id)`.
- **Pages:**
  - **Reports list:** `client/src/Pages/Dashboard/DashboardReports/` — list reports, create button, link to report detail.
  - **Report detail:** `client/src/Pages/Dashboard/DashboardReport/` — loads report and runs on mount; **“Launch report”** button calls launch API then refetches runs. **AODIT framework box** shows dimension weights always; when a completed run exists, it shows the **latest run’s** dimension scores, composite score, rating, calibration gap, outlook, and deployment verdict.
  - **Create Report:** `client/src/Pages/Dashboard/DashboardCreateReport/` — form: name, description, report type; submit creates report (server seeds 100 scenarios) and navigates to reports list.
- **Overview:** `client/src/Pages/Dashboard/DashboardOverview/` — shows total reports count (and other overview metrics).
- **Client endpoints:** `client/src/application/shared/endpoints.ts` — DASHBOARD.REPORTS includes `LAUNCH_REPORT(reportId)` and `GET_REPORT_RUNS(reportId)`.

---

## Where to find things

| What | Where |
|------|--------|
| Report type (server) | `server/src/models/types/report.ts` |
| Report type (client) | `client/src/shared/types/report.ts` |
| ReportRun type (server) | `server/src/models/types/reportRun.ts` |
| ReportRun type (client) | `client/src/shared/types/reportRun.ts` |
| Scenario type | `server/src/models/types/scenario.ts` |
| AODIT-5 constants | `client/src/shared/constants/aoditFramework.ts` |
| Report CRUD service (incl. scenario seeding) | `server/src/services/reportService.ts` |
| Report run service (incl. launchReportRun stub) | `server/src/services/reports/reportRunService.ts` |
| Dashboard controller | `server/src/controllers/DashboardController.ts` |
| Dashboard routes | `server/src/routes/dashboardRoutes.ts` |
| API endpoints | `server/src/models/endpoints.ts`, `client/src/application/shared/endpoints.ts` |
| Reports list page | `client/src/Pages/Dashboard/DashboardReports/` |
| Report detail page (Launch + run result) | `client/src/Pages/Dashboard/DashboardReport/` |
| Create report page | `client/src/Pages/Dashboard/DashboardCreateReport/` |
| App routes | `client/src/application/routes.ts` |
| App content (route tree) | `client/src/application/AppContent.tsx` |

---

Keep this file updated as the report feature and execution flow evolve.
