"use client";
import { useContext, useEffect, useReducer, useState } from "react";
import { redirect } from "next/navigation";

import AuthContext from "../context/auth";
import StateContext from "../context/state";

const ClassesLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [state, setState] = useReducer(
    (current, update) => ({
      ...current,
      ...update,
    }),
    {
      batches: null,
      courses: null,
      exams: null,
      students: null,
      subjects: null,
    }
  );

  useEffect(() => {
    if (
      user &&
      !(
        state["batches"] &&
        state["courses"] &&
        state["exams"] &&
        state["subjects"]
      )
    ) {
      const initState = () => {
        ["batches", "courses", "exams", "subjects"].forEach(async (x) => {
          const res = await fetch(`/api/${x}?uid=${user.id}`);
          setState({ [x]: (await res.json()).data });
        });
      };
      initState();
    }
  }, [user]);

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export default ClassesLayout;
