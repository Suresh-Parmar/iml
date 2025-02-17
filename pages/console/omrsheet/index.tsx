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
import { sortData } from "@/helpers/sorting";

function Page() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [classesData, setClassesData] = useState<any>([]);
  const [dataExamCenters, setDataExamCenters] = useState<any>([]);
  const [filteredDataExamCenter, setFilteredDataExamCenter] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [examDate, setExamDate] = useState<any>([]);
  const [genratedData, setGenratedData] = useState<any>([]);
  const [pdfLoader, setpdfLoader] = useState<any>(false);
  const [order, setOrder] = useState<any>(true);

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

  async function readExamCentersData() {
    let payload: any = {
      collection_name: "exam_centers",
      op_name: "find_many",
      filter_var: {
        city: allData.city,
        country: countryName || "India",
      },
    };

    if (allData.competition) {
      payload.filter_var.competition = allData.competition;
    }

    setLoader(true);
    let examCentersData: any = await readExamCenters("city", allData.city, payload);
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

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();

    competitions = filterData(competitions, "label", "value", "code");

    setCompetitionsData(competitions);
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    setLoader(true);
    let classes: any = await readClasses();
    setLoader(false);
    classes = filterData(classes, "label", "value", "code", true, "order_code", undefined, true);
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
    (allData.city || allData.competition) && readExamCentersData();
  }, [allData.city, allData.competition]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

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
        handleDropDownChange(e, "competition", "all");
      },
      value: allData.competition,
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
      label: "State",
      placeholder: "State",
      key: "state",
      type: "select",
      data: statesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state || null,
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
      value: allData.city || null,
    },
    {
      label: "Select Class",
      key: "select_class",
      type: "select",
      data: classesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "select_class");
      },
      placeholder: "Class",
      value: allData.select_class || null,
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
      value: allData.series || "",
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
            <Select clearable searchable={true} size="sm" {...item} />
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
              {item?.OMR_url ? (
                <a href={item.OMR_url} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
              ) : pdfLoader == item.exam_center_id ? (
                "loading"
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
                  let data = sortData(dataExamCenters, "exam_center_id", order);
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
  }, [allData, pdfLoader, dataExamCenters, checkIsAllChecked(allData.exam_center, dataExamCenters), themeColor]);

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

  const genrateStudentPdf = async () => {
    if (pdfLoader) {
      return;
    }

    if (!allData.series) {
      alert("Please Type series");
    }
    setGenratedData([]);

    let singleCompetition = findFromJson(comeptitionsData, allData.competition, "value");

    let newPayload: any = {
      country: countryName || "India",
      competition_code: allData.competition || "",
      competition: singleCompetition?.name || "",
      state: allData.state,
      city: allData.city,
      exam_date: allData.exam_date,
      series: allData.series,
    };
    // exam_center: allData.exam_center,

    if (allData.select_class && allData.select_class != "all") {
      newPayload.class = allData.select_class;
    }

    for (const exam_center of allData.exam_center) {
      setpdfLoader(exam_center);
      newPayload.exam_center = [exam_center];
      let response: any = await omrSheetDownload(newPayload);
      setpdfLoader(false);

      let data = response.data;

      if (Array.isArray(data)) {
        genratedData.push(...data);
        setGenratedData([...genratedData]);
        let newData = migrateData(genratedData, dataExamCenters, "Exam center", "exam_center_id");

        setDataExamCenters([...newData]);
      }
    }
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
