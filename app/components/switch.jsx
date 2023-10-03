"use client";
import { useState } from "react";

const Switch = ({ initialState, varient, handleSwitch, style }) => {
  const [state, setState] = useState(initialState);

  return (
    <button
      className={`btn btn-sm border-${state ? varient : "dark"} ms-3`}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        setState(!state);
        handleSwitch(!state);
      }}
    >
      <span
        className={`bg-${state ? "light" : "dark"} text-${
          state ? "light" : "dark"
        }`}
      >
        No
      </span>
      <span
        className={`bg-${state ? varient : "light"} text-${
          state ? varient : "light"
        }`}
      >
        No
      </span>
    </button>
  );
};

export default Switch;
