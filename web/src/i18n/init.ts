import { createAppI18n } from "@yasserzakywafaa/client-core/web/i18n";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enPage from "./locales/en/page.json";
import enReport from "./locales/en/report.json";
import enAgent from "./locales/en/agent.json";
import enCompliance from "./locales/en/compliance.json";
import enDemo from "./locales/en/demo.json";
import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arDashboard from "./locales/ar/dashboard.json";
import arPage from "./locales/ar/page.json";
import arReport from "./locales/ar/report.json";
import arAgent from "./locales/ar/agent.json";
import arCompliance from "./locales/ar/compliance.json";
import arDemo from "./locales/ar/demo.json";
import deCommon from "./locales/de/common.json";
import deAuth from "./locales/de/auth.json";
import deDashboard from "./locales/de/dashboard.json";
import dePage from "./locales/de/page.json";
import deReport from "./locales/de/report.json";
import deAgent from "./locales/de/agent.json";
import deCompliance from "./locales/de/compliance.json";
import deDemo from "./locales/de/demo.json";
import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frDashboard from "./locales/fr/dashboard.json";
import frPage from "./locales/fr/page.json";
import frReport from "./locales/fr/report.json";
import frAgent from "./locales/fr/agent.json";
import frCompliance from "./locales/fr/compliance.json";
import frDemo from "./locales/fr/demo.json";

const i18n = createAppI18n({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      dashboard: enDashboard,
      page: enPage,
      report: enReport,
      agent: enAgent,
      compliance: enCompliance,
      demo: enDemo,
    },
    ar: {
      common: arCommon,
      auth: arAuth,
      dashboard: arDashboard,
      page: arPage,
      report: arReport,
      agent: arAgent,
      compliance: arCompliance,
      demo: arDemo,
    },
    de: {
      common: deCommon,
      auth: deAuth,
      dashboard: deDashboard,
      page: dePage,
      report: deReport,
      agent: deAgent,
      compliance: deCompliance,
      demo: deDemo,
    },
    fr: {
      common: frCommon,
      auth: frAuth,
      dashboard: frDashboard,
      page: frPage,
      report: frReport,
      agent: frAgent,
      compliance: frCompliance,
      demo: frDemo,
    },
  },
  namespaces: [
    "common",
    "auth",
    "dashboard",
    "page",
    "report",
    "agent",
    "compliance",
    "demo",
  ],
});

export default i18n;
