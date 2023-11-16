"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import Switch from "@/app/components/switch";
import AuthContext from "@/app/context/auth";
import StateContext from "@/app/context/state";
import saveAs from "@/app/utilities/saveAs";

const NAACPage = () => {
  const { user } = useContext(AuthContext);
  const { state, setState } = useContext(StateContext);
  const [attributes, setAttributes] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initNAAC = async () => {
      const res = await fetch(`/api/naac?uid=${user.id}`);
      const { data } = await res.json();
      if (data) {
        setAttributes([
          "ROLLNO",
          "NAME",
          "GENDER",
          ...Object.keys(data.requests.map),
        ]);
        setMap(data.requests.map);
        setState({ naac: data });
      }
    };
    !state["naac"] && initNAAC();

    return () => setState({ naac: null });
  }, []);

  const getColumnName = (colIndex) => {
    // Convert numeric column index to Excel-like column name
    let dividend = colIndex;
    let columnName = "";

    while (dividend > 0) {
      const modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
  };

  const getColumnNameToIndex = (columnName) => {
    let index = 0;
    for (let i = 0; i < columnName.length; i++) {
      index = index * 26 + columnName.charCodeAt(i) - 64;
    }
    return index;
  };

  const handleActive = async () => {
    const isActive = state.naac.responses.active;
    const res = await fetch(`/api/naac?uid=${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: !isActive }),
    });

    const { error } = await res.json();
    if (isActive) generate();
    setState({
      naac: {
        responses: { active: !isActive },
      },
    });
  };

  const generate = async () => {
    if (state.naac.responses.active) {
      const responses = state.naac.responses;
      const responsesLength = Object.keys(responses).length;
      delete responses.active;
      if (responsesLength) {
        const columnSums = {};
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("FeedbackData");

        const headers = ["ROLLNO", "NAME", "GENDER"];
        Object.keys(map).forEach((key) => headers.push(map[key]));
        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(1);
        headerRow.height = 4 * 15;

        headerRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "8CD5EC" },
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };

          if (
            cell.value !== "ROLLNO" &&
            cell.value !== "NAME" &&
            cell.value !== "GENDER" &&
            cell.value !== "About The Program"
          ) {
            cell.width = 15;
            cell.alignment = { vertical: "top", horizontal: "center" };
            cell.alignment.wrapText = true;
          }
        });
        Object.keys(responses).forEach((student) => {
          const dataRow = student.split("&&");
          dataRow.push(
            ...Object.keys(map).map((key) => {
              const value = parseInt(responses[student][key]);
              columnSums[key] = (columnSums[key] || 0) + value;

              return value;
            })
          );
          worksheet.addRow(dataRow);

          worksheet.getColumn("A").width = 17;
          worksheet.getColumn("B").width = 17;
          worksheet.getColumn("C").width = 17;

          const row = worksheet.lastRow;
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" }; // Center-align text
          });
        });

        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            if (cell.value !== undefined && cell.value !== null) {
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
          });
        });

        const columnAverages = {};
        for (const key in columnSums) {
          const average = parseFloat(
            (columnSums[key] / responsesLength).toFixed(2)
          );
          const columnIndex = headers.indexOf(map[key]) + 1;

          const averageCell = worksheet.getCell(
            `${getColumnName(columnIndex)}${responsesLength + 2}`
          );
          averageCell.value = average;

          averageCell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          averageCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" },
          };

          averageCell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          columnAverages[key] = average;
        }

        const columnRanges = [
          ["D", "J"],
          ["K", "Q"],
          ["R", "U"],
          ["V", "AG"],
        ];
        const averageOfAverages = {};
        for (const [startColumn, endColumn] of columnRanges) {
          const rangeAverages = [];
          for (const key in columnAverages) {
            const columnIndex = headers.indexOf(map[key]) + 1;
            if (
              columnIndex >= getColumnNameToIndex(startColumn) &&
              columnIndex <= getColumnNameToIndex(endColumn)
            ) {
              rangeAverages.push(columnAverages[key]);
            }
          }
          const rangeAverage =
            rangeAverages.length > 0
              ? (
                  rangeAverages.reduce((sum, avg) => sum + avg, 0) /
                  rangeAverages.length
                ).toFixed(2)
              : "0.00";

          averageOfAverages[`${startColumn}-${endColumn}`] = rangeAverage;

          const mergeRange = `${startColumn}${
            responsesLength + 3
          }:${endColumn}${responsesLength + 3}`;
          const averageRow = worksheet.getRow(responsesLength + 3);
          averageRow.getCell(getColumnNameToIndex(startColumn)).value =
            rangeAverage;
          worksheet.mergeCells(mergeRange);
          averageRow.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF00" }, // Yellow background color
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        }

        const year = new Date().getFullYear();
        const buffer = await workbook.xlsx.writeBuffer();
        const excel = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(excel, `feedback-${year}.xlsx`);

        const keyReplacements = {
          "D-J": "About The Programme",
          "K-Q": "About The Departmental Facilites - General Infrastructure",
          "R-U": "About The Departmental Facilites - Library",
          "V-AG": "About The Departmental Facilites - Governance",
        };

        for (const key in keyReplacements) {
          if (averageOfAverages[key]) {
            averageOfAverages[keyReplacements[key]] = averageOfAverages[key];
            delete averageOfAverages[key];
          }
        }

        const doc = new jspdf.jsPDF();
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text("DEPARTMENT OF COMPUTER SCIENCE & IT", 105, 15, {
          align: "center",
        });
        doc.text("UNIVERSITY OF JAMMU", 105, 20, { align: "center" });
        doc.setFontSize(13);
        doc.text("Overall Student Feedback", 105, 35, { align: "center" });

        const columns = ["Parameter", year];
        const rows = [];
        for (const key in averageOfAverages)
          rows.push([key, averageOfAverages[key]]);

        doc.autoTable({
          head: [columns],
          body: rows,
          margin: { top: 50 },
          theme: "plain",
          headStyles: { lineWidth: 0.1, cellPadding: 3, halign: "center" },
          bodyStyles: { lineWidth: 0.1, cellPadding: 7, halign: "center" },
          columnStyles: { 0: { cellWidth: 150 } },
        });
        doc.save(`feedback-${year}.pdf`);
      }
    }
  };

  return (
    <>
      {state.naac && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            Active
            <Switch
              initialState={state.naac.responses.active}
              varient="primary"
              handleSwitch={handleActive}
            />
          </div>
          {state.naac.responses &&
            state.naac.responses.active &&
            attributes &&
            map && (
              <>
                <div className="table-responsive">
                  <table className="table text-center my-5">
                    <thead className="table-dark">
                      <tr>
                        <td scope="col">#</td>
                        {attributes.map((attribute) => (
                          <td
                            key={attribute}
                            scope="col"
                            aria-multiline={false}
                          >
                            {isNaN(attribute) ? attribute : map[attribute]}
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(state.naac.responses).map(
                        (student, indx) => {
                          if (student !== "active") {
                            const slug = student.split("&&");
                            return (
                              <tr key={indx}>
                                <td>{indx}</td>
                                {attributes &&
                                  attributes.map((attribute) => {
                                    if (attribute === "ROLLNO")
                                      return <td key={attribute}>{slug[0]}</td>;
                                    else if (attribute === "NAME")
                                      return <td key={attribute}>{slug[1]}</td>;
                                    else if (attribute === "GENDER")
                                      return <td key={attribute}>{slug[2]}</td>;
                                    else
                                      return (
                                        <td key={attribute}>
                                          {
                                            state.naac.responses[student][
                                              attribute
                                            ]
                                          }
                                        </td>
                                      );
                                  })}
                              </tr>
                            );
                          }
                        }
                      )}
                    </tbody>
                  </table>
                </div>
                <button className="mt-3 btn btn-success" onClick={generate}>
                  Generate
                </button>
              </>
            )}
        </>
      )}
    </>
  );
};

export default NAACPage;
