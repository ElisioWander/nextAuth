import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

  const handleSignIn = async () => {
    const data = {
      email,
      password,
    };
  
    console.log(data)
    await signIn(data);
  }

  const { register, formState: { errors }, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(handleSignIn)} >
      <input
        type="email" 
        value={email}
        {...register('email', {required: true})}
        onChange={e => setEmail(e.target.value)}
      />
      {errors.email?.type === 'required' && (
        <p>E-mail obrigatório</p>
      )}
      <input
        type="password"
        value={password}
        {...register('password', {required: true})}
        onChange={e => setPassword(e.target.value)}
      />
      {errors.password?.type === 'required' && (
        <p>Senha obrigatória</p>
      )}
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGest( async (ctx) => {


  return {
    props: {}
  }
})
