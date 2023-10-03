"use client";
import { useContext } from "react";
import { redirect } from "next/navigation";

import AuthContext from "./context/auth";

const RootPage = () => {
  const { user } = useContext(AuthContext);

  return user
    ? user.admin
      ? redirect("/dashboard")
      : redirect("/classes")
    : redirect("/login");
};

export default RootPage;
