import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import Router from "next/router";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

//dados que serão passados para a função signIn
type SignInCredentials = {
  email: string;
  password: string;
};

//dados que serão compartilhados no contexto
type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

//ReactNode é a tipagem que recebe qualquer elemento React
type AuthProviderProps = {
  children: ReactNode;
};

//o contexto em sí
export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  Router.push("/");
}

//o provider que ficará em volta de toda a aplicação, possibilitando assim, o compartilhamento
//das informações
export function AuthProvider({ children }: AuthProviderProps) {
  //gravar os dados do usuário
  const [user, setUser] = useState({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    // pegar todos os cookies com o parseCookies
    // pegar o token de dentro dos cookies
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({
            email,
            permissions,
            roles,
          });
        }).catch(() => {
          signOut()
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });

      const { permissions, roles, token, refreshToken } = response.data;

      //salvando o token e o refreshToken nos cookies
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/", //todas as rotas da aplicação terão acesso a esse token
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      //atualizar os dados do usuário após o logIn
      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");

      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
