import { ReactNode, useContext } from "react";

import { AuthContext } from "@contexts/AuthContext";

import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export function Private({ children }: Props): any {
  const { loadingAuth, signed } = useContext(AuthContext);

  if (loadingAuth) {
    return <div></div>;
  }

  if (!signed) {
    return <Navigate to={"/login"} />;
  }

  return children;
}
