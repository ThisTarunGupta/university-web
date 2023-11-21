"use client";
import Link from "next/link";
import { useContext, useEffect, useReducer, useState } from "react";

import ResultDisplay from "@/app/components/resultDisplay";
import StateContext from "@/app/context/state";

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
  const [attributes, setAttributes] = useState(null);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useReducer(
    (current, update) => ({
      ...current,
      ...update,
    }),
    initialFormData
  );
  const [subjectsList, setSubjectsList] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const courses = state["courses"];
    if (batches && courses && id) {
      const batch = batches.find((batch) => batch.id === id);
      const sems = [];
      for (
        let i = 1;
        i <= courses.find((course) => course.id === batch.course).duration * 2;
        i++
      )
        sems.push(i);

      setFormData({
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

  useEffect(() => {
    const exams = state["exams"];
    const subjects = state["subjects"];
    if (formData.sem && formData.subject && exams && subjects) {
      if (formData.subject === "all")
        setFormData({
          exams: [
            "minor1",
            "minor2",
            "reminor",
            "major",
            "internal",
            "external",
            "examination",
          ],
        });
      else {
        const slug = subjects.find(
          (subject) => subject.id === formData.subject
        ).slug;
        if (slug)
          slug === "practical"
            ? setFormData({ exams: ["internal", "external"] })
            : exams[slug]
            ? setFormData({ exams: ["examination"] })
            : setFormData({ exams: ["minor1", "minor2", "reminor"] });
      }
    }
  }, [formData.sem, formData.subject, state]);

  const handleDownload = () => {};

  const handleGenerate = () => {
    const batches = state["batches"];
    const courses = state["courses"];
    const students = state["students"];
    const subjects = state["subjects"];
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

        if (formData.sem > 0) {
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
                if (["internal", "external"].includes(exam))
                  marks[subject] += parseFloat(studentSubjectMarks[exam]) || 0;
                else if (["minor1", "minor2", "reminor"].includes(exam))
                  subjectMarks.push(parseFloat(studentSubjectMarks[exam]) || 0);
                else
                  marks[subject] += parseFloat(studentSubjectMarks[exam]) || 0;
              });

              if (subjectMarks.length) {
                subjectMarks.sort((a, b) => {
                  if (a === null) return 1;
                  else if (a > b) return -1;
                  else if (a < b) return 1;
                });

                marks[subject] +=
                  (subjectMarks[0] || 0) + (subjectMarks[1] || 0);
              }
            }
          };

          const populateSubjectMarks = (studentSubjectMarks) => {
            if (studentSubjectMarks) {
              const subject = formData.subject;
              let subjectMarks = [];
              marks[subject] = 0;
              Object.keys(studentSubjectMarks).forEach((exam) => {
                if (["internal", "external"].includes(exam))
                  marks[subject] += parseFloat(studentSubjectMarks[exam]) || 0;
                else if (["minor1", "minor2", "reminor"].includes(exam))
                  subjectMarks.push(parseFloat(studentSubjectMarks[exam]) || 0);
                else
                  marks[subject] += parseFloat(studentSubjectMarks[exam]) || 0;
              });

              if (subjectMarks.length) {
                subjectMarks.sort((a, b) => {
                  if (a === null) return 1;
                  else if (a > b) return -1;
                  else if (a < b) return 1;
                });

                marks[subject] +=
                  (subjectMarks[0] || 0) + (subjectMarks[1] || 0);
              }
            } else marks[formData.subject] = "NA";
          };

          if (formData.sem > 0) {
            if (formData.subject === "all" && formData.exam === "all")
              Object.keys(student.marks).forEach((subject) =>
                populateSubjectsMarks(subject)
              );
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

  return (
    <div className="h-100">
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
                <option value={"all"}>All exams</option>
                {formData.exams && (
                  <>
                    {formData.exams.map((exam, indx) => (
                      <option key={indx} value={exam}>
                        {exam.toUpperCase()}
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
    </div>
  );
};

export default ResultPage;
