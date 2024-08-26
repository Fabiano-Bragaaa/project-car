import { Link } from "react-router-dom";
import LogoImg from "../../assets/logo.svg";

import { FiUser, FiLogIn } from "react-icons/fi";

export function Header() {
  const signed = false;
  const loadingAuth = false;
  return (
    <div className="w-full flex items-center justify-center h-16 bg-white  drop-shadow mb-4">
      <header className="flex w-full max-w-7xl justify-between items-center px-4">
        <Link to={"/"}>
          <img src={LogoImg} alt="logo do site" />
        </Link>
        {!loadingAuth && signed && (
          <Link to={"/dashboard"}>
            <div className="rounded-full p-2 border-2 border-gray-900">
              <FiUser size={24} color="#000" />
            </div>
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to={"/login"}>
            <FiLogIn size={24} color="#000" />
          </Link>
        )}
      </header>
    </div>
  );
}
