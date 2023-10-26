"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import Switch from "@/app/components/switch";
import AuthContext from "@/app/context/auth";
import StateContext from "@/app/context/state";

const NAACPage = () => {
  const { user } = useContext(AuthContext);
  const { state, setState } = useContext(StateContext);
  const [attributes, setAttributes] = useState(null);

  useEffect(() => {
    const initNAAC = async () => {
      const res = await fetch(`/api/naac?uid=${user.id}`);
      const { data } = await res.json();
      if (data) {
        const attributes = ["rollno", "name"];
        Object.keys(data.request.map).forEach((indx) => attributes.push(indx));
        setAttributes(attributes);
        setState({ naac: data });
      }
    };
    !state["naac"] && initNAAC();

    return () => setState({ naac: null });
  }, []);

  const handleActive = async () => {
    const isActive = state.naac.request.active;
    const res = await fetch(`/api/naac?uid=${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: !isActive }),
    });

    const { error } = await res.json();
    setState({
      naac: {
        ...state.naac,
        request: {
          ...state.naac.request,
          active: error ? isActive : !isActive,
        },
      },
    });
  };

  return (
    <>
      {state.naac && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            Active
            <Switch
              initialState={state.naac.request.active}
              varient="primary"
              handleSwitch={handleActive}
            />
          </div>
          <div className="d-flex align-items-center justify-content-start mt-3">
            {state.naac.request.active && (
              <>
                <button className="btn btn-primary me-3">Generate Excel</button>
                <button className="btn btn-success">Generate PDF</button>
              </>
            )}
          </div>
          {state.naac.response && (
            <table className="table my-5">
              <thead className="table-dark">
                <tr>
                  <td scope="col">#</td>
                  {attributes &&
                    attributes.map((attribute) => (
                      <td key={attribute} scope="col">
                        {attribute.toUpperCase()}
                      </td>
                    ))}
                </tr>
              </thead>
              <tbody>
                {state.naac.response &&
                  Object.keys(state.naac.response).map(student, (indx) => (
                    <tr key={student}>
                      <td>{indx}</td>
                      {attributes &&
                        attributes.map((attribute) => (
                          <td key={attribute}>
                            state.naac.response[student][attribute]
                          </td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {state.naac.docs && (
            <>
              Excels <br />
              PDFs
            </>
          )}
        </>
      )}
    </>
  );
};

export default NAACPage;
