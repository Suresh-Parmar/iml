import {
  attendenceSheetDownload,
  readCities,
  readClasses,
  readCompetitions,
  readExamCenters,
  readStates,
  // studentDetails,
} from "@/utilities/API";
import { Checkbox, MultiSelect, Select, TextInput } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import Loader from "@/components/common/Loader";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";
// import { validateAlpha } from "@/helpers/validations";
import { sortData } from "@/helpers/sorting";

function Page() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  // const [schoolsData, setSchoolsData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [classesData, setClassesData] = useState<any>([]);
  const [dataExamCenters, setDataExamCenters] = useState<any>([]);
  const [filteredDataExamCenter, setFilteredDataExamCenter] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  // const [studentGridData, setStudentGridData] = useState<any>([]);
  const [examDate, setExamDate] = useState<any>([]);
  // const [zipUrl, setZipUrl] = useState<any>("");
  const [pdfLoader, setpdfLoader] = useState<any>(false);
  const [genratedData, setGenratedData] = useState<any>([]);
  const [order, setOrder] = useState<any>(true);

  console.log(allData, "allData allData");

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false);
      }, 30000);
    }
  }, [loader]);

  useEffect(() => {
    if (allData.exam_date) {
      let data: any = [];
      filteredDataExamCenter.map((item: any) => {
        if (item.examdate == allData.exam_date) {
          data.push(item);
        }
      });
      setDataExamCenters([...data]);
    }
  }, [allData?.exam_date]);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  // let isStudentFilters = allData.admitCardFilter == "studentWise";
  let themeColor = state?.colorScheme;

  // let genratePayloadStudentWise = () => {
  //   let singleClassData = findFromJson(classesData, allData.select_class, "label");
  //   let singleCompetition = findFromJson(comeptitionsData, allData.competition, "value");

  //   let values: any = {
  //     cohort: "select_cohort",
  //     group: "select_group",
  //     school: "select_school",
  //   };

  //   let newKey = values[allData.filterTypeStudent];

  //   let obj: any = {
  //     country: countryName || "India",
  //     competition: singleCompetition.label || "",
  //     state: allData.state,
  //     city: allData.city,
  //     role: "student",
  //     [allData.filterTypeStudent]: allData[newKey],
  //     class: singleClassData.code || allData.select_class || "",
  //     // class_code: singleClassData.code || allData.select_class || "",
  //   };

  //   return obj;
  // };

  // let getStudentDetailsApi = () => {
  //   let payload = genratePayloadStudentWise();
  //   studentDetails(payload)
  //     .then((res) => {
  //       setStudentGridData(res.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  async function readExamCentersData() {
    let payload: any = {
      collection_name: "exam_centers",
      op_name: "find_many",
      filter_var: {
        city_id: allData.city_id,
        country: countryName || "India",
      },
    };

    if (allData.competition) {
      payload.filter_var.competition = allData.competition;
    }

    setLoader(true);
    let examCentersData: any = await readExamCenters("city_id", allData.city_id, payload);
    setLoader(false);
    let examCenters = filterData(examCentersData, "label", "value");

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
    setDataExamCenters(examCenters);
    setFilteredDataExamCenter(examCenters);
  }

  // useEffect(() => {
  //   allData.city && allData.filterTypeStudent && allData.select_class && getStudentDetailsApi();
  // }, [allData]);

  // fetch data

  async function readStatesData() {
    let states = await readStates();
    states = filterData(states, "label", "value", "_id");
    setStatesData(states);
  }

  async function readCitiesData(filterBy?: "state_id", filterQuery?: string | number) {
    let cities: any[];
    cities = await readCities(filterBy, filterQuery);
    cities = filterData(cities, "label", "value", "_id");
    setCitiesData(cities);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();
    competitions = filterData(competitions, "label", "value", "_id");
    setCompetitionsData(competitions);
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    setLoader(true);
    let classes: any = await readClasses();
    setLoader(false);
    classes = filterData(classes, "label", "value", "", true, "order_code", undefined, true);
    classes.unshift("all");
    setClassesData(classes);
  }

  useEffect(() => {
    countryName && readStatesData();
    countryName && readClassesData();
    readExamCentersData();
    readCompetitionsData();
  }, [countryName]);

  useEffect(() => {
    (allData.city_id || allData.competition) && readExamCentersData();
  }, [allData.city_id, allData.competition]);

  useEffect(() => {
    allData.state_id && readCitiesData("state_id", allData.state_id);
  }, [allData.state_id]);

  const handleDropDownChange = (e: any, key: any, clear?: any) => {
    if (clear) {
      if (clear == "all") {
        setAllData({ [key]: e });
      } else {
        setAllData({ ...allData, [clear]: "", [key]: e });
      }
    } else {
      setAllData({ ...allData, [key]: e });
    }
  };

  const studentFilters = [
    {
      label: "Competition",
      placeholder: "Competition",
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onChange: (e: any) => {
        handleDropDownChange(e, "competition_id", "all");
      },
      value: allData.competition_id,
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
      placeholder: "Class",
      onChange: (e: any) => {
        handleDropDownChange(e, "select_class");
      },
      value: allData.select_class || "",
    },

    {
      label: "State",
      placeholder: "State",
      key: "state",
      type: "select",
      data: statesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "state_id", "city_id");
      },
      value: allData.state_id || "",
    },
    {
      label: "City",
      placeholder: "City",
      key: "city",
      type: "select",
      data: citiesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "city_id", "exam_center");
      },
      value: allData.city_id,
    },
    // {
    //   label: "Series",
    //   placeholder: "A",
    //   key: "series",
    //   type: "input",
    //   data: comeptitionsData,
    //   onChange: (e: any) => {
    //     let val = validateAlpha(e.target.value, true, 1);
    //     val = val.toUpperCase();
    //     handleDropDownChange(val, "series");
    //   },
    //   value: allData.series || "",
    // },
    {
      label: "Division Break",
      key: "division_break",
      type: "checkbox",
      onchange: (e: any) => {
        handleDropDownChange(e.currentTarget.checked, "division_break");
      },
      checked: allData.division_break,
    },
  ];

  let filters = studentFilters;

  const renderData = useCallback(() => {
    return filters.map((item: any, index) => {
      if (item.hideInput) {
        return;
      }
      let { type, data, label, placeholder, onchange, value, style, checked } = item;
      if (type === "multiselect") {
        return (
          <div key={index}>
            <MultiSelect searchable={true} size="sm" {...item} />
          </div>
        );
      } else if (type === "select") {
        return (
          <div key={index}>
            <Select clearable searchable={true} size="sm" {...item} />
          </div>
        );
      } else if (type == "checkbox") {
        return <Checkbox key={index} checked={checked} label={label} mt={25} size="md" onChange={onchange} />;
      } else {
        return (
          <div key={index}>
            <TextInput {...item} />
          </div>
        );
      }
    });
  }, [filters]);

  const downloadZipConcept = async () => {
    for (let item of genratedData[0]) {
      if (item.attendence_sheet) {
        let a = document.createElement("a");
        a.href = item.attendence_sheet;
        a.target = "_blank";
        document.body.appendChild(a);

        await new Promise((resolve) => {
          a.click();
          resolve("");
        });
        document.body.removeChild(a);
      }
    }
  };

  const handleCHeckBOxesStudents = (
    e: any,
    item: any = "",
    selectedData: any,
    allDatatoFilter: any,
    key: any,
    setKey: any
  ) => {
    let checked: any = e.target.checked;
    let data: any = [];
    if (!!item) {
      data = selectCheckBOxData(selectedData, checked, item[key], allDatatoFilter, key);
    } else {
      data = selectCheckBOxData(selectedData, checked, "", allDatatoFilter, key);
    }

    allData[setKey] = data;
    setAllData({ ...allData });
  };

  const renderUsersTable = useCallback(() => {
    if (!dataExamCenters.length) {
      return <>No Record Found</>;
    }

    const renderTableData = () => {
      return dataExamCenters.map((item: any, index: any) => {
        return (
          <tr className="capitalize" key={index}>
            <td scope="row">
              <input
                type="checkbox"
                checked={Array.isArray(allData.exam_center) && allData.exam_center.includes(item["exam_center_id"])}
                onChange={(e: any) => {
                  handleCHeckBOxesStudents(
                    e,
                    item,
                    allData.exam_center,
                    dataExamCenters,
                    "exam_center_id",
                    "exam_center"
                  );
                }}
              />
            </td>
            <td>{item["name"]}</td>
            <td>{item["exam_center_id"]}</td>
            <td>{item["mode"]}</td>
            <td>{item["paper_code"]}</td>
            <td>{item["state"]}</td>
            <td>{item["city"]}</td>
            <td className="text-center">
              {item?.attendence_sheet ? (
                <a href={item.attendence_sheet} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
              ) : item?.exam_center_id == pdfLoader ? (
                "loading..."
              ) : (
                <span className="material-symbols-outlined text-secondary">download</span>
              )}
            </td>
          </tr>
        );
      });
    };

    return (
      <div className="my-4 table-responsive" style={{ maxHeight: "350px", overflow: "auto" }}>
        <div className="d-flex justify-content-between px-4">
          <span></span>
          {genratedData.length ? (
            <div
              className="pointer"
              onClick={() => {
                downloadZipConcept();
              }}
            >
              <span className="material-symbols-outlined text-success">folder_zip</span>
            </div>
          ) : (
            ""
          )}
        </div>
        <table className={`table table-striped table-${themeColor}`}>
          <thead
            style={{
              position: "sticky",
              top: 0,
            }}
          >
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  checked={checkIsAllChecked(allData.exam_center, dataExamCenters)}
                  onChange={(e: any) => {
                    handleCHeckBOxesStudents(
                      e,
                      false,
                      allData.exam_center,
                      dataExamCenters,
                      "exam_center_id",
                      "exam_center"
                    );
                  }}
                />
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(dataExamCenters, "name", order);
                  setDataExamCenters([...data]);
                }}
              >
                Center
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(dataExamCenters, "_id", order);
                  setDataExamCenters([...data]);
                }}
              >
                Center Code
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(dataExamCenters, "mode", order);
                  setDataExamCenters([...data]);
                }}
              >
                Exam Type
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(dataExamCenters, "paper_code", order);
                  setDataExamCenters([...data]);
                }}
              >
                Paper Type
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(dataExamCenters, "state", order);
                  setDataExamCenters([...data]);
                }}
              >
                State
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(dataExamCenters, "city", order);
                  setDataExamCenters([...data]);
                }}
              >
                City
              </th>
              <th scope="col" className="text-center">
                download
              </th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    );
  }, [allData, dataExamCenters, checkIsAllChecked(allData.exam_center, dataExamCenters), themeColor, pdfLoader]);

  let migrateData = (data: any[], data1: any[], by: string, mainKey: any = "") => {
    let newData: any[] = [];
    data1.map((item: any) => {
      let newItem = data.find((itemchild: any, i: any) => item[mainKey] == itemchild[by]);
      if (newItem) {
        let newDataa = { ...item, ...newItem };
        newData.push(newDataa);
      } else {
        delete item.admit_card_url;
        newData.push(item);
      }
    });

    return newData;
  };

  let removeGarbage = (data: any) => {
    let arr: any = [];

    data.map((item: any) => {
      if (item.attendence_sheet) {
        arr.push(item);
      }
    });

    return arr;
  };

  const genrateStudentPdf = async () => {
    let singleCompetition = findFromJson(comeptitionsData, allData.competition, "value");
    setGenratedData([]);

    for (const item of allData.exam_center) {
      let newPayload: any = {
        country: countryName || "India",
        competition: singleCompetition?.name || "",
        state: allData.state,
        city_id: allData.city_id,
        exam_date: allData.exam_date,
        exam_center: [item],
        series: allData.series,
        division_break: allData.division_break,
      };

      if (allData.select_class && allData.select_class != "all") {
        newPayload.class = allData.select_class;
      }

      setpdfLoader(item);

      try {
        let data = await attendenceSheetDownload(newPayload);
        setpdfLoader(false);
        let tmpNewData = removeGarbage(data?.data);

        genratedData.push(...tmpNewData);
        setGenratedData([genratedData]);
        let newData = migrateData(genratedData, dataExamCenters, "center_code", "_id");
        setDataExamCenters([...newData]);
      } catch (err) {
        console.log(err);
        setpdfLoader(false);
      }
    }
  };

  const AdmitCardDownLoad = () => {
    return (
      <div>
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>
        <div className="table-responsive mt-4">{renderUsersTable()}</div>
        {/* <div className="table-responsive  m-4">{renderTable()}</div> */}

        {allData?.exam_center?.length && !pdfLoader ? (
          <div className="btn btn-primary form-control" onClick={() => genrateStudentPdf()}>
            Generate PDF
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <div className="mx-4 py-5" style={{ maxHeight: "100%", overflow: "auto" }}>
      {AdmitCardDownLoad()}
      <Loader show={loader} />
    </div>
  );
}

export default Page;
