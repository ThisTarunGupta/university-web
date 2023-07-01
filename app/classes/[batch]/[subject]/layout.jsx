"use client";
import { useContext } from "react";

import ClassContext from "../../context";
import Sidebar from "@/app/components/sidebar";

const ClassLayout = async ({ children }) => {
  const classes = useContext(ClassContext);

  return (
    <div className="container">
      <div className="row">
        <Sidebar menu={classes.map((classObj) => ({}))} />
      </div>
    </div>
  );
};

export default ClassLayout;
