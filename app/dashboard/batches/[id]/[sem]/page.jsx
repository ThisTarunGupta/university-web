"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import StateContext from "@/app/context/state";
import AuthContext from "@/app/context/auth";

const SemPage = ({ params: { id, sem } }) => {
  const { user } = useContext(AuthContext);
  const { state, setState } = useContext(StateContext);
  const [attributes, setAttributes] = useState(null);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState({ data: null, varient: null });
  const [subject, setSubject] = useState(null);
  const [subjects, setSubjects] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const courses = state["courses"];
    const subjectsObj = state["subjects"];

    if (id && sem && batches && courses && subjectsObj && !subjects) {
      let newSubjects = {};
      const courseId = batches.find((batch) => batch.id === id).course;
      let oldSubjects = courses.find((course) => course.id === courseId)
        .subjects[sem];
      const keys = Object.keys(oldSubjects);
      if (keys.length) {
        keys.forEach((key) => {
          const keySubjects = oldSubjects[key];
          const updatedKeySubjects = [];
          if (keySubjects.length) {
            keySubjects.forEach((keySubject) => {
              const keySubjectName = subjectsObj.find(
                (subject) => subject.id === keySubject
              ).name;
              if (keySubjectName)
                updatedKeySubjects.push({
                  id: keySubject,
                  name: keySubjectName,
                });
            });
          }
          newSubjects[key] = updatedKeySubjects;
        });
      }
      setSubjects(newSubjects);
    }
  }, [id, sem, state]);

  useEffect(() => {
    const attributes = ["rollno", "name"];
    const exams = state["exams"];
    const subjects = state["subjects"];
    if (exams && subject && subjects) {
      const slug = subjects.find(
        (subjectObj) => subjectObj.id === subject
      ).slug;
      if (slug)
        slug === "practical"
          ? attributes.push(...["internal", "external"])
          : exams[slug]
          ? attributes.push("Examination")
          : attributes.push(...["minor1", "minor2", "reminor", "major"]);

      setAttributes(attributes);
    }
  }, [state, subject]);

  const handleEdit = async () => {
    const studentIds = Object.keys(data);
    if (studentIds.length) {
      const res = await fetch(`/api/students?uid=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, ref: subject, merge: 1 }),
      });
      const { error } = await res.json();
      if (error) {
        setData(null);
        return setMessage({ data: error, varient: "danger" });
      } else {
        const students = state["students"];
        if (students) {
          students.forEach((student) => {
            if (studentIds.includes(student.id))
              if (!student.marks) {
                student.marks = {};
                student.marks[subject] = {
                  ...data[student.id],
                };
              } else
                student.marks[subject] = {
                  ...student.marks[subject],
                  ...data[student.id],
                };
          });

          setData(null);
          setState({ students });
          setMessage({ data: "Data updated successfully", varient: "success" });
        }
      }
    }
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
        <button
          className="btn btn-primary me-3"
          onClick={handleEdit}
          disabled={data ? false : true}
        >
          Edit
        </button>
      </div>
      {message.data && (
        <div className={`alert alert-${message.varient} my-3 text-center`}>
          {message.data}
        </div>
      )}
      {subjects && (
        <select
          className="form-select my-5"
          defaultValue={0}
          onChange={({ target: { value } }) => {
            setMessage({ data: null, varient: null });
            setSubject(value);
          }}
        >
          <option value={0} disabled>
            Select subject
          </option>
          {Object.keys(subjects).map((group, indx) => (
            <optgroup key={indx} label={group.toUpperCase()}>
              {subjects[group] &&
                subjects[group].length &&
                subjects[group].map((subject, indx) => (
                  <option key={indx} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      )}
      {attributes && state["exams"] && state["students"] && subject && (
        <table className="table my-5 text-justify">
          <thead>
            <tr className="table-dark">
              {attributes.map((attribute, indx) => (
                <th key={indx} scope="col">
                  {attribute.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state["students"].map((student, indx) => (
              <tr key={indx}>
                {attributes.map((attribute, indx) => (
                  <td key={indx}>
                    {["rollno", "name"].includes(attribute) ? (
                      student[attribute]
                    ) : (
                      <input
                        className="form-input"
                        style={{ width: "100%" }}
                        value={
                          (data &&
                            data[student.id] &&
                            data[student.id][attribute]) ||
                          (student.marks &&
                            student.marks[subject] &&
                            student.marks[subject][attribute]) ||
                          0
                        }
                        onChange={({ target: { value } }) => {
                          const maxMarks = ["internal", "external"].includes(
                            attribute
                          )
                            ? state["exams"].practical[attribute]
                            : state["exams"].core[attribute];
                          console.log(maxMarks);
                          if (value >= 0 && value <= maxMarks) {
                            setData({
                              ...(data || {}),
                              [student.id]: {
                                ...((student.marks && student.marks[subject]) ||
                                  {}),
                                ...((data && data[student.id]) || {}),
                                [attribute]: parseInt(value),
                              },
                            });
                          }
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default SemPage;
