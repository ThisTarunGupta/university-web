"use client";
import Link from "next/link";
import { useContext, useEffect, useReducer, useState } from "react";

import ClassesManager from "../components/classesManager";
import CourseSelector from "../components/courseSelector";
import SubjectSelector from "../components/subjectSelector";
import Switch from "../components/switch";
import AuthContext from "../context/auth";
import StateContext from "../context/state";

const DashboardComponent = ({
  api,
  batchID,
  format,
  name,
  obj,
  stateFormat,
}) => {
  const { user } = useContext(AuthContext);
  const { state, setState } = useContext(StateContext);
  const [add, setAdd] = useState(true);
  const [form, setForm] = useState(false);
  const [formData, setFormData] = useReducer(
    (current, update) => ({
      ...current,
      ...update,
    }),
    stateFormat
  );
  const [importedData, setImportedData] = useState();
  const [message, setMessage] = useState({ data: "", varient: "" });

  const handleDelete = async (id) => {
    const currentObj = state[obj];
    const updatedObj = currentObj.filter((obj) => obj.id !== id);
    setState({ ...state, [obj]: updatedObj });

    const res = await fetch(`${api}?uid=${user.id}&&id=${id}`, {
      method: "DELETE",
    });
    const { error, _ } = await res.json();
    if (error) {
      setState({ ...state, [obj]: currentObj });
      return setMessage({
        data: error,
        varient: "danger",
      });
    }

    return setMessage({ data: `${name} deleted!`, varient: "success" });
  };

  const handleEdit = (id) => {
    const stateObj = state[obj].find((obj) => obj.id === id);
    if (obj === "teachers") delete stateObj.email;

    setAdd(false);
    setFormData(stateObj);
    setForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res;
    if (add) {
      delete formData.id;
      if (obj === "students") formData.batch = batchID;
      res = await fetch(`${api}?uid=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else
      res = await fetch(`${api}?uid=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          obj === "students" ? { data: formData, ref: "details" } : formData
        ),
      });

    const { error, data } = await res.json();
    if (!error || data) {
      let updatedObj = state[obj];
      if (!updatedObj) updatedObj = [];
      if (add) {
        updatedObj.push({
          id: data,
          ...formData,
        });

        setMessage({
          data: `${name} added successfully`,
          varient: "success",
        });
      } else {
        updatedObj.forEach((obj, indx) => {
          if (obj.id === formData.id) updatedObj[indx] = formData;
        });

        setMessage({
          data: `${name} edit successfully`,
          varient: "success",
        });
      }
      setState({ ...state, [obj]: updatedObj });
    } else {
      setMessage({
        data: error,
        varient: "danger",
      });
    }
    setAdd(true);
    setFormData(stateFormat);
    setForm(false);
  };

  const importData = async (files) => {
    if (files.length) {
      const file = files[0];
      let ext = file.name.split(".");
      ext = ext[ext.length - 1];
      if (ext === "xlsx") {
        const data = [];
        const reader = new FileReader();
        const wb = new ExcelJS.Workbook();

        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          const headers = [];
          const workbook = await wb.xlsx.load(reader.result);
          workbook.eachSheet((sheet) => {
            sheet.eachRow((row, indx) => {
              if (indx === 1)
                row.values.forEach((value) => {
                  const newValue = value.trim().toLowerCase();
                  if (newValue === "")
                    return setMessage({
                      data: "Invalid data",
                      varient: "danger",
                    });

                  headers.push(newValue);
                });
              else {
                const student = { batch: batchID };
                row.values.forEach((value, valueIndx) => {
                  const newValue =
                    typeof value === "object"
                      ? value.text.trim().toLowerCase()
                      : typeof value === "string"
                      ? value.trim().toLowerCase()
                      : value;
                  if (newValue === "")
                    return setMessage({
                      data: "Invalid data",
                      varient: "danger",
                    });

                  student[headers[valueIndx - 1]] = newValue;
                });

                data.push(student);
              }
            });
            return;
          });

          let updatedObj = state[obj];
          if (!updatedObj || !updatedObj.length) updatedObj = [];
          data.length &&
            data.forEach(async (x) => {
              delete x.id;
              const res = await fetch(`${api}?uid=${user.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(x),
              });

              const { error, data: id } = await res.json();
              if (id) {
                await updatedObj.push({
                  id,
                  ...x,
                });

                await setState({ [obj]: updatedObj });
              } else
                return setMessage({
                  data: error,
                  varient: "danger",
                });
            });
        };
      } else
        return setMessage({ data: "Invalid file choose", varient: "danger" });
    }
  };

  return (
    <div className="h-100">
      {message.data && (
        <div className={`alert alert-${message.varient}`}>{message.data}</div>
      )}
      {form ? (
        <>
          <span className="d-flex align-items-center justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setAdd(true);
                setForm(false);
                setFormData(stateFormat);
              }}
            >
              Cancel
            </button>
            <h4>
              {add ? "Add" : "Edit"} {name}
            </h4>
          </span>
          <form className="my-5" onSubmit={handleSubmit}>
            {Object.keys(formData).map((key, indx) => {
              if (key === "classes") {
                return (
                  <div key={indx} className="mb-3">
                    <label htmlFor={key} className="form-label">
                      {key.toUpperCase()}
                    </label>
                    <ClassesManager
                      batchData={state["batches"]}
                      subjectsData={state["subjects"]}
                      state={{ formData, setFormData }}
                    />
                  </div>
                );
              } else if (key === "course") {
                return (
                  <div key={indx} className="mb-3">
                    <label htmlFor={key} className="form-label">
                      {key.toUpperCase()}
                    </label>
                    <CourseSelector
                      coursesData={state["courses"]}
                      state={{ formData, setFormData }}
                    />
                  </div>
                );
              } else if (key === "hod" || key === "permanent") {
                return (
                  <div key={indx} className="mb-3">
                    <label htmlFor={key} className="form-label">
                      {key.toUpperCase()}
                    </label>
                    <Switch
                      style={{ float: "right" }}
                      initialState={formData[key]}
                      handleSwitch={(value) => setFormData({ [key]: value })}
                      varient="success"
                    />
                  </div>
                );
              } else if (key === "subjects") {
                let sems = [];
                for (let i = 0; i < formData["duration"] * 2; i++)
                  sems[i] = i + 1;

                return (
                  <div key={indx} className="mb-3">
                    <label htmlFor={key} className="form-label">
                      {key.toUpperCase()}
                    </label>
                    <SubjectSelector
                      sems={sems}
                      state={{ formData, setFormData }}
                      subjectsData={state[key]}
                    />
                  </div>
                );
              } else if (
                (key !== "id" &&
                  key !== "password" &&
                  key !== "email" &&
                  key !== "batch" &&
                  key !== "marks" &&
                  key !== "disabled") ||
                (key === "email" && obj === "teachers" && add) ||
                (key === "email" && obj === "students")
              )
                return (
                  <div key={indx} className="mb-3">
                    <label htmlFor={key} className="form-label">
                      {key.toUpperCase()}
                    </label>
                    <input
                      className="form-control"
                      type={key === "email" ? "email" : "text"}
                      id={key}
                      name={key}
                      value={formData[key]}
                      minLength={key === "phone" && 10}
                      maxLength={key === "phone" && 10}
                      onChange={({ target: { value } }) =>
                        setFormData({ [key]: value })
                      }
                      required
                    />
                  </div>
                );
            })}
            <button type="submit" className="btn btn-primary mt-3">
              {add ? "Add" : "Edit"}
            </button>
          </form>
        </>
      ) : (
        <>
          {state && (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setForm(true);
                    setFormData(stateFormat);
                  }}
                >
                  Add
                </button>
                {obj === "students" && (
                  <>
                    <button
                      className="btn btn-outline-success"
                      onClick={() =>
                        document.querySelector(".file-input").click()
                      }
                    >
                      Import data
                    </button>
                    <input
                      className="file-input"
                      style={{ display: "none" }}
                      type="file"
                      accept=".xlsx"
                      onChange={({ target: { files } }) => importData(files)}
                    />
                  </>
                )}
              </div>
              <table className="table mt-5">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    {Object.keys(format).map((key, indx) => (
                      <th key={indx} scope="col">
                        {key.toUpperCase()}
                      </th>
                    ))}
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state[obj] ? (
                    state[obj].map(
                      (objx, indx) =>
                        !objx.admin && (
                          <tr key={indx}>
                            <th scope="row">{indx + 1}</th>
                            {Object.keys(format).map((key, indx) => {
                              if (key === "course" && state["courses"])
                                return (
                                  <td key={indx}>
                                    {state["courses"] &&
                                      state["courses"].find(
                                        (course) => course.id === objx[key]
                                      ).name}
                                  </td>
                                );
                              else if (key === "teacher")
                                return (
                                  <td key={indx}>
                                    {objx["permanent"]
                                      ? "Permanent"
                                      : "Contractual"}
                                  </td>
                                );

                              return <td key={indx}>{objx[key]}</td>;
                            })}
                            <th>
                              {obj === "batches" && (
                                <Link href={`batches/${objx.id}`}>
                                  <i
                                    className="fa-solid fa-up-right-from-square mx-2 text-primary"
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </Link>
                              )}
                              <i
                                className="fa-solid fa-pen mx-2 text-warning"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleEdit(objx.id)}
                              ></i>
                              <i
                                className="fa-solid fa-trash text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDelete(objx.id)}
                              ></i>
                            </th>
                          </tr>
                        )
                    )
                  ) : (
                    <tr>
                      <td>No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
