import { createContext, ReactNode } from "react";
import { api } from "../services/api";

//dados que serão passados para a função signIn
type SignInCredentials = {
  email: string;
  password: string;
}

//dados que serão compartilhados no contexto
type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean;
}

//ReactNode é a tipagem que recebe qualquer elemento React
type AuthProviderProps = {
  children: ReactNode;
}

//o contexto em sí
export const AuthContext = createContext({} as AuthContextData)

//o provider que ficará em volta de toda a aplicação, possibilitando assim, o compartilhamento
//das informações
export function AuthProvider({children}: AuthProviderProps) {
  const isAuthenticated = false

  async function signIn({email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })
  
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}