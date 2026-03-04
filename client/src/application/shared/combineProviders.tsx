import { FC, PropsWithChildren } from "react";

type Provider = FC<PropsWithChildren<{}>>;

const combineProviders = (providers: Provider[]): FC => {
  return providers.reduce<FC<PropsWithChildren<{}>>>(
    (Combined, Provider) =>
      ({ children }) =>
        (
          <Combined>
            <Provider>{children}</Provider>
          </Combined>
        ),
    ({ children }) => <>{children}</>
  );
};

export default combineProviders;
