import {
  admitCardCountData,
  omrSheetDownload,
  readApiData,
  readCities,
  readClasses,
  readCompetitions,
  readExamCenters,
  readSchools,
  readStates,
  studentDetails,
} from "@/utilities/API";
import { Group, MultiSelect, Radio, Select, TextInput } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import Loader from "@/components/common/Loader";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";
import { validateAlpha } from "@/helpers/validations";

function Page() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [schoolsDataDropDown, setSchoolsDataDropDown] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [classesData, setClassesData] = useState<any>([]);
  const [groupsData, setGroupData] = useState<any>([]);
  const [cohortsData, setcohortsData] = useState<any>([]);
  const [dataExamCenters, setDataExamCenters] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [studentGridData, setStudentGridData] = useState<any>([]);
  const [examDate, setExamDate] = useState<any>([]);

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false);
      }, 30000);
    }
  }, [loader]);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  // let isStudentFilters = allData.admitCardFilter == "studentWise";
  let themeColor = state?.colorScheme;

  let genratePayloadStudentWise = () => {
    let singleClassData = findFromJson(classesData, allData.select_class, "label");
    let singleCompetition = findFromJson(comeptitionsData, allData.competition, "value");

    let values: any = {
      cohort: "select_cohort",
      group: "select_group",
      school: "select_school",
    };

    let newKey = values[allData.filterTypeStudent];

    let obj: any = {
      country: countryName || "India",
      competition: singleCompetition.label || "",
      state: allData.state,
      city: allData.city,
      role: "student",
      [allData.filterTypeStudent]: allData[newKey],
      class: singleClassData.code || allData.select_class || "",
      // class_code: singleClassData.code || allData.select_class || "",
    };

    return obj;
  };
  let getStudentDetailsApi = () => {
    let payload = genratePayloadStudentWise();
    studentDetails(payload)
      .then((res) => {
        setStudentGridData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function readExamCentersData() {
    setLoader(true);
    let examCentersData: any = await readExamCenters("city", allData.city);
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
  }

  useEffect(() => {
    allData.city && allData.filterTypeStudent && allData.select_class && getStudentDetailsApi();
  }, [allData]);

  // fetch data

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    let states = await readStates(filterBy, filterQuery);
    states = filterData(states, "label", "value");
    setStatesData(states);
  }

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: any[];
    cities = await readCities(filterBy, filterQuery);
    cities = filterData(cities, "label", "value");
    setCitiesData(cities);
  }

  const downloadPdf = (data: any) => {
    let newData = migrateData(data, schoolsData, "school_name");
    setSchoolsData([...newData]);
  };

  let genrateDataFormDropDown = (data: any) => {
    if (Array.isArray(data)) {
      data.map((item) => {
        item.value = item.school_name;
        item.label = item.school_name;
      });
    }

    return data;
  };

  // function readSchoolsData(isSchool: any = false) {
  //   let newPayload: any = {
  //     country: countryName || "India",
  //     competition_code: allData.competition || "",
  //     state: allData.state,
  //     city: allData.city,
  //     exam_date: allData.exam_date,
  //     exam_center: allData.exam_center,
  //     series: allData.series,
  //   };

  //   console.log(newPayload);

  //   setLoader(true);
  //   omrSheetDownload(newPayload)
  //     .then((res) => {
  //       setLoader(false);
  //       // if (isSchool) {
  //       downloadPdf(res.data);
  //       // } else {
  //       //   let data = genrateDataFormDropDown(res.data);
  //       //   setSchoolsDataDropDown(data);
  //       //   setSchoolsData(res.data);
  //       // }
  //     })
  //     .catch((errors) => {
  //       setLoader(false);
  //     });
  // }

  // async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
  //   let classes: any = await readClasses();
  //   classes = filterData(classes, "label", "value", "", false);
  //   classes.unshift("all");
  //   setClassesData(classes);
  // }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();

    competitions = filterData(competitions, "label", "value", "code");

    setCompetitionsData(competitions);
  }

  // const getCohorts = () => {
  //   if (allData?.childSchoolData?.key == "select_cohort") {
  //     setLoader(true);
  //     readApiData("cohorts")
  //       .then((res) => {
  //         setLoader(false);
  //         setcohortsData(filterData(res, "label", "value"));
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setLoader(false);
  //       });
  //   }
  // };

  // const getGroups = () => {
  //   if (allData?.childSchoolData?.key == "select_group") {
  //     setLoader(true);
  //     readApiData("groups")
  //       .then((res) => {
  //         setLoader(false);
  //         setGroupData(filterData(res, "label", "value"));
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setLoader(false);
  //       });
  //   }
  // };

  // fetch data

  useEffect(() => {
    countryName && readStatesData();
    // countryName && readClassesData();
    readExamCentersData();
    readCompetitionsData();
  }, [countryName]);

  useEffect(() => {
    allData.city && readExamCentersData();
  }, [allData.city]);

  // useEffect(() => {
  //   allData.city && allData.competition && getCohorts();
  //   allData.city && allData.competition && getGroups();
  // }, [allData.city, allData.competition, allData?.childSchoolData]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  // useEffect(() => {
  //   allData.exam_center && readSchoolsData();
  // }, [allData.exam_center]);

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
        handleDropDownChange(e, "competition");
      },
      value: allData.competition,
    },
    // {
    //   type: "select",
    //   label: "Exam Center",
    //   data: dataExamCenters,
    //   value: allData.exam_center,
    //   placeholder: "Exam Center",
    //   onChange: (e: any) => {
    //     // let data = findFromJson(dataExamCenters, e, "name");
    //     handleDropDownChange(e, "exam_center");
    //   },
    // },
    {
      type: "select",
      label: "Exam Date",
      data: examDate,
      value: allData.exam_date,
      placeholder: "Exam Date",
      onChange: (e: any) => {
        // let data = findFromJson(dataExamCenters, e, "name");
        handleDropDownChange(e, "exam_date");
      },
    },
    {
      label: "Series",
      placeholder: "A",
      key: "series",
      type: "input",
      data: comeptitionsData,
      onChange: (e: any) => {
        let val = validateAlpha(e.target.value, true, 1);
        val = val.toUpperCase();
        handleDropDownChange(val, "series");
      },
      value: allData.series,
    },

    {
      label: "State",
      placeholder: "State",
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
      placeholder: "City",
      key: "city",
      type: "select",
      data: citiesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "city", "exam_center");
      },
      value: allData.city,
    },
  ];

  let filters = studentFilters;

  const renderData = useCallback(() => {
    return filters.map((item: any, index) => {
      if (item.hideInput) {
        return;
      }
      let { type, data, label, placeholder, onchange, value, style } = item;
      if (type === "multiselect") {
        return (
          <div key={index}>
            <MultiSelect searchable={true} size="sm" {...item} />
          </div>
        );
      } else if (type === "select") {
        return (
          <div key={index}>
            <Select searchable={true} size="sm" {...item} />
          </div>
        );
      } else {
        return (
          <div key={index}>
            <TextInput {...item} />
          </div>
        );
      }
    });
  }, [filters]);

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
      return <></>;
    }

    const renderTableData = () => {
      return dataExamCenters.map((item: any, index: any) => {
        return (
          <tr className="capitalize" key={index}>
            <td scope="row">
              <input
                type="checkbox"
                checked={Array.isArray(allData.exam_center) && allData.exam_center.includes(item["_id"])}
                onChange={(e: any) => {
                  handleCHeckBOxesStudents(e, item, allData.exam_center, dataExamCenters, "_id", "exam_center");
                }}
              />
            </td>
            <td>{item["name"]}</td>
            <td>{item["_id"]}</td>
            <td>{item["mode"]}</td>
            <td>{item["paper_code"]}</td>
            <td className="text-center">
              {item?.OMR_url ? (
                <a href={item.OMR_url} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
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
                    handleCHeckBOxesStudents(e, false, allData.exam_center, dataExamCenters, "_id", "exam_center");
                  }}
                />
              </th>
              <th scope="col">Center</th>
              <th scope="col">Center Code</th>
              <th scope="col">Exam Type</th>
              <th scope="col">Paper Type</th>
              <th scope="col" className="text-center">
                download
              </th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    );
  }, [allData.studentsData, dataExamCenters, checkIsAllChecked(allData.exam_center, dataExamCenters), themeColor]);

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

  const genrateStudentPdf = () => {
    let newPayload: any = {
      country: countryName || "India",
      competition_code: allData.competition || "",
      state: allData.state,
      city: allData.city,
      exam_date: allData.exam_date,
      exam_center: allData.exam_center,
      series: allData.series,
    };

    setLoader(true);
    omrSheetDownload(newPayload)
      .then((res) => {
        setLoader(false);
        let newData = migrateData(res.data, dataExamCenters, "Exam center", "_id");
        setDataExamCenters([...newData]);
      })
      .catch((errors) => {
        setLoader(false);
      });
  };

  const AdmitCardDownLoad = () => {
    return (
      <div>
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>
        <div className="table-responsive mt-4">{renderUsersTable()}</div>
        {/* <div className="table-responsive  m-4">{renderTable()}</div> */}

        {allData?.exam_center?.length ? (
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
