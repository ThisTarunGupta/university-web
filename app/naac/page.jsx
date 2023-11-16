"use client";
import { useContext, useEffect, useState } from "react";

import AuthContext from "../context/auth";

const options = {
  5: "Strongly Agree",
  4: "Agree",
  3: "Not Sure",
  2: "Disagree",
  1: "Strongly Disagree",
};

const NAACFeedbackPage = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState({ varient: null, data: null });
  const [response, setResponse] = useState(null);
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    const initRequests = async () => {
      const res = await fetch("/api/naac");
      const { data } = await res.json();
      if (data) setRequests(data);
    };
    !user && initRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gender = response.gender.toLowerCase().trim();
    const name = response.name.toLowerCase().trim();
    const rollno = response.rollno.toLowerCase().trim();
    delete response.gender;
    delete response.name;
    delete response.rollno;

    const res = await fetch("api/naac", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: `${rollno}&&${name}&&${gender}`, response }),
    });
    const { error } = await res.json();
    error
      ? setMessage({ varient: "danger", data: error })
      : setMessage({ varient: "success", data: "Response send successfully!" });

    setResponse(null);
  };

  return user ? (
    <h1 className="text-center">Not authorized; Only for students</h1>
  ) : requests ? (
    <div className="container py-5">
      {message.data && (
        <div
          className={`alert alert-${message.varient} text-center`}
          role="alert"
        >
          {message.data}
        </div>
      )}
      <h1 className="text-center mb-3">Department of Computer Science & IT</h1>
      <h2 className="text-center mb-3">University of Jammu</h2>
      <h3 className="text-center mb-3">Student Feedback Form</h3>
      <form className="py-5" method="POST" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="rollno">
            Roll No.
          </label>
          <input
            className="form-control"
            id="rollno"
            pattern="^[0-9]+[a-zA-Z]+[0-9]+$"
            onChange={({ target: { value } }) =>
              setResponse({ ...response, rollno: value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            className="form-control"
            id="name"
            pattern="^[a-zA-Z ]+$"
            onChange={({ target: { value } }) =>
              setResponse({ ...response, name: value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="gender">
            Gender
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="gender1"
              value="male"
              onChange={({ target: { value } }) =>
                setResponse({ ...response, gender: value })
              }
            />
            <label className="form-check-label" htmlFor="gender1">
              Male
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="gender2"
              value="female"
              onChange={({ target: { value } }) =>
                setResponse({ ...response, gender: value })
              }
            />
            <label className="form-check-label" htmlFor="gender2">
              Female
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="gender3"
              value="other"
              onChange={({ target: { value } }) =>
                setResponse({ ...response, gender: value })
              }
            />
            <label className="form-check-label" htmlFor="gender3">
              Other
            </label>
          </div>
        </div>
        {Object.keys(requests).map((key) => {
          const map = requests.map;
          if (key !== "map") {
            if (requests[key].length)
              return (
                <>
                  <h3 className="text-center mb-3">{key}</h3>
                  <ol>
                    {requests[key] &&
                      requests[key].map((keyValue) => (
                        <li key={keyValue}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor={keyValue}
                            >{`${map[keyValue]}:`}</label>
                            {Object.keys(options).map((x) => (
                              <div key={x} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={keyValue}
                                  id={`${keyValue}${x}`}
                                  value={x}
                                  onChange={({ target: { value } }) =>
                                    setResponse({
                                      ...response,
                                      [keyValue]: parseInt(value),
                                    })
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`${keyValue}${x}`}
                                >
                                  {options[x]}
                                </label>
                              </div>
                            ))}
                          </div>
                        </li>
                      ))}
                  </ol>
                </>
              );
            else {
              const data = requests[key];
              return (
                <>
                  <h3 className="text-center mb-3">{key}</h3>
                  <ul>
                    {data &&
                      Object.keys(data).map((key, indx) => (
                        <li key={indx}>
                          <h3 className="mb-3">{key}</h3>
                          <ol>
                            {data[key] &&
                              data[key].map((keyValue) => (
                                <li key={keyValue}>
                                  <div className="mb-3">
                                    <label
                                      className="form-label"
                                      htmlFor={keyValue}
                                    >{`${map[keyValue]}:`}</label>
                                    {Object.keys(options).map((x) => (
                                      <div key={x} className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name={keyValue}
                                          id={`${keyValue}${x}`}
                                          value={x}
                                          onChange={({ target: { value } }) =>
                                            setResponse({
                                              ...response,
                                              [keyValue]: parseInt(value),
                                            })
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`${keyValue}${x}`}
                                        >
                                          {options[x]}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </li>
                              ))}
                          </ol>
                        </li>
                      ))}
                  </ul>
                </>
              );
            }
          }
        })}
        <div className="d-flex">
          <input type="submit" className="btn btn-primary" value="Submit" />
          <input
            type="reset"
            className="btn btn-outline-primary ms-3"
            value="Reset"
            onClick={() => setResponse(null)}
          />
        </div>
      </form>
    </div>
  ) : (
    <h1 className="text-center">Link is not active</h1>
  );
};

export default NAACFeedbackPage;
