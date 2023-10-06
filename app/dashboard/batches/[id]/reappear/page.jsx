"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import StateContext from "@/app/context/state";
import AuthContext from "@/app/context/auth";

const ReapearPage = ({ params: { id } }) => {
  const { user } = useContext(AuthContext);
  const { state } = useContext(StateContext);
  const [data, setData] = useState(null);
  const [mapToSubject, setMapToSubject] = useState(null);
  const [message, setMessage] = useState({ data: null, varient: null });

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
        if (marks) {
          const reappear = [];
          const subjectsKey = Object.keys(marks);
          if (subjectsKey.length) {
            subjectsKey.forEach((subjectKey) => {
              const examsData = Object.keys(marks[subjectKey]);
              if (examsData) {
                if (
                  examsData.filter((examData) =>
                    ["internal", "external"].includes(examData)
                  )
                )
                  (parseInt(marks[subjectKey].internal) || 0) +
                    (parseInt(marks[subjectKey].external) || 0) <
                    0.7 * exams.practical.internal && reappear.push(subjectKey);
                else if (
                  examsData.filter((examData) =>
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
                    else if (a < b) return -1;
                    else if (a > b) return 1;
                  });

                  if (
                    minorMarks[0] + minorMarks[1] < 0.7 * exams.core.minor1 ||
                    majorMarks < 0.35 * exams.core.major
                  )
                    reappear.push(subjectKey);
                } else {
                }
              } else data.push({ id, rollno, name, minor: "all" });
            });
          } else data.push({ id, rollno, name, minor: "all" });

          reappear.forEach((subjectId) => {
            const name = subjects.find(
              (subject) => subject.id === subjectId
            ).name;
            mapToSubject[subjectId] = name || "Untitled";
          });
          data.push({ id, rollno, name, reappear });
        }
      });

    setData(data);
    setMapToSubject(mapToSubject);
  }, [state]);

  const handleReappear = () => {
    let flag = 0;
    data &&
      data.forEach(async ({ id, reappear }) => {
        const res = await fetch(`/api/students?uid=${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, reappear }),
        });
        const { error } = await res.json();
        if (error) return (flag = 1);
      });

    flag
      ? setMessage({
          data: "Error in adding student/s to reappear",
          varient: "danger",
        })
      : setMessage({
          data: "Student/s added to reappear successfully",
          varient: "success",
        });
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <Link href={`/dashboard/batches/${id}`}>
          <button className="btn btn-outline-primary">
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back
          </button>
        </Link>
        <button className="btn btn-primary" onClick={handleReappear}>
          Set to reappear
        </button>
      </div>
      {message.data && (
        <div className={`alert alert-${message.varient} my-3 text-center`}>
          {message.data}
        </div>
      )}
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