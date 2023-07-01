"use client";
import { useContext } from "react";

import ClassContext from "./context";
import { redirect } from "next/navigation";

const ClassPage = () => {
  const classes = useContext(ClassContext);

  return classes ? (
    redirect(`/classes/${classes[0].batch.id}/${classes[0].subject.id}`)
  ) : (
    <div className="container">
      <h1 className="text-center">No classes alloted yet:(</h1>
    </div>
  );
};

export default ClassPage;
