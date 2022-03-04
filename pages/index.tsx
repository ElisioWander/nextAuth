import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Input } from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
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

    console.log(data)

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        type={'email'}
        name={email} 
        labelName={'E-mail'} 
        setValue={setEmail} 
      />
      
      <Input 
        type={'password'}
        name={password}
        labelName={'Senha'}
        setValue={setPassword}
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
