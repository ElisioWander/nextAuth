import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

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
  const [user, setUser] = useState<User>()

  const isAuthenticated = false

  async function signIn({email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { permissions, roles } = response.data

      setUser({
        email,
        permissions,
        roles,
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