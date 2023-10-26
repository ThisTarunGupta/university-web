"use client";
import { useContext, useEffect, useState } from "react";

import Switch from "@/app/components/switch";

const attributes = [
  "Roll No",
  "Name",
  "Aims & objectives of the programme are well defined and stand communicated",
  "The programme has a blend of theory & concepts as well as applied/latest information & knowledge",
  "The programme provides knowledge & skills for employability/entrepreneurship",
  "The programme builds and enhances knowledge and interest in the area",
  "The infrastructural facilities/ equipments are adequate & appropriate to the requirement of the programme",
  "Teaching inputs are relevant & appropriate for the programme",
  "The books/reference material are available & adequate for the programme",
  "The department has adequate and well maintained infrastructure facilities for teaching-learning (Classrooms/ theatre halls/labs etc)",
  "The classrooms are equipped with the necessary ICT facilities",
  "The Department has back-up facility during power shut downs",
  "Availability of clean drinking water facility in the Department",
  "The washrooms are well maintained & cleaned",
  "The students have access to internet and photocopying facility in the Department",
  "The department has facilities for the differently-abled",
  "The library has physical facilities like adequate seating space, adequate ventilation (Air Cooler/fans), and proper illumination",
  "Adequate number of books/copies of books available",
  "Latest editions of text books, reference books, journals are available in the library",
  "The library staff is helpful and cordial",
  "Induction/orientation programmes are held at the beginning of the semester",
  "Teaching plans of courses are circulated at the beginning of the semester",
  "The attendance and notifications with respect to examinations are displayed timely on the notice boards",
  "Grievances /problems, if any are redressed well in time at departmental level",
  "Availability of suggestion boxes & mechanism for obtaining feedback is prevalent in the department",
  "There is interaction with experts/resource persons from other Universities",
  "There is interaction with experts from the Industry/any other field other than Higher Education Institution",
  "Activities other than academics (cultural, sports etc) are actively held for the students",
  "Academic activities like seminars, conferences, publishing magazines etc. organized regularly",
  "Outreach/ community development programmes are held for the students",
  "The Department provides campus placement opportunities",
  "There is a strong Alumni network/Association of the Department",
];

const NAACPage = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        Active
        <Switch initialState={true} varient="primary" />
      </div>
      <div className="d-flex align-items-center justify-content-start mt-3">
        <button className="btn btn-primary me-3">Download Excel</button>
        <button className="btn btn-success">Download PDF</button>
      </div>
      <div className="table-responsive">
        <table className="table my-5">
          <thead className="table-dark">
            <tr>
              <td scope="col">#</td>
              {attributes &&
                attributes.map((attribute) => (
                  <td key={attribute} scope="col">
                    {attribute}
                  </td>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Amit</td>
              {attributes &&
                attributes.map((attribute) => <td key={attribute}>5</td>)}
            </tr>
            <tr>
              <td>2</td>
              <td>Sumit</td>
              {attributes &&
                attributes.map((attribute) => <td key={attribute}>3</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default NAACPage;
