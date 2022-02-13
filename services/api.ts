import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

// enviando o token para o cabeçalho
api.defaults.headers.common['Authorization'] = `Bearer ${cookies['nextauth.token']}`

//interceptors: responsável por interceptar uma requisição ou uma resposta
//.use: vai dizer se deu algum erro ou não

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  if(error.response?.status === 401) {
    if(error.response.data?.code === 'token.expired') {
      //renovar o token

      //buscar novamente os cookies atualizados
      cookies = parseCookies()

      const { 'nextauth.refreshToken': refreshToken } = cookies

      api.post("/refresh", {
        refreshToken
      }).then(response => {
        //pegar o novo token de dentro da resposta do servidor
        const { token } = response.data

        //atualizar o token dentro dos cookies
        setCookie(undefined, 'nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/'
        })

        //atualizar o refreshToken dentro dos cookies
        setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/'
        })

        api.defaults.headers.common['Authorization'] = `Bearer ${cookies['nextauth.token']}`
      })
    } else {
      //deslogar o usuário
    }
  }
})

