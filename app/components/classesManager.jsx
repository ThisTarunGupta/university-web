import { useState } from "react";

const ClassesManager = ({
  batchData,
  subjectsData,
  state: { formData, setFormData },
}) => {
  const [data, setData] = useState(null);
  return (
    <>
      {formData["classes"].length &&
        formData["classes"].map((classObj, indx) => (
          <div key={indx} className="row align-items-center mb-2 mx-2">
            <label className="form-label col">
              {batchData.find((batch) => batch.id === classObj["batch"]).name}
            </label>
            <label className="form-label col">
              {
                subjectsData.find(
                  (subject) => subject.id === classObj["subject"]
                ).name
              }
            </label>
            <div className="col">
              <i
                className="fa-solid fa-trash text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const data = formData["classes"];
                  data.splice(indx, 1);

                  setFormData({ classes: data });
                }}
              ></i>
            </div>
          </div>
        ))}
      {data && (
        <div className="row align-items-center mb-2 mx-2">
          <select
            className="form-select col"
            onChange={({ target: { value } }) =>
              setData({ ...data, batch: value })
            }
          >
            <option>Select batch</option>
            {batchData &&
              batchData.map((batch, indx) => (
                <option key={indx} value={batch.id}>
                  {batch.name}
                </option>
              ))}
          </select>
          <select
            className="form-select col"
            onChange={({ target: { value } }) =>
              setData({ ...data, subject: value })
            }
          >
            <option>Select subject</option>
            {subjectsData &&
              subjectsData.map((subject, indx) => (
                <option key={indx} value={subject.id}>
                  {subject.name}
                </option>
              ))}
          </select>
          <div className="col">
            <i
              className="fa-solid fa-check text-success me-3"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFormData({
                  classes: formData["classes"]
                    ? [...formData["classes"], data]
                    : [data],
                });
                setData(null);
              }}
            ></i>
            <i
              className="fa-solid fa-trash text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => setData(null)}
            ></i>
          </div>
        </div>
      )}
      <button
        className="btn btn-primary float-end"
        onClick={(e) => {
          e.preventDefault();
          setData({ batch: null, subject: null });
        }}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </>
  );
};

export default ClassesManager;
