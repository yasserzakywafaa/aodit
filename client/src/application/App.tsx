import "../assets/scss/fonts.scss";
import "../assets/scss/default.scss";

import { FC, Suspense, useEffect } from "react";

import AppContent from "./AppContent";
import AppContextProviders from "./AppContextProviders";
import LoaderSpinner from "../components/shared/Loader/LoaderSpinner";
import { LoaderVariantEnum } from "src/shared/types/types";

const App: FC = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
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
