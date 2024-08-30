import logoImg from "@assets/logo.svg";
import { Container } from "@components/container";
import { Input } from "@components/input";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Ring } from "@uiball/loaders";

import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@services/index";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@contexts/AuthContext";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().nonempty("O campo é obrigatório!"),
  email: z
    .string()
    .email("insira um Email válido")
    .nonempty("O campo email é obrigatório."),
  password: z
    .string()
    .min(6, " senha deve ter pelo menos 6 caracteres.")
    .nonempty("O campo senha é obrigatório."),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const { handleInfoUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit({ email, password, name }: FormData) {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: name,
        });

        handleInfoUser({ email, name, uid: user.user.uid });
        setLoading(false);
        toast.success("cadastrado com sucesso!");
        navigation("/", { replace: true });
      })
      .catch((error) => {
        console.log("Erro ao cadastrar usuario.", error);
        setLoading(false);
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
              type="text"
              placeholder="Digite o seu nome completo"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
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
            {loading ? (
              <div className="flex items-center justify-center">
                <Ring size={22} color="#fff" lineWeight={4} speed={2} />
              </div>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <Link to={"/login"}>Já possuio uma conta? Faça um login</Link>
      </div>
    </Container>
  );
}
