import logoImg from "@assets/logo.svg";
import { Container } from "@components/container";
import { Input } from "@components/input";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@services/index";
import { useEffect } from "react";

const schema = z.object({
  email: z
    .string()
    .email("insira um Email válido")
    .nonempty("O campo email é obrigatório."),
  password: z.string().nonempty("O campo senha é obrigatório."),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit({ email, password }: FormData) {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("logado com sucesso");
        console.log(user.user);

        navigation("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log("erro ao logar", error);
      });
  }

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to={"/"} className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="logo do site" className="w-full" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite o seu Email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Acessar
          </button>
        </form>
        <Link to={"/register"} className="text-center">
          Ainda não possue uma conta? Cadastre-se
        </Link>
      </div>
    </Container>
  );
}
