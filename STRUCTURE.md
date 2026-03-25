# Project Folder Structure

    aodit
    │── client
    │   ├── build/
    │   ├── node_modules/
    │   ├── public/
    │   │   ├── icons/
    │   │   ├── sitemaps/
    │   │   ├── app.webmanifest.json
    │   │   ├── generate-nonce.js
    │   │   ├── index.html
    │   │   ├── robots.txt
    │   │   ├── serviceworker.js
    │   │   └── sw-register.js
    │   ├── src/
    │   │   ├── application/
    │   │   │   ├── layouts/
    │   │   │   │   └── DashboardLayout/
    │   │   │   ├── shared/
    │   │   │   │   └── endpoints.ts
    │   │   │   ├── store/
    │   │   │   ├── App.scss
    │   │   │   ├── App.test.ts
    │   │   │   ├── App.tsx
    │   │   │   ├── AppContent.tsx
    │   │   │   ├── AppContextProviders.ts
    │   │   │   ├── declaration.d.ts
    │   │   │   └── routes.ts
    │   │   ├── Pages/
    │   │   │   ├── Contact/
    │   │   │   │   ├── features/
    │   │   │   │   ├── store/
    │   │   │   │   ├── Contact.scss
    │   │   │   │   └── Contact.tsx
    │   │   │   ├── Dashboard/
    │   │   │   │   ├── Admin/
    │   │   │   │   │   ├── DashboardAdminUser/
    │   │   │   │   │   │   ├── features/
    │   │   │   │   │   │   ├── store/
    │   │   │   │   │   │   └── DashboardAdminUser.tsx
    │   │   │   │   │   └── DashboardAdminUsers/
    │   │   │   │   │       ├── features/
    │   │   │   │   │       ├── store/
    │   │   │   │   │       └── DashboardAdminUsers.tsx
    │   │   │   │   ├── DashboardCreateReport/
    │   │   │   │   │   ├── store/
    │   │   │   │   │   └── DashboardCreateReport.tsx
    │   │   │   │   ├── DashboardOverview/
    │   │   │   │   │   ├── store/
    │   │   │   │   │   └── DashboardOverview.tsx
    │   │   │   │   ├── DashboardProfile/
    │   │   │   │   │   ├── features/
    │   │   │   │   │   ├── store/
    │   │   │   │   │   ├── DashboardProfile.scss
    │   │   │   │   │   └── DashboardProfile.tsx
    │   │   │   │   ├── DashboardReport/
    │   │   │   │   │   ├── features/
    │   │   │   │   │   │   ├── DimensionWeightsSection.tsx
    │   │   │   │   │   │   ├── ModelsToEvaluateSection.tsx
    │   │   │   │   │   │   ├── ModelsToTestSection.tsx
    │   │   │   │   │   │   ├── ScenarioTurnsSection.tsx
    │   │   │   │   │   │   ├── ScenariosPerDimensionSection.tsx
    │   │   │   │   │   │   ├── index.ts
    │   │   │   │   │   │   └── weightSum.ts
    │   │   │   │   │   ├── store/
    │   │   │   │   │   └── DashboardReport.tsx
    │   │   │   │   ├── DashboardReportRun/
    │   │   │   │   │   └── DashboardReportRun.tsx        ← Live Feed page (pure monitoring, polls /run-status)
    │   │   │   │   └── DashboardReports/
    │   │   │   │       ├── features/
    │   │   │   │       ├── store/
    │   │   │   │       └── DashboardReports.tsx
    │   │   │   ├── Features/
    │   │   │   │   ├── features/
    │   │   │   │   ├── FeaturesPage.scss
    │   │   │   │   └── FeaturesPage.tsx
    │   │   │   ├── Login.tsx
    │   │   │   ├── NotFound/
    │   │   │   ├── PaymentStatus/
    │   │   │   └── Pricing/
    │   │   ├── components/
    │   │   │   ├── features/
    │   │   │   └── shared/
    │   │   ├── shared/
    │   │   │   ├── constants/
    │   │   │   │   ├── aoditFramework.ts                 ← AODIT-5 dimension/rating constants
    │   │   │   │   └── scenarioTurns.ts
    │   │   │   ├── hooks/
    │   │   │   ├── mockedData/
    │   │   │   ├── types/
    │   │   │   │   ├── integrations.ts
    │   │   │   │   ├── payment.ts
    │   │   │   │   ├── report.ts                         ← Report type (client)
    │   │   │   │   ├── reportRun.ts                      ← ReportRun + FeedItem types (client)
    │   │   │   │   ├── types.ts
    │   │   │   │   └── user.ts
    │   │   │   ├── utils/
    │   │   │   │   ├── schemaOrg/
    │   │   │   │   └── ...
    │   │   │   ├── countries.ts
    │   │   │   └── languages.ts
    │   │   ├── assets/
    │   │   ├── custom.d.ts
    │   │   └── index.tsx
    │   ├── .env
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── yarn.lock
    │── docs/
    │   ├── .astro/
    │   ├── node_modules/
    │   ├── public/
    │   ├── src/
    │   ├── .gitignore
    │   ├── astro.config.mjs
    │   ├── openapi.json
    │   ├── package.json
    │   ├── README.md
    │   ├── tsconfig.json
    │   └── yarn.lock
    │── server
    │   ├── node_modules/
    │   ├── src/
    │   │   ├── controllers/
    │   │   │   ├── AuthController.ts
    │   │   │   ├── ContactController.ts
    │   │   │   ├── DashboardController.ts                ← Report + run + status handlers
    │   │   │   ├── LeadMagnetController.ts
    │   │   │   ├── OpenAIController.ts
    │   │   │   ├── PaymentsController.ts
    │   │   │   ├── ScheduleController.ts
    │   │   │   └── TestController.ts
    │   │   ├── middleware/
    │   │   │   ├── apiAuthMiddleware.ts
    │   │   │   └── authMiddleware.ts
    │   │   ├── models/
    │   │   │   ├── mongoDb/
    │   │   │   │   ├── crudOperations.ts
    │   │   │   │   └── index.ts                          ← DB collections enum + indexes
    │   │   │   ├── types/
    │   │   │   │   ├── api.ts
    │   │   │   │   ├── baseData.ts
    │   │   │   │   ├── database.ts
    │   │   │   │   ├── express.d.ts
    │   │   │   │   ├── googleAnalystics.ts
    │   │   │   │   ├── index.ts
    │   │   │   │   ├── integrations.ts
    │   │   │   │   ├── report.ts                         ← Report type (server)
    │   │   │   │   ├── reportRun.ts                      ← ReportRun + FeedItem types (server)
    │   │   │   │   ├── scenario.ts                       ← Scenario type
    │   │   │   │   ├── scenarioResult.ts                 ← ScenarioResult + TurnResult types
    │   │   │   │   └── user.ts
    │   │   │   └── endpoints.ts                          ← All API endpoint paths
    │   │   ├── routes/
    │   │   │   ├── authRoutes.ts
    │   │   │   ├── contactRoutes.ts
    │   │   │   ├── dashboardRoutes.ts                    ← Report + run + status routes
    │   │   │   ├── index.ts
    │   │   │   ├── leadMagnetRoutes.ts
    │   │   │   ├── openaiRoutes.ts
    │   │   │   ├── paymentsRoutes.ts
    │   │   │   ├── paymentsWebhooksRoutes.ts
    │   │   │   ├── scheduleRoutes.ts
    │   │   │   └── testRoutes.ts
    │   │   ├── services/
    │   │   │   ├── agenda/
    │   │   │   │   ├── jobs/
    │   │   │   │   └── agendaService.ts
    │   │   │   ├── amazonS3/
    │   │   │   ├── contact/
    │   │   │   ├── email/
    │   │   │   │   ├── templates/
    │   │   │   │   │   └── partials/
    │   │   │   │   ├── utils/
    │   │   │   │   ├── emailTemplateService.ts
    │   │   │   │   ├── leadMagnetService.ts
    │   │   │   │   ├── registrationEmailService.ts
    │   │   │   │   └── types.ts
    │   │   │   ├── reports/                              ← aodit execution engine
    │   │   │   │   ├── executionEngine.ts                ← Orchestrator: scenarios × turns × models
    │   │   │   │   ├── modelRegistry.ts                  ← Model name → OpenRouter ID mapping
    │   │   │   │   ├── prompts.ts                        ← Prompt templates (generation, escalation, scoring)
    │   │   │   │   ├── reportRunService.ts               ← ReportRun CRUD + launch + polling
    │   │   │   │   └── scoring.ts                        ← Aggregation, rating, calibration, verdict
    │   │   │   ├── webhooks/
    │   │   │   ├── dashboardService.ts
    │   │   │   ├── googleService.ts
    │   │   │   ├── passportService.ts
    │   │   │   ├── PhoneOtpService.ts
    │   │   │   ├── reportService.ts                      ← Report CRUD + scenario seeding
    │   │   │   └── tokenService.ts
    │   │   ├── strategies/
    │   │   │   ├── googleStrategy.ts
    │   │   │   └── linkedinStrategy.ts
    │   │   ├── types/
    │   │   │   └── token.ts
    │   │   ├── utils/
    │   │   │   ├── cryptoUtils.ts
    │   │   │   ├── fetchData.ts
    │   │   │   ├── fileSystem.ts
    │   │   │   ├── generateApiKey.ts
    │   │   │   ├── getUserType.ts
    │   │   │   ├── isError.ts
    │   │   │   ├── languages.ts
    │   │   │   ├── openRouterClient.ts                   ← OpenRouter API client
    │   │   │   ├── stringUtils.ts
    │   │   │   └── webUrlFetcher.ts
    │   │   ├── config.ts
    │   │   ├── cors-config.ts
    │   │   └── server.ts
    │   ├── .env
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── yarn.lock
    ├── .gitignore
    ├── PROJECT.md
    ├── STRUCTURE.md
    ├── README.md
    └── yarn.lock
