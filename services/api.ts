import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { parseCookies, setCookie } from "nookies";

interface FailedRequestsQueue {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}

let cookies = parseCookies();

let isRefreshing = false;
let failedRequestsQueue = Array<FailedRequestsQueue>();

export const api = axios.create({
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
        cookies = parseCookies();

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
              setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
              });

              //atualizar o refreshToken dentro dos cookies
              setCookie(
                undefined,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30,
                  path: "/",
                }
              );

              //enviar o token no cabeçalho da requisição
              api.defaults.headers.common["Authorization"] = `Bearer ${cookies["nextauth.token"]}`;

              //percorrendo a lista de requisições que deu erro e enviando o token para a função onSuccess
              failedRequestsQueue.forEach(request => request.onSuccess(token))
              failedRequestsQueue = []

            }).catch(err => {
              failedRequestsQueue.forEach(request => request.onFailure(err))
              failedRequestsQueue = []
            }).finally(() => {
              isRefreshing = false
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

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            },
          });
        });
      } else {
        //deslogar o usuário
      }
    }
  }
);
