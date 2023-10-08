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
          `/api/students?uid=${user.id}&&batch=${slug[0]}&&subject=${slug[1]}`,
          {
            cache: "no-cache",
          }
        );
        setState({ students: (await res.json()).data });
      };
      !state["students"] && initStudents();
    }
  }, [slug, user]);

  useEffect(() => {
    const batches = state["batches"];
    const examsData = state["exams"];
    const subject =
      state["subjects"] &&
      state["subjects"].find((subject) => subject.id === slug[1]);

    if (batches && !exams && slug && subject && !name)
      setName({
        batch: batches.find((batch) => batch.id === slug[0]).name,
        subject: subject.name,
      });

    if (!exams && examsData && !name && subject)
      subject.slug === "practical"
        ? setExams(["internal", "external"])
        : examsData[subject.slug]
        ? setExams(["Examination"])
        : setExams(["minor1", "minor2", "reminor", "major"]);
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
      <div
        className="row row-cols-1 row-cols-md-4 g-4 my-5"
        style={{ height: "50vh" }}
      >
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
