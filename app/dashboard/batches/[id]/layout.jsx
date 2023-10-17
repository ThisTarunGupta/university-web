"use client";
import { useContext, useEffect } from "react";

import AuthContext from "@/app/context/auth";
import StateContext from "@/app/context/state";

const BatchLayout = ({ children, params: { id } }) => {
  const { user } = useContext(AuthContext);
  const { setState } = useContext(StateContext);

  useEffect(() => {
    const initStudents = async () => {
      const res = await fetch(`/api/students?uid=${user.id}&&batch=${id}`);
      const { data } = await res.json();
      if (data) setState({ students: data });
    };
    initStudents();

    return () => setState({ students: null });
  }, [id]);

  return <>{children} </>;
};

export default BatchLayout;
