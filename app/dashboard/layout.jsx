"use client";
import { Suspense, useContext, useEffect, useReducer } from "react";
import { redirect } from "next/navigation";

import Sidebar from "../components/sidebar";
import AuthContext from "../context/auth";
import StateContext from "../context/state";
import LoadingPage from "../loading";

const menu = [
  {
    id: "subjects",
    name: "Subjects",
  },
  {
    id: "courses",
    name: "Courses",
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
    id: "naac",
    name: "NAAC Feedback",
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
          <div className="col h-100">
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
          </div>
        </div>
      </div>
    </StateContext.Provider>
  );
};

export default DashboardLayout;
