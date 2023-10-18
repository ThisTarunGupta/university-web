"use client";
import { useRouter } from "next/navigation";
import { useContext, useReducer, useState } from "react";

import AuthContext from "../context/auth";

const initialData = { name: null, phone: null, email: null, password: null };

const ProfilePage = () => {
  const { back } = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [data, setData] = useReducer(
    (current, update) => ({ ...current, ...update }),
    initialData
  );
  const [edit, setEdit] = useState(false);

  const handleEdit = async () => {};

  return (
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-center justify-content-between">
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() =>
            edit ? setEdit(false) && setData(initialData) : back()
          }
        >
          {!edit && <i className="fa-solid fa-arrow-left me-2"></i>}
          {edit ? "Cancel" : "Back"}
        </button>
        {edit && (
          <button className="btn btn-primary mb-3" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
      {user && (
        <>
          {user.name && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                className="form-control"
                value={data.name || user.name}
                onChange={({ target: { value } }) => {
                  setData({ name: value.trim() });
                  setEdit(true);
                }}
              />
            </div>
          )}
          {user.phone && (
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                className="form-control"
                value={data.phone || user.phone}
                onChange={({ target: { value } }) => {
                  setData({ phone: value.trim() });
                  setEdit(true);
                }}
              />
            </div>
          )}
          {user.email && (
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-control"
                type="email"
                value={data.email || user.email}
                onChange={({ target: { value } }) => {
                  setData({ email: value.trim() });
                  setEdit(true);
                }}
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New password
            </label>
            <input
              className="form-control"
              type="password"
              value={data.password}
              onChange={({ target: { value } }) => {
                setData({ password: value.trim() });
                setEdit(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
