import { auth } from "@services/index";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full flex items-center h-10 bg-red-500 text-white font-medium gap-4 px-4 mb-4 rounded-lg">
      <Link to={"/dashboard"}>Dashboard</Link>
      <Link to={"/dashboard/new"}>Novo carro</Link>

      <button className="ml-auto" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
