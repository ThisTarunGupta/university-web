"use client";
import { useContext, useState } from "react";
import { redirect } from "next/navigation";

import AuthContext from "../context/auth";

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    const { error, data } = await res.json();
    if (error) return setError(error);

    setError(null);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    redirect("/");
  };

  return user ? (
    redirect("/")
  ) : (
    <form className="container py-5" onSubmit={handleSubmit}>
      <h1 className="text-center">Examination Login</h1>
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rememberMe" className="form-check-label ">
          Remember me
        </label>
        <input
          type="checkbox"
          className="form-check-input mx-2"
          id="rememberMe"
          name="rememberMe"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default LoginPage;
