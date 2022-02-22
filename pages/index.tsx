import { parseCookies } from "nookies";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { GetServerSideProps } from "next";

import Router from 'next/router'
import { withSSRGest } from "../utils/withSSRGest";

export default function Home() {
  //fazer essa verificação no lado do client vai resultar em uma rápida renderização
  //do component que não deviria aparecer, caso ouvesse um token registrado nos cookies
  //se for feita pelo lado do servidor utilizando getServerSideProps essa renderização indesejada
  //não irá ocorrer
  // useEffect(() => {
  //   const { 'nextauth.token': token } = parseCookies()

  //   if(token) {
  //     Router.push('/dashboard')
  //   }
  // }, [])


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGest( async (ctx) => {


  return {
    props: {}
  }
})
