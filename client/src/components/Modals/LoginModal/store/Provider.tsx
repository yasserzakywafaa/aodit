import { createContext, useContext } from "react";
import useLoginModalStore, { LoginModalStore } from "./store";

export interface LoginModalContextProps {
  store: LoginModalStore;
}

export interface LoginModalContextProviderProps {
  children: React.ReactNode;
}

const LoginModalContext = createContext<LoginModalContextProps | undefined>(
  undefined
);

export const useLoginModalContext = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error(
      "useLoginModalContext must be used within an LoginModalContextProvider"
    );
  }
  return context;
};

export const LoginModalContextProvider = (
  params: LoginModalContextProviderProps
) => {
  const store = useLoginModalStore();

  return (
    <LoginModalContext.Provider value={{ store }}>
      {params.children}
    </LoginModalContext.Provider>
  );
};
