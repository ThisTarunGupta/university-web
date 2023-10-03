"use client";
import { useContext } from "react";

import AuthContext from "../context/auth";
import { redirect } from "next/navigation";

const ClassesPage = () => {
  const { user } = useContext(AuthContext);

  return user && user.classes && user.classes.length ? (
    redirect(`/classes/${user.classes[0].batch}-${user.classes[0].subject}`)
  ) : (
    <div className="container">
      <h1 className="text-center">No classes alloted yet:(</h1>
    </div>
  );
};

export default ClassesPage;
