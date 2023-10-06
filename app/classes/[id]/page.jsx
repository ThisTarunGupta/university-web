"use client";
import { useContext, useEffect, useState } from "react";

import StateContext from "@/app/context/state";
import Link from "next/link";
import AuthContext from "@/app/context/auth";

const ClassPage = ({ params: { id } }) => {
  const slug = id.split("-");
  const { user } = useContext(AuthContext);
  const { state, setState } = useContext(StateContext);
  const [exams, setExams] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (user) {
      const initStudents = async () => {
        const res = await fetch(
          `/api/students?uid=${user.id}&&batch=${slug[0]}`,
          {
            cache: "no-cache",
          }
        );
        setState({ students: (await res.json()).data });
      };
      !state["students"] && initStudents();
    }

    return () => setState({ students: null });
  }, [slug, user]);

  useEffect(() => {
    const batches = state["batches"];
    const examsData = state["exams"];
    const subjects = state["subjects"];
    if (batches && slug && subjects && !name)
      setName({
        batch: batches.find((batch) => batch.id === slug[0]).name,
        subject: subjects.find((subject) => subject.id === slug[1]).name,
      });

    if (!exams && subjects) {
      const subjectSlug = subjects.find(
        (subject) => subject.id === slug[1]
      ).slug;
      ["practical", "project"].includes(subjectSlug)
        ? setExams(Object.keys(examsData.practical))
        : setExams(Object.keys(examsData.core));
    }
  }, [slug, state]);

  return (
    <>
      {name && (
        <div className="d-flex align-items-center justify-content-between">
          <span>
            <span className="fw-bold">Batch:</span> {name["batch"]}
          </span>
          <span>
            <span className="fw-bold">Subject:</span> {name["subject"]}
          </span>
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-4 g-4 my-5 h-100">
        {exams &&
          exams.map((exam, indx) => (
            <div key={indx} className="col">
              <Link href={id + "/" + exam} style={{ textDecoration: "none" }}>
                <div
                  className="d-flex align-items-center justify-content-center rounded text-bg-primary h-100"
                  style={{ cursor: "pointer" }}
                >
                  <h4>{exam.toUpperCase()}</h4>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};

export default ClassPage;
