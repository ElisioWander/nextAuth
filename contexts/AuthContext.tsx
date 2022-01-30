import { createContext, ReactNode } from "react";

type SignInCredentials = {
  email: string;
  password: string;
}

//informações do usuário que devem ser salvas
type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean; //informação se o usuário está ou não autenticado
}

type AuthProviderProps = {
  children: ReactNode;
}

//criando um contexto
export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false

  async function signIn({email, password}: SignInCredentials) {
    console.log({email, password})
  }

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  )
}