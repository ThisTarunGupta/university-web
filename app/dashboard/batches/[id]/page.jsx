"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import StateContext from "@/app/context/state";

const BatchPage = ({ params: { id } }) => {
  const { state } = useContext(StateContext);
  const [name, setName] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const courses = state["courses"];
    if (batches && courses) {
      const batch = batches.find((batch) => batch.id === id);
      const course = courses.find((course) => course.id === batch.course);
      const sems = [];
      for (let i = 1; i <= course.duration * 2; i++) sems.push(i);

      setName({
        batch: batch.name,
        course: course.name,
        sems,
      });
    }
  }, [id, state]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <Link href={`/dashboard/batches`}>
          <button className="btn btn-outline-primary">
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back
          </button>
        </Link>
        <div>
          <Link href={`${id}/result`}>
            <button className="btn btn-primary me-3">
              <i className="fa-solid fa-square-poll-vertical me-2"></i>
              Result
            </button>
          </Link>
          <Link href={`${id}/students`}>
            <button className="btn btn-outline-success">
              <i className="fa-solid fa-children me-2"></i>
              Manage students
            </button>
          </Link>
        </div>
      </div>
      {name && (
        <>
          <div className="d-flex align-items-center justify-content-between my-3">
            <span>
              <span className="fw-bold">Batch:</span> {name["batch"]}
            </span>
            <span>
              <span className="fw-bold">Course:</span> {name["course"]}
            </span>
          </div>
          <div
            className="row row-cols-1 row-cols-md-4 g-4 my-3"
            style={{ height: "50vh" }}
          >
            {name["sems"].map((sem) => (
              <div key={sem} className="col">
                <Link href={`${id}/${sem}`} style={{ textDecoration: "none" }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded text-bg-primary h-100"
                    style={{ cursor: "pointer" }}
                  >
                    <h4>Sem {sem}</h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default BatchPage;
