"use client";
import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";

import AuthContext from "../context/auth";
import Sidebar from "../components/sidebar";
import ClassContext from "./context";

const ClassesLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    if (user) {
      const initClasses = async () => {
        const res = await fetch("/api/classes", {
          method: "POST",
          cache: "force-cache",
          headers: {
            "Content-Type": "appliaction/json",
          },
          body: JSON.stringify({ classes: user.classes }),
        });

        const { error, data } = await res.json();
        if (error) redirect("/");

        setClasses(data);
      };
      initClasses();
    } else redirect("/");
  }, [user]);

  return (
    <ClassContext.Provider value={classes}>{children}</ClassContext.Provider>
  );
};

export default ClassesLayout;
