import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//verificar se o usuário está autenticado para redirecionar ele para os locais certos ou impedir
//que ele tenha acesso a rotas que apenas usuários não autenticados poderiam acessar

//conceito de Hight Order Function // Procurar mais informações
export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return await fn(ctx)
  };
}
