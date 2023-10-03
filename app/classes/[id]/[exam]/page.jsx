"use client";
import { Suspense, useContext, useEffect, useReducer, useState } from "react";
import Link from "next/link";

import Switch from "@/app/components/switch";
import AuthContext from "@/app/context/auth";
import StateContext from "@/app/context/state";
import LoadingPage from "@/app/loading";

const ExamPage = ({ params: { id, exam } }) => {
  const slug = id.split("-");
  const { state, setState } = useContext(StateContext);
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const exams = state["exams"];
    const subjects = state["subjects"];
    const students = state["students"];
    if (batches && exams && slug && subjects && !name)
      setName({
        batch: batches.find((batch) => batch.id === slug[0]).name,
        subject: subjects.find((subject) => subject.id === slug[1]).name,
        exam,
        maxMarks: exams.find(
          (obj) => obj.name.replace(" ", "").toLowerCase() === exam
        )["marks"],
      });

    if (students && exams && name) {
      if (["major", "reminor"].includes(exam)) {
        const minorMaxMarks = exams.find(
          (obj) => obj.name.replace(" ", "").toLowerCase() === "minor1"
        )["marks"];
        const newData = students.filter((student) => {
          const marks = student["marks"][slug[1]];
          if (marks) {
            const minor1 = marks["minor1"];
            const minor2 = marks["minor2"];
            const reminor = marks["reminor"];

            const temp = [minor1, minor2, reminor];
            temp.sort((a, b) => {
              if (a === null) return 1;
              else if (a > b) return -1;
              else if (a < b) return 1;
            });

            if (exam === "major")
              return temp[0] !== null &&
                temp[1] !== null &&
                temp[0] + temp[1] >= minorMaxMarks * 0.7
                ? true
                : false;
            else if (exam === "reminor")
              return minor1 === null ||
                minor2 === null ||
                minor1 + minor2 < minorMaxMarks * 0.7
                ? true
                : false;
          }
        });

        setData(newData);
      } else setData(students);
    }
  }, [name, state]);

  useEffect(() => {
    if (data && !edit) {
      let formData = {};
      data.forEach((student) => {
        if (
          student["marks"][slug[1]] &&
          student["marks"][slug[1]][exam] === null
        )
          formData[student.id] = null;
      });

      if (Object.keys(formData).length >= data.length) formData = {};
      setFormData(formData);
    }
  }, [data, edit]);

  const handleSubmit = async () => {
    const keys = Object.keys(formData);
    const currentStudents = state["students"];
    const updatedStudents = currentStudents;
    updatedStudents.forEach((student) => {
      if (keys.includes(student.id)) {
        if (formData[student.id] > name["maxMarks"]) return;
        if (!student["marks"][slug[1]]) student["marks"][slug[1]] = {};
        student["marks"][slug[1]][exam] = formData[student.id];
      }
    });
    setState({ students: updatedStudents });

    const res = await fetch(`/api/students?uid=${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formData, exam, ref: slug[1] }),
    });
    const { error } = await res.json();
    if (error) setState({ students: currentStudents });

    setEdit(false);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        {edit ? (
          <button
            className="btn btn-outline-primary"
            onClick={() => setEdit(false)}
          >
            Cancel
          </button>
        ) : (
          <Link href={`/classes/${id}`}>
            <button className="btn btn-outline-primary">
              <i className="fa-solid fa-arrow-left me-2"></i>
              Back
            </button>
          </Link>
        )}
        {name && name["timestamp"] && (
          <span>
            <span className="fw-bold">Last time update:</span>
            {Date(name["timestamp"][0])}
          </span>
        )}
        <button
          className="btn btn-primary"
          onClick={edit ? handleSubmit : () => setEdit(true)}
        >
          {edit ? "Submit" : "Edit"}
        </button>
      </div>
      {name && (
        <div className="d-flex align-items-center justify-content-between my-5">
          <span>
            <span className="fw-bold">Batch:</span> {name["batch"]}
          </span>
          <span>
            <span className="fw-bold">Subject:</span> {name["subject"]}
          </span>
          <span>
            <span className="fw-bold">Exam:</span> {name["exam"]}
          </span>
          <span>
            <span className="fw-bold">Maximum marks: </span>
            {name["maxMarks"]}
          </span>
        </div>
      )}
      <table className="table">
        <thead>
          <tr className="table-dark">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Marks</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((student, indx) => {
              const marks =
                student["marks"][slug[1]] && student["marks"][slug[1]][exam];
              return (
                <tr key={student.id}>
                  <th scope="row">{indx + 1}</th>
                  <td>{student.name}</td>
                  <td>
                    {edit ? (
                      <div className="d-flex align-items-center justify-content-start">
                        <input
                          className="form-input"
                          value={
                            formData[student.id] === null ||
                            formData[student.id] === undefined
                              ? marks || 0
                              : formData[student.id]
                          }
                          onChange={({ target: { value } }) =>
                            setFormData({
                              ...formData,
                              [student.id]: parseInt(
                                (value >= 0 && value <= 20 && value) || 0
                              ),
                            })
                          }
                          disabled={
                            formData[student.id] === null ? true : false
                          }
                        />
                        <span className="ms-5">
                          Absent
                          <Switch
                            initialState={
                              formData[student.id] === null ? true : false
                            }
                            varient="danger"
                            handleSwitch={(value) =>
                              setFormData({
                                ...formData,
                                [student.id]: value ? null : 0,
                              })
                            }
                          />
                        </span>
                      </div>
                    ) : marks === null ? (
                      "NA"
                    ) : (
                      marks
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ExamPage;
