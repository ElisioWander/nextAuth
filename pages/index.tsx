import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGest } from "../utils/withSSRGest";
import { yupResolver }from '@hookform/resolvers/yup'
import * as yup from 'yup'

type SignInData = {
  email: string;
  password: string;
}

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

  const handleSignIn: SubmitHandler<SignInData> = async () => {
    const data = {
      email,
      password,
    };
  
    console.log(data)
    await signIn(data);
  }

  const schema = yup.object({
    email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
    password: yup.string().required('Senha obrigatória')
  })

  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(handleSignIn)} >
      <label htmlFor="email">E-mail</label>
      <input
        type="email" 
        value={email}
        {...register('email', {required: true})}
        onChange={e => setEmail(e.target.value)}
      />
      {errors && (
        <p>{errors.email?.message}</p>
      )}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        value={password}
        {...register('password', {required: true})}
        onChange={e => setPassword(e.target.value)}
      />
      { errors && (
        <p>{errors.password?.message}</p>
      ) }

      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGest( async (ctx) => {


  return {
    props: {}
  }
})
