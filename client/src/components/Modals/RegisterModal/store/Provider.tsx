import { createContext, useContext } from "react";
import useRegisterModalStore, { RegisterModalStore } from "./store";

export interface RegisterModalContextProps {
  store: RegisterModalStore;
}

export interface RegisterModalContextProviderProps {
  children: React.ReactNode;
}

const RegisterModalContext = createContext<
  RegisterModalContextProps | undefined
>(undefined);

export const useRegisterModalContext = () => {
  const context = useContext(RegisterModalContext);
  if (!context) {
    throw new Error(
      "useRegisterModalContext must be used within an RegisterModalContextProvider"
    );
  }
  return context;
};

export const RegisterModalContextProvider = (
  params: RegisterModalContextProviderProps
) => {
  const store = useRegisterModalStore();

  return (
    <RegisterModalContext.Provider value={{ store }}>
      {params.children}
    </RegisterModalContext.Provider>
  );
};
