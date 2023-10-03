"use client";
import { useState } from "react";

const SubjectSelector = ({
  sems,
  state: { formData, setFormData },
  subjectsData,
}) => {
  const [data, setData] = useState({});
  return (
    <>
      {sems &&
        sems.map((sem, indx) => (
          <div key={indx} className="container">
            <label>Sem: {sem}</label>
            {formData["subjects"] &&
              formData["subjects"][sem] &&
              Object.keys(formData["subjects"][sem]).map((semObj, indx) => {
                const subjects = formData["subjects"][sem][semObj];
                return (
                  <div key={indx} className="row align-items-start">
                    <label className="form-label col-2 text-center">
                      {semObj}
                    </label>
                    <select
                      className="form-select col"
                      multiple
                      defaultValue={formData["subjects"][sem][semObj]}
                      onChange={({ target: { selectedOptions } }) => {
                        const values = new Set([]);
                        if (selectedOptions.length)
                          for (let i = 0; i < selectedOptions.length; i++)
                            values.add(selectedOptions.item(i).value);
                        values.size &&
                          setFormData({
                            subjects: {
                              ...formData["subjects"],
                              [sem]: {
                                ...formData["subjects"][sem],
                                [semObj]: Array.from(values),
                              },
                            },
                          });
                      }}
                    >
                      {subjectsData &&
                        subjectsData.map((subject, indx) => (
                          <option key={indx} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                    </select>
                    <div className="col-2">
                      <i
                        className="fa-solid fa-trash text-danger me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          delete formData["subjects"][sem][semObj];

                          setFormData({
                            subjects: {
                              ...formData["subjects"],
                              [sem]: formData["subjects"][sem],
                            },
                          });
                        }}
                      ></i>
                    </div>
                  </div>
                );
              })}
            {data[sem] && (
              <div className="row align-items-start">
                <input
                  className="form-input col-2 text-center"
                  value={data[sem]["name"]}
                  onChange={({ target: { value } }) => {
                    setData({
                      [sem]: {
                        ...[sem],
                        name: value,
                      },
                    });
                  }}
                />
                <select
                  className="form-select col"
                  multiple
                  onChange={({ target: { selectedOptions } }) => {
                    const values = new Set([]);
                    if (selectedOptions.length)
                      for (let i = 0; i < selectedOptions.length; i++)
                        values.add(selectedOptions.item(i).value);
                    values.size &&
                      setData({
                        ...data,
                        [sem]: { ...data[sem], value: Array.from(values) },
                      });
                  }}
                >
                  {subjectsData &&
                    subjectsData.map((subject, indx) => (
                      <option key={indx} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                </select>
                <div className="col-2">
                  <i
                    className="fa-solid fa-check text-success me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        subjects: {
                          ...formData["subjects"],
                          [sem]: {
                            ...formData["subjects"][sem],
                            [data[sem]["name"]]: data[sem]["value"],
                          },
                        },
                      });
                      setData({});
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-trash text-danger me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const newData = data;
                      delete newData[sem];

                      setData({ ...newData });
                    }}
                  ></i>
                </div>
              </div>
            )}
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                setData({ ...data, [sem]: { name: "name", value: [] } });
              }}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        ))}
    </>
  );
};

export default SubjectSelector;
