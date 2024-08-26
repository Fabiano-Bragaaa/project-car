import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Container({ children }: Props) {
  return <div className="w-full max-w-7xl mx mx-auto px 4"> {children} </div>;
}
