"use client";
import { useContext, useEffect } from "react";

import StateContext from "@/app/context/state";

const BatchLayout = ({ children, params: { id } }) => {
  const { state, setState } = useContext(StateContext);

  useEffect(() => {
    const initStudents = async () => {
      const res = await fetch(`/api/students?batch=${id}`);
      const { data } = await res.json();
      if (data) setState({ students: data });
    };
    initStudents();

    return () => setState({ students: null });
  }, [id]);

  return <>{children} </>;
};

export default BatchLayout;
