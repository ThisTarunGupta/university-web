"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import StateContext from "@/app/context/state";

const ReapearPage = ({ params: { id } }) => {
  const { state } = useContext(StateContext);
  const [data, setData] = useState(null);
  const [mapToSubject, setMapToSubject] = useState(null);

  useEffect(() => {
    const data = [];
    const exams = state["exams"];
    const mapToSubject = {};
    const students = state["students"];
    const subjects = state["subjects"];
    exams &&
      students &&
      subjects &&
      students.forEach(({ id, rollno, name, marks }) => {
        if (typeof marks === "object" && Object.keys(marks).length) {
          const reappear = [];
          const reappearIn = [];
          const subjectsKey = Object.keys(marks);
          if (subjectsKey.length) {
            subjectsKey.forEach((subjectKey) => {
              const examsData = Object.keys(marks[subjectKey]);
              if (examsData) {
                if (
                  examsData.find((examData) =>
                    ["internal", "external"].includes(examData)
                  ) &&
                  (parseInt(marks[subjectKey].internal) || 0) +
                    (parseInt(marks[subjectKey].external) || 0) <
                    0.7 * exams.practical
                ) {
                  reappearIn.push("all");
                  reappear.push(subjectKey);
                } else if (
                  examsData.find((examData) =>
                    ["minor1", "minor2", "reminor", "major"].includes(examData)
                  )
                ) {
                  const majorMarks =
                    parseInt(marks[subjectKey] && marks[subjectKey].major) || 0;
                  const minorMarks = [
                    parseInt(marks[subjectKey] && marks[subjectKey].minor1) ||
                      0,
                    parseInt(marks[subjectKey] && marks[subjectKey].minor2) ||
                      0,
                    parseInt(marks[subjectKey] && marks[subjectKey].reminor) ||
                      0,
                  ];

                  minorMarks.sort((a, b) => {
                    if (a === null) return 1;
                    else if (a < b) return 1;
                    else if (a > b) return -1;
                  });

                  if (minorMarks[0] + minorMarks[1] < 0.7 * exams.minor) {
                    reappearIn.push("all");
                    reappear.push(subjectKey);
                  } else if (majorMarks < 0.35 * exams.major) {
                    reappearIn.push("major");
                    reappear.push(subjectKey);
                  }
                } else if (
                  examsData.includes("examination") &&
                  marks[subjectKey].examination <
                    0.35 *
                      exams[
                        subjects.find((subject) => subject.id === subjectKey)
                          .slug
                      ]
                ) {
                  reappearIn.push("all");
                  reappear.push(subjectKey);
                }
              } else
                data.push({
                  id,
                  rollno,
                  name,
                  reappear: null,
                  reappearIn: null,
                });
            });
          } else
            data.push({ id, rollno, name, reappear: null, reappearIn: null });

          if (reappear.length) {
            reappear.forEach((subjectId) => {
              const name = subjects.find(
                (subject) => subject.id === subjectId
              ).name;
              mapToSubject[subjectId] = name || "Untitled";
            });
            data.push({ id, rollno, name, reappear, reappearIn });
          }
        }
      });

    console.log(data);
    setData(data);
    setMapToSubject(mapToSubject);
  }, [state]);

  return (
    <>
      <Link href={`/dashboard/batches/${id}`}>
        <button className="btn btn-outline-primary">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Back
        </button>
      </Link>
      <table className="table m-5 text-justify">
        <thead className="table-dark">
          <tr>
            <td>ROLLNO</td>
            <td>NAME</td>
            <td>REAPPEAR</td>
          </tr>
        </thead>
        <tbody>
          {data &&
            mapToSubject &&
            data.map(({ rollno, name, reappear }, indx) => (
              <tr key={indx}>
                <td>{rollno}</td>
                <td>{name}</td>
                <td>
                  {reappear &&
                    reappear.map((name) => (
                      <p key={name}>{mapToSubject[name]}; </p>
                    ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default ReapearPage;
