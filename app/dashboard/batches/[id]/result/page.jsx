"use client";
import Link from "next/link";
import { useContext, useEffect, useReducer, useState } from "react";

import StateContext from "@/app/context/state";
import ResultDisplay from "@/app/components/resultDisplay";

const initialFormData = {
  exam: null,
  exams: null,
  sem: null,
  sems: null,
  subject: null,
  subjects: null,
};

const ResultPage = ({ params: { id } }) => {
  const { state } = useContext(StateContext);
  const [addCaptions, setAddCaptions] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [showRequestScreen, setShowRequestScreen] = useState(null);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useReducer(
    (current, update) => ({
      ...current,
      ...update,
    }),
    initialFormData
  );
  const [message, setMessage] = useState({ data: null, varient: null });
  const [subjectsList, setSubjectsList] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const courses = state["courses"];
    const exams = state["exams"];
    if (batches && courses && exams && id) {
      const batch = batches.find((batch) => batch.id === id);
      const sems = [];
      for (
        let i = 1;
        i <= courses.find((course) => course.id === batch.course).duration * 2;
        i++
      )
        sems.push(i);

      setFormData({
        exams,
        sems,
      });
    }
  }, [id, state]);

  useEffect(() => {
    if (formData.sem) {
      const batches = state["batches"];
      const courses = state["courses"];
      const subjects = state["subjects"];
      if (batches && courses && subjects) {
        const newSubjects = {};
        const subjectsData = courses.find(
          (course) =>
            course.id === batches.find((batch) => batch.id === id).course
        ).subjects;
        const sems = Object.keys(subjectsData);
        if (formData.sem > 0) {
          sems.forEach((sem) => {
            if (sem === formData.sem) {
              Object.keys(subjectsData[sem]).forEach((varient) => {
                const subject = {};
                subjectsData[sem][varient].forEach(
                  (subjectId) =>
                    (subject[subjectId] = subjects.find(
                      (subject) => subject.id === subjectId
                    ).name)
                );

                newSubjects[varient] = subject;
              });
            }
          });
          Object.keys(newSubjects).length
            ? setFormData({ subjects: newSubjects })
            : setFormData({ subjects: null });
        }
      }
    }
  }, [id, formData.sem, state]);

  const handleDownload = () => {};

  const handleGenerate = () => {
    const batches = state["batches"];
    const courses = state["courses"];
    const students = state["students"];
    const subjects = state["subjects"];
    if (formData.sem < 0) {
      formData.subject = "all";
      formData.exam = "all";
    }

    if (
      batches &&
      formData.sem &&
      formData.exam &&
      formData.subject &&
      students &&
      subjects
    ) {
      const attributes = ["rollno", "name / parentage"];
      const batch = batches.find((batch) => batch.id === id);
      const courseSubjects = courses.find(
        (course) => course.id === batch.course
      ).subjects;
      let data = [];
      if (courseSubjects) {
        const subjectsList = [];

        if (formData.sem < 0) {
          const semsSubjects = {};
          Object.keys(courseSubjects).forEach((sem) => {
            semsSubjects[sem] = [];
            Object.keys(courseSubjects[sem]).forEach((varient) => {
              varient === "core"
                ? semsSubjects[sem].push(...courseSubjects[sem][varient])
                : semsSubjects[sem].push(varient);
              subjectsList.push(...courseSubjects[sem][varient]);
            });
          });

          attributes.push(semsSubjects);
        } else {
          const semSubjects = [];
          if (formData.subject === "all") {
            formData.sem &&
              Object.keys(courseSubjects[formData.sem]).forEach((varient) => {
                varient === "core"
                  ? semSubjects.push(...courseSubjects[formData.sem][varient])
                  : semSubjects.push(varient);
                subjectsList.push(...courseSubjects[formData.sem][varient]);
              });
          } else {
            semSubjects.push(formData.subject);
            subjectsList.push(formData.subject);
          }

          attributes.push(...semSubjects);
        }

        setAttributes(attributes);
        setSubjectsList(subjectsList);
      }

      students.forEach((student) => {
        if (student.marks) {
          const marks = {};

          const populateSubjectsMarks = (subject) => {
            const studentSubjectMarks = student.marks[subject];
            let subjectMarks = [];
            if (studentSubjectMarks) {
              marks[subject] = 0;
              Object.keys(studentSubjectMarks).forEach((exam) => {
                if (["minor1", "minor2", "reminor"].includes(exam))
                  subjectMarks.push(parseInt(studentSubjectMarks[exam]) || 0);
                else marks[subject] += parseInt(studentSubjectMarks[exam]) || 0;
              });

              subjectMarks.sort((a, b) => {
                if (a === null) return 1;
                else if (a > b) return -1;
                else if (a < b) return 1;
              });

              marks[subject] += (subjectMarks[0] || 0) + (subjectMarks[1] || 0);
            }
          };

          const populateSubjectMarks = (studentSubjectMarks) => {
            if (studentSubjectMarks) {
              const subject = formData.subject;
              let subjectMarks = [];
              marks[subject] = 0;
              Object.keys(studentSubjectMarks).forEach((exam) => {
                if (["minor1", "minor2", "reminor"].includes(exam))
                  subjectMarks.push(parseInt(studentSubjectMarks[exam]) || 0);
                else marks[subject] += parseInt(studentSubjectMarks[exam]) || 0;
              });

              subjectMarks.sort((a, b) => {
                if (a === null) return 1;
                else if (a > b) return -1;
                else if (a < b) return 1;
              });

              marks[subject] += (subjectMarks[0] || 0) + (subjectMarks[1] || 0);
            } else marks[formData.subject] = "NA";
          };

          if (formData.sem < 0)
            Object.keys(student.marks).forEach((subject) =>
              populateSubjectsMarks(subject)
            );
          else {
            if (formData.subject === "all" && formData.exam === "all")
              Object.keys(student.marks).forEach((subject) => {
                populateSubjectsMarks(subject);
              });
            else if (formData.subject === "all" && formData.exam !== "all") {
              Object.keys(student.marks).forEach((subject) => {
                marks[subject] = student.marks
                  ? student.marks[subject][formData.exam]
                  : "NA";
              });
            } else if (formData.subject !== "all" && formData.exam === "all")
              populateSubjectMarks(student.marks[formData.subject]);
            else if (formData.subject !== "all" && formData.exam !== "all")
              if (student.marks)
                marks[formData.subject] = student.marks[formData.subject]
                  ? student.marks[formData.subject][formData.exam]
                  : "NA";
          }
          if (Object.keys(marks).length)
            data.push({
              rollno: student.rollno,
              name: student.name,
              parentage: student.parentage,
              ...marks,
            });
          else data = null;
        }
      });

      let subTitle = "";
      if (formData.sem > 0) subTitle += `Semester: ${formData.sem}; `;
      if (formData.subject !== "all")
        subTitle += `Subject: ${
          subjects.find((subject) => formData.subject === subject.id).name
        }; `;
      if (formData.exam !== "all")
        subTitle += `Examination: ${formData.exam.toUpperCase()}; `;

      setData(data);
      setTitle([`${batch.name} Result`, subTitle.trim()]);
    }
  };

  const handleRequest = async (captions) => {
    if (captions) {
      const res = await fetch(`/api/requests/?uid=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch: id,
          sem: formData.sem,
          subject: formData.subject,
          exam: formData.exam,
          user: Object.keys(captions),
          captions,
        }),
      });
    }
  };

  return (
    <div className="h-100">
      {message.data && (
        <div className={`alert alert-${message.varient}`}>{message.data}</div>
      )}
      {showRequestScreen ? (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowRequestScreen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowRequestScreen(false)}
            >
              Create request
            </button>
          </div>
          <h2>Add teachers</h2>
          {captions &&
            Object.keys(captions).map((teacher) => (
              <div key={teacher} className="d-flex align-items-center">
                {state["users"].find((user) => user.id === teacher).name}
                {captions[teacher]}
                <i
                  className="fa-solid fa-trash text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => delete captions[teacher]}
                ></i>
              </div>
            ))}
          <div className="d-flex align-items-center">
            <i
              className="fa-solid fa-trash text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => delete captions[teacher]}
            ></i>
          </div>
        </>
      ) : (
        <>
          <Link href={`/dashboard/batches/${id}`}>
            <button className="btn btn-outline-primary">
              <i className="fa-solid fa-arrow-left me-2"></i>
              Back
            </button>
          </Link>
          <div className="row my-3">
            <div className="col">
              <label htmlFor="sem" className="form-label">
                Semester:
              </label>
              <select
                className="form-select"
                defaultValue={0}
                onChange={({ target: { value } }) => {
                  if (value > 0)
                    setFormData({ sem: value, subject: null, exam: null });
                  else setFormData({ sem: value, subject: "all", exam: "all" });
                }}
              >
                <option value={0} disabled>
                  Select semester
                </option>
                {formData.sems && (
                  <>
                    {formData.sems.map((sem, indx) => (
                      <option key={indx} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            {formData.sem > 0 && (
              <div className="col">
                <label htmlFor="subjects" className="form-label">
                  Subjects:
                </label>
                <select
                  className="form-select"
                  defaultValue={0}
                  onChange={({ target: { value } }) =>
                    setFormData({ subject: value })
                  }
                >
                  <option value={0} disabled>
                    Select subject
                  </option>
                  {formData.subjects && (
                    <>
                      <option value={"all"}>All subjects</option>
                      {Object.keys(formData.subjects).map((varient, indx) => (
                        <optgroup key={indx} label={varient.toUpperCase()}>
                          {Object.keys(formData.subjects[varient]).map(
                            (subjectId, indx) => (
                              <option key={indx} value={subjectId}>
                                {formData.subjects[varient][subjectId]}
                              </option>
                            )
                          )}
                        </optgroup>
                      ))}
                    </>
                  )}
                </select>
              </div>
            )}
            {formData.sem > 0 && (
              <div className="col">
                <label htmlFor="exam" className="form-label">
                  Exams:
                </label>
                <select
                  className="form-select"
                  defaultValue={0}
                  onChange={({ target: { value } }) =>
                    setFormData({ exam: value })
                  }
                >
                  <option value={0} disabled>
                    Select exam
                  </option>
                  {formData.exams && (
                    <>
                      <option value={"all"}>All exams</option>
                      {formData.exams.map((exam, indx) => (
                        <option
                          key={indx}
                          value={exam.name.replace(" ", "").toLowerCase()}
                        >
                          {exam.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
          <div className="d-flex my-3">
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={!(formData.sem && formData.exam && formData.subject)}
            >
              Generate
            </button>
            {data && (
              <>
                <button
                  className="btn btn-outline-warning ms-3"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </>
            )}
          </div>
          {attributes && data && subjectsList && title && (
            <ResultDisplay
              attributes={attributes}
              batch={id}
              data={data}
              sem={formData.sem}
              subject={formData.subject}
              subjectsList={subjectsList}
              title={title}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ResultPage;
