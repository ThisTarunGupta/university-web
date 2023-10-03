"use client";
import { useContext, useEffect } from "react";

import StateContext from "@/app/context/state";

const BatchLayout = ({ children, params: { id } }) => {
  const { state, setState } = useContext(StateContext);

  useEffect(() => {
    const initExams = async () => {
      const res = await fetch("/api/exams", {
        cache: "no-cache",
      });
      const { _, data } = await res.json();
      if (data) setState({ exams: data });
    };

    const initStudents = async () => {
      const res = await fetch(`/api/students?batch=${id}`);
      const { _, data } = await res.json();
      if (data) setState({ students: data });
    };
    initStudents();
    !state["exams"] && initExams();

    return () => setState({ students: null });
  }, []);

  return <>{children} </>;
};

export default BatchLayout;
