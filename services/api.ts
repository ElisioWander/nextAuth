import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

interface FailedRequestsQueue {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}

type context = undefined | GetServerSidePropsContext

let isRefreshing = false;
let failedRequestsQueue = Array<FailedRequestsQueue>();

export function setupAPIClient(ctx: context = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  // enviando o token para o cabeçalho
  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${cookies["nextauth.token"]}`;

  //interceptors: responsável por interceptar uma requisição ou uma resposta
  //.use: vai dizer se deu algum erro ou não

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response.data?.code === "token.expired") {
          //renovar o token

          //buscar novamente os cookies atualizados
          cookies = parseCookies(ctx);

          const { "nextauth.refreshToken": refreshToken } = cookies;

          //possui todas as informações das requisições que deram erro
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post("/refresh", {
                refreshToken,
              })
              .then((response) => {
                //pegar o novo token de dentro da resposta do servidor
                const { token } = response.data;

                //atualizar o token dentro dos cookies
                setCookie(ctx, "nextauth.token", token, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: "/",
                });

                //atualizar o refreshToken dentro dos cookies
                setCookie(
                  ctx,
                  "nextauth.refreshToken",
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                  }
                );

                //enviar o token no cabeçalho da requisição
                api.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${cookies["nextauth.token"]}`;

                //percorrendo a lista de requisições que deu erro e enviando o token para a função onSuccess
                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestsQueue = [];
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) =>
                  request.onFailure(err)
                );
                failedRequestsQueue = [];

                //se o processo de signOut for ocorrer do lado
                //do cliente, então, execute a função signOut
                if (process.browser) {
                  //se falhar eu quero que o usuário seja deslogado
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          //criar uma fila de requisições
          //esperar que o token seja renovado para então chamar novamente as requisições
          //que falharam
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                if (!originalConfig?.headers) {
                  (error: AxiosError) => {
                    console.log(error);
                  };

                  return;
                }

                originalConfig.headers["Authorization"] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          //a função signOut será executada apenas se estiver do lado do cliente
          //por isso a utilização da variável de ambiênte process.browser
          if (process.browser) {
            //se falhar eu quero que o usuário seja deslogado
            signOut();
          } else {
            return Promise.reject(new AuthTokenError())
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
