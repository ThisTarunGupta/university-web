"use client";
import { Suspense, useContext, useEffect, useReducer } from "react";
import AuthContext from "../context/auth";
import { redirect } from "next/navigation";
import Sidebar from "../components/sidebar";
import StateContext from "../context/state";

const menu = [
  {
    id: "courses",
    name: "Courses",
  },
  {
    id: "subjects",
    name: "Subjects",
  },
  {
    id: "batches",
    name: "Batches",
  },
  {
    id: "teachers",
    name: "Teachers",
  },
  {
    id: "requests",
    name: "Requests",
  },
];

const DashboardLayout = ({ children }) => {
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
      subjects: null,
      teachers: null,
    }
  );

  useEffect(() => {
    if (user && user.admin) {
      const initState = async () => {
        Object.keys(state).forEach(async (x) => {
          const res = await fetch(`/api/${x}?uid=${user.id}`, {
            cache: "no-cache",
          });
          setState({ [x]: (await res.json()).data });
        });
      };

      initState();
    } else redirect("/");
  }, [user]);

  return (
    <StateContext.Provider value={{ state, setState }}>
      <div className="container py-5" style={{ minHeight: "100vh" }}>
        <div className="row">
          <div className="col-2">
            <Sidebar menu={menu} baseURL="/dashboard" />
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="col h-100">{children}</div>
          </Suspense>
        </div>
      </div>
    </StateContext.Provider>
  );
};

export default DashboardLayout;
