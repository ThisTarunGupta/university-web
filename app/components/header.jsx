import { useContext } from "react";
import Link from "next/link";

import AuthContext from "../context/auth";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container">
        <a
          className="navbar-brand"
          href={user ? (user.admin ? "/dashboard" : "/classes") : "/login"}
        >
          Department of Computer Science & IT <br />
          Univesrsity of Jammu
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user && (
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  href="/"
                  onClick={() => {
                    localStorage.clear();
                    setUser(null);
                  }}
                >
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
