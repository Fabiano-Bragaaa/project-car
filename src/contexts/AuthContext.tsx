import { auth } from "@services/index";
import { onAuthStateChanged, User } from "firebase/auth";
import { ReactNode, createContext, useState, useEffect } from "react";
import { set } from "react-hook-form";

type Props = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

type UserProps = {
  uid: string;
  name: string | null;
  email: string | null;
};

export const AuthContext = createContext({} as Props);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        //tem usuario logado
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user.email,
        });
        setLoadingAuth(false);
      } else {
        //não tem usuario logado
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  function handleInfoUser({ email, name, uid }: UserProps) {
    setUser({ name, email, uid });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, loadingAuth, handleInfoUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
