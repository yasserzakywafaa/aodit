import "../assets/scss/fonts.scss";
import "../assets/scss/default.scss";

import { FC, Suspense, useEffect } from "react";

import AppContent from "./AppContent";
import AppContextProviders from "./AppContextProviders";
import LoaderSpinner from "../components/shared/Loader/LoaderSpinner";
import { LoaderVariantEnum } from "src/shared/types/types";

const App: FC = () => {
  useEffect(() => {
    // Delay gives React.lazy() chunks time to resolve through Suspense before
    // Puppeteer takes the pre-render snapshot.
    const timer = setTimeout(
      () => document.dispatchEvent(new Event("render-complete")),
      500,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContextProviders>
      <Suspense fallback={<LoaderSpinner variant={LoaderVariantEnum.Dots} />}>
        <AppContent />
      </Suspense>
    </AppContextProviders>
  );
};

export default App;
