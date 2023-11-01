import React, { useState, useEffect } from "react";
import { Logo } from "@/components/Header/_logo";
import { filterData } from "@/helpers/filterData";
import { readCities, readClasses, readCompetitions, readExamCenters, readStates, readStudents } from "@/utilities/API";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import { Select, TextInput } from "@mantine/core";
import { findFromJson } from "@/helpers/filterFromJson";

function AttendanceSheet() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [classesData, setClassesData] = useState<any>([]);
  const [dataExamCenters, setDataExamCenters] = useState<any>([]);
  const [studentsData, setStudentsData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [singleExamCenter, setSingleExamCenter] = useState<any>({});
  const [classWiseData, setClassWiseData] = useState<any>([]);
  const [finlaPrintRecord, setFinlaPrintRecord] = useState<any>([]);
  const [examDate, setExamDate] = useState<any>([]);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;

  console.log(allData);

  useEffect(() => {
    countryName && readStatesData();
    countryName && readClassesData();
    readCompetitionsData();
    readExamCentersData();
  }, [countryName]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    filterDataStudent();
  }, [studentsData]);

  let genratePrintableData = (objData: any) => {
    let arr: any = [];

    Object.keys(objData).map((key) => {
      let obj: any = { class: key, total: objData[key].length };
      let min = objData[key][0]?.username || 0;
      let max = objData[key][0]?.username || 0;

      objData[key].map((val: any) => {
        if (!isNaN(+val.username)) {
          if (+val.username > +max) max = val.username;
          if (+val.username < +min) min = val.username;
        }
      });

      obj.start = min;
      obj.end = max;
      arr.push(obj);
    });

    setClassWiseData(arr);
  };

  let filterDataStudent = () => {
    let obj: any = {};
    studentsData.map((item: any) => {
      if (obj[item.class_code]) {
        obj[item.class_code].push(item);
      } else {
        obj[item.class_code] = [];
        obj[item.class_code].push(item);
      }
    });
    genratePrintableData(obj);
  };

  const handleDropDownChange = (value: any, key: string, clear: any = "") => {
    if (clear) {
      if (clear == "all") {
        setAllData({ [key]: value });
      } else {
        setAllData({ ...allData, [clear]: "", [key]: value });
      }
    } else {
      setAllData({ ...allData, [key]: value });
    }
  };

  async function readExamCentersData() {
    setLoader(true);
    let examCenters: any = await readExamCenters();
    setLoader(false);
    examCenters = filterData(examCenters, "label", "value", "_id");
    setDataExamCenters(examCenters);

    let examCentersData = filterData(examCenters, "label", "value", "_id");
    let examCentersDate = filterData(
      structuredClone(examCentersData),
      "label",
      "value",
      "examdate",
      true,
      "",
      "examdate"
    );
    setExamDate(examCentersDate);
    // examCenters.unshift("all");
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    setLoader(true);
    let classes: any = await readClasses();
    setLoader(false);
    classes = filterData(classes, "label", "value", "", false);
    classes.unshift("all");
    setClassesData(classes);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    setLoader(true);
    let competitions: any = await readCompetitions();
    setLoader(false);
    competitions = filterData(competitions, "label", "value");
    // competitions.unshift("all");

    setCompetitionsData(competitions);
  }

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    setLoader(true);
    let states: any = await readStates(filterBy, filterQuery);
    setLoader(false);
    states = filterData(states, "label", "value");
    // states.unshift("all");
    setStatesData(states);
  }

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: any[];
    setLoader(true);
    cities = await readCities(filterBy, filterQuery);
    setLoader(false);
    cities = filterData(cities, "label", "value");
    // cities.unshift("all");
    setCitiesData(cities);
  }

  let filtersData: any = [
    {
      label: "Competition",
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onChange: (e: any) => {
        handleDropDownChange(e, "competition");
      },
      value: allData.competition,
    },
    {
      label: "State",
      key: "state",
      type: "select",
      data: statesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      key: "city",
      type: "select",
      data: citiesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "city");
      },
      value: allData.city,
    },

    {
      type: "select",
      label: "Exam Center",
      data: dataExamCenters,
      value: allData.exam_center,
      placeholder: "Exam Center",
      onChange: (e: any) => {
        let data = findFromJson(dataExamCenters, e, "_id");
        setSingleExamCenter(data);
        handleDropDownChange(e, "exam_center");
      },
    },
    {
      type: "select",
      label: "Exam Date",
      data: examDate,
      value: allData.exam_date || null,
      placeholder: "Exam Date",
      onChange: (e: any) => {
        // let data = findFromJson(dataExamCenters, e, "name");
        handleDropDownChange(e, "exam_date");
      },
    },
    {
      label: "Select Class",
      key: "select_class",
      type: "select",
      data: classesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "select_class");
      },
      value: allData.select_class,
    },
  ];

  const readusers = async () => {
    let payload: any = {
      city: allData.city,
      state: allData.state,
      competition: allData.competition,
      exam_center_id: allData.exam_center,
    };

    // if (allData.competition && allData.competition !== "all") payload.competition_code = allData.competition;

    if (allData.select_class && allData.select_class !== "all") payload.class_id = allData.select_class;

    let payloadData = {
      collection_name: "users",
      op_name: "find_many",
      filter_var: {
        role: "student",
        country: "India",
        ...payload,
      },
    };

    setLoader(true);
    let students = await readStudents(payloadData);
    students = filterData(students, "label", "value");
    setStudentsData(students);
    setLoader(false);
  };

  useEffect(() => {
    allData.city && allData.competition && allData.exam_center && readusers();
  }, [allData]);

  let renderFields = () => {
    return filtersData.map((item: any, index: any) => {
      if (item.hideInput) {
        return;
      }
      if (item.type == "select") {
        return <Select searchable={true} size="sm" key={index} w="31%" {...item} />;
      } else if (item.inputType == "file") {
        return (
          <div className="mb-3" style={{ minWidth: "31%" }} key={index}>
            <input {...item} className="form-control" />
          </div>
        );
      } else {
        return <TextInput size="sm" style={{ minWidth: "31%" }} key={index} {...item} />;
      }
    });
  };

  const printContent = () => {
    const printDiv: any = document.getElementById("printTable");
    const content = printDiv.innerHTML;
    const newWindow: any = window.open("", "_blank");
    newWindow.document.open();
    newWindow.document.write(`
      <html>
      <head>
        <style>
        .pdfLogo img {
            height: unset;
            width: 40vw;
            padding: 40px;
          }

          .pdfLogo h3 {
            font-size: 1.3rem;
            margin-top: -25px !important;
          }

        @page { size: auto;  margin: 0mm; }

            @media print {
            .no-print {
              display: none;
            }
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <div id="printTable" class="page-break" style='margin:0px 20px;'>${content}</div>
      </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  const renderSummaryData = () => {
    if (classWiseData.length) {
      return (
        <div style={{ margin: "0 0 30px 0", minHeight: "100vh" }}>
          <div
            className="pdfLogo mb-5"
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Logo colorScheme={"light"} />
            {allData.competition && <h3 style={{ textAlign: "center" }}>{allData.competition}</h3>}
          </div>
          {singleExamCenter.name && (
            <div style={{ fontWeight: "bold", margin: "0 0 10px 0" }}>{singleExamCenter.name}</div>
          )}

          <div style={{ border: "1px solid" }}>
            <div style={{ textAlign: "center", padding: "15px", fontWeight: "bold", borderBottom: "1px solid" }}>
              Center Name : {singleExamCenter.name}
            </div>
            <div style={{ padding: "15px" }}>
              <table style={{ width: "100%" }} border={1} cellSpacing={0} cellPadding={10}>
                <tr style={{ background: "#bfbfbf", border: "1px solid black", borderCollapse: "collapse" }}>
                  <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>Class</th>
                  <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>From</th>
                  <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>To</th>
                  <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>Total</th>
                  <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                    Present
                  </th>
                  <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>Absent</th>
                </tr>

                {classWiseData.map((item: any, index: any) => {
                  return (
                    <tr key={index} style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                      <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                        {item.class}
                      </td>
                      <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                        {item.start}
                      </td>
                      <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                        {item.end}
                      </td>
                      <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                        {item.total}
                      </td>
                      <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}></td>
                      <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}></td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                margin: "20px",
                fontSize: "20px",
                padding: "15px",
                fontWeight: "bold",
                border: "1px solid",
                maxWidth: "50vw",
                textAlign: "center",
              }}
            >
              {`If there is any mistake in spelling of student's name, kindly correct it on the attendance sheet. We will
              correct the same in our database.`}
            </div>
          </div>
          <div
            style={{
              margin: "20px",
              fontSize: "20px",
              padding: "15px 15px 0 15px",
              fontWeight: "bold",
              maxWidth: "70vw",
            }}
          >
            Please send the answer sheets, attendance sheets and extra papers to the following address:-
          </div>
          <div
            style={{
              margin: "0 0 0 20px ",
              fontSize: "20px",
              padding: "0 0 0 15px",
              fontWeight: "bold",
              maxWidth: "70vw",
            }}
          >
            IGNITED MIND LAB C-157,
            <br /> Antop Hill Warehouse Complex Near Barkat Ali Naka,
            <br /> Wadala (East),
            <br /> Mumbai - 400037 <br />
            Tel. No.: 022 - 24143077
          </div>
        </div>
      );
    }
  };

  const randerTable = () => {
    if (studentsData.length) {
      return (
        <div id="printTable" style={{ margin: "0 0 30px 0" }}>
          {renderSummaryData()}
          <div
            className="pdfLogo mb-5"
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Logo colorScheme={"light"} />
            {allData.competition && <h3 style={{ textAlign: "center" }}>{allData.competition}</h3>}
          </div>
          {singleExamCenter.name && (
            <div style={{ fontWeight: "bold", margin: "0 0 10px 0" }}>{singleExamCenter.name}</div>
          )}
          <table style={{ width: "100%" }} border={1} cellSpacing={0} cellPadding={10}>
            <tr style={{ background: "#bfbfbf", border: "1px solid black", borderCollapse: "collapse" }}>
              <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                Registration No
              </th>
              <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>seat No</th>
              <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>Class</th>
              <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>Sec.</th>
              <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                Name of Student
              </th>
              <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                {`Student's Signature / Remarks`}
              </th>
            </tr>

            {studentsData.map((item: any, index: any) => {
              return (
                <tr key={index} style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                  <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                    {item.username}
                  </td>
                  <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                    {item["seat_number"]}
                  </td>
                  <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                    {item.class_id}
                  </td>
                  <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                    {item.section}
                  </td>
                  <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}>
                    {item.name}
                  </td>
                  <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "8px 15px" }}></td>
                </tr>
              );
            })}
          </table>
          {/* <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <div></div>
            <div>TOTAL:- {studentsData.length}</div>
          </div> */}
        </div>
      );
    }
  };
  return (
    <div style={{ background: "#f8f9fa" }}>
      <div className="p-4">
        <div className="d-flex w-100 gap-3 flex-wrap mx-auto">{renderFields()}</div>
      </div>

      <div style={{ padding: "20px 30px" }}>
        {/* 
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <div>table </div>
          <div> data</div>
        </div> */}
        {randerTable()}
        {studentsData.length ? (
          <button className="btn btn-primary form-control" onClick={printContent}>
            Print
          </button>
        ) : (
          ""
        )}
      </div>
      <Loader show={loader} />
    </div>
  );
}

export default AttendanceSheet;
