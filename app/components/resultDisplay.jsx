"use client";
import { useContext, useEffect, useState } from "react";

import StateContext from "../context/state";

const ResultDisplay = ({
  attributes,
  batch,
  data,
  sem,
  subject,
  subjectsList,
  title,
}) => {
  const { state } = useContext(StateContext);
  const [courseSubjects, setCourseSubjects] = useState(null);
  const [mapToSubjectCode, setMapToSubjectCode] = useState(null);

  useEffect(() => {
    const batches = state["batches"];
    const courses = state["courses"];
    const subjects = state["subjects"];
    if (batches && courses) {
      const batchCourse = batches.find(
        (batchObj) => batchObj.id === batch
      ).course;
      const courseSubjects = courses.find(
        (course) => course.id === batchCourse
      ).subjects;

      courseSubjects
        ? setCourseSubjects(courseSubjects)
        : setCourseSubjects(null);
    }

    if (subjects) {
      const mapToSubjectCode = {};
      if (subject === "all") {
        subjects.forEach((subjectObj) => {
          if (subjectsList.includes(subjectObj.id))
            mapToSubjectCode[subjectObj.id] = {
              name: subjectObj.name,
              code: subjectObj.subjectId,
            };
        });
      } else {
        const subjectObj = subjects.find(
          (subjectObj) => subjectObj.id === subject
        );
        if (subjectObj)
          mapToSubjectCode[subject] = {
            name: subjectObj.name,
            code: subjectObj.subjectId,
          };
      }
      setMapToSubjectCode(mapToSubjectCode);
    }
  }, [batch, state, subject, subjectsList]);

  return (
    <>
      <span className="text-center">
        <h1>{title[0]}</h1>
        <p>{title[1]}</p>
      </span>
      <table className="table my-5 text-center">
        <thead className="table-dark">
          <tr>
            {attributes &&
              mapToSubjectCode &&
              attributes.map((attribute) => {
                if (attribute === "rollno" || attribute === "name / parentage")
                  return (
                    <td key={attribute} rowSpan={sem == -1 ? 2 : 1}>
                      {attribute.toUpperCase()}
                    </td>
                  );
                else if (sem == -1 && typeof attribute === "object")
                  return Object.keys(attribute).map((sem) => (
                    <td key={sem} colSpan={attribute[sem].length || 1}>
                      {sem}
                    </td>
                  ));
                else if (typeof attribute === "string")
                  return (
                    <td key={attribute}>
                      {mapToSubjectCode[attribute]
                        ? mapToSubjectCode[attribute].code.toUpperCase()
                        : attribute.toUpperCase()}
                    </td>
                  );
              })}
          </tr>
          {sem == -1 && attributes && mapToSubjectCode && (
            <tr>
              {attributes.map((attribute) => {
                if (typeof attribute === "object")
                  return Object.keys(attribute).map((sem) =>
                    attribute[sem].map((subjectId) => (
                      <td key={subjectId}>
                        {mapToSubjectCode[subjectId]
                          ? mapToSubjectCode[subjectId].code.toUpperCase()
                          : subjectId.toUpperCase()}
                      </td>
                    ))
                  );
              })}
            </tr>
          )}
        </thead>
        <tbody>
          {attributes &&
            courseSubjects &&
            data &&
            sem &&
            data.map((student, indx) => {
              const studentAttributes = Object.keys(student);
              return (
                <tr key={indx}>
                  {attributes.map((attribute) => {
                    if (attribute === "name / parentage")
                      return (
                        <td key={attribute}>
                          {student.name}
                          <br />
                          {student.parentage}
                        </td>
                      );
                    else if (sem == -1 && typeof attribute === "object")
                      Object.keys(attribute).map((sem) =>
                        attribute[sem].map((subjectId) => {
                          if (studentAttributes.includes(subjectId))
                            return (
                              <td key={subjectId}>{student[subjectId]}</td>
                            );
                          else {
                            if (
                              courseSubjects[sem] &&
                              courseSubjects[sem][subjectId]
                            ) {
                              const varientSubjects =
                                courseSubjects[sem][subjectId];
                              if (varientSubjects.length === 1)
                                return (
                                  <td key={subjectId}>
                                    {student[varientSubjects[0]] || "NA"}
                                  </td>
                                );
                              else if (varientSubjects.length > 1) {
                                const commonSubject = studentAttributes.find(
                                  (studentAttribute) =>
                                    varientSubjects.includes(studentAttribute)
                                );
                                return (
                                  <td key={subjectId}>
                                    {commonSubject
                                      ? student[commonSubject]
                                      : "NA"}
                                  </td>
                                );
                              } else return <td key={subjectId}>NA</td>;
                            } else return <td key={subjectId}>NA</td>;
                          }
                        })
                      );
                    else if (typeof attribute === "string")
                      return (
                        <td key={attribute}>{student[attribute] || "NA"}</td>
                      );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default ResultDisplay;
