import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

//verificar se o usuário está autenticado para redirecionar ele para os locais certos ou impedir
//que ele tenha acesso a rotas que apenas usuários não autenticados poderiam acessar

//conceito de Hight Order Function // Procurar mais informações
export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    
    try {
      return await fn(ctx);
    } catch (err) {
      destroyCookie(ctx, 'nextauth.token')
      destroyCookie(ctx, 'nextauth.refreshToken')

      if(err instanceof AuthTokenError) {
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  };
}
