"use client";
import { useContext, useEffect, useState } from "react";

import StateContext from "@/app/context/state";
import Sidebar from "@/app/components/sidebar";
import AuthContext from "@/app/context/auth";

const ClassLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { state } = useContext(StateContext);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const subjects = state["subjects"];
    if (user && user.classes && user.classes.length && batches && subjects) {
      const menu = user.classes.map((classObj) => {
        const batch = batches.find((batch) => batch.id === classObj["batch"]);
        const subject = subjects.find(
          (subject) => subject.id === classObj["subject"]
        );

        return {
          id: `${batch.id}-${subject.id}`,
          name: `${batch.slug.toUpperCase()}/${subject.slug.toUpperCase()}`,
        };
      });

      menu && menu.length && setMenu(menu);
    }
  }, [state, user]);

  return (
    <div className="container py-5" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-2">
          <Sidebar menu={menu} baseURL="/classes" />
        </div>
        <div className="col">{children}</div>
      </div>
    </div>
  );
};

export default ClassLayout;
