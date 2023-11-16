import {
  certificateDownload,
  readApiData,
  readCities,
  readClasses,
  readCompetitions,
  readSchools,
  readStates,
  studentDetails,
} from "@/utilities/API";
import { Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import Loader from "@/components/common/Loader";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";

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
  const [loader, setLoader] = useState<any>(false);
  const [studentGridData, setStudentGridData] = useState<any>([]);
  const [zipUrl, setZipUrl] = useState<any>("");

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false);
      }, 4000);
    }
  }, [loader]);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  let isStudentFilters = allData.admitCardFilter == "studentWise";
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

  let migrateData = (data: any[], data1: any[], by: string, isStudent: any = false) => {
    let newData: any[] = [];

    data1.map((item: any) => {
      let newItem = data.find((itemchild: any, i: any) => item[by] == itemchild[by]);
      if (newItem) {
        let newItemData = { ...item, ...newItem };
        newData.push(newItemData);
      } else {
        delete item.certificate_url;
        newData.push(item);
      }
    });

    return newData;
  };

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

  function readSchoolsData(isSchool: any = false) {
    let newPayload: any = {
      country: countryName || "India",
      competition_code: allData.competition || "",
      state: allData.state,
      city: allData.city,
      // affiliation: allData.affiliation,
    };

    if (isSchool) {
      newPayload = { school_name: allData.schools };
    }

    setLoader(true);
    certificateDownload(newPayload)
      .then((res) => {
        setLoader(false);
        if (isSchool) {
          if (Array.isArray(res.data) && res.data.length > 1) {
            setZipUrl(res.data[res.data.length - 1]?.zip_file);
          }
          downloadPdf(res.data);
        } else {
          let data = genrateDataFormDropDown(res.data);
          // setSchoolsDataDropDown(data);
          setSchoolsData(res.data);
        }
      })
      .catch((errors) => {
        setLoader(false);
      });
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes: any = await readClasses();
    classes = filterData(classes, "label", "value", "", true, "code");
    classes.unshift("all");
    setClassesData(classes);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();

    competitions = filterData(competitions, "label", "value", "code");

    setCompetitionsData(competitions);
  }

  const getCohorts = () => {
    if (allData?.childSchoolData?.key == "select_cohort") {
      setLoader(true);
      readApiData("cohorts")
        .then((res) => {
          setLoader(false);
          setcohortsData(filterData(res, "label", "value"));
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        });
    }
  };

  const getGroups = () => {
    if (!isStudentFilters) {
      return;
    }
    if (allData?.childSchoolData?.key == "select_group") {
      setLoader(true);
      readApiData("groups")
        .then((res) => {
          setLoader(false);
          setGroupData(filterData(res, "label", "value"));
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        });
    }
  };

  const readSchoolsDataDropDwon = () => {
    if (!isStudentFilters) {
      return;
    }

    let payload = {
      collection_name: "schools",
      op_name: "find_many",
      filter_var: {
        country: countryName || "India",
        city: allData.city,
      },
    };
    if (allData?.childSchoolData?.key == "select_school") {
      setLoader(true);
      readApiData("schools", payload)
        .then((res) => {
          setLoader(false);
          setSchoolsDataDropDown(filterData(res, "label", "value"));
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        });
    }
  };

  // fetch data

  useEffect(() => {
    countryName && readStatesData();
    countryName && readClassesData();
    readCompetitionsData();
  }, [countryName]);

  useEffect(() => {
    allData.city && allData.competition && getCohorts();
    allData.city && allData.competition && getGroups();
    allData.city && allData.competition && readSchoolsDataDropDwon();
  }, [allData.city, allData.competition, allData?.childSchoolData?.key]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    allData.city && allData.competition && readSchoolsData();
  }, [allData.city, allData.competition]);

  let dataObj: any = {
    group: { data: groupsData, label: "Group", key: "select_group" },
    cohort: { data: cohortsData, label: "Cohort", key: "select_cohort" },
    school: { data: schoolsDataDropDown, label: "School", key: "select_school" },
  };

  useEffect(() => {
    let data = dataObj[allData.filterTypeStudent];
    allData.childSchoolData = data;
    setAllData({ ...allData });
  }, [groupsData, cohortsData, schoolsDataDropDown]);

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

  const filtersSchools = [
    {
      label: "Competition",
      style: { maxWidth: "35%", width: "20%" },
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition");
      },
      value: allData.competition,
    },
    {
      label: "State",
      key: "state",
      type: "select",
      style: { maxWidth: "35%", width: "20%" },
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      key: "city",
      style: { maxWidth: "35%", width: "20%" },
      type: "select",
      data: citiesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "city");
      },
      value: allData.city,
    },
    // {
    //   label: "Affiliation",
    //   key: "affiliation",
    //   type: "radio",
    //   data: citiesData,
    //   options: [
    //     { label: "Yes", value: "yes" },
    //     { label: "No", value: "no" },
    //   ],
    //   onChange: (e: any) => {
    //     handleDropDownChange(e, "affiliation");
    //   },
    //   value: allData.affiliation || "",
    // },
  ];

  const studentFilters = [
    {
      label: "Competition",
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition");
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.competition,
    },
    {
      label: "State",
      key: "state",
      type: "select",
      style: { maxWidth: "35%", width: "20%" },
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      style: { maxWidth: "35%", width: "20%" },
      key: "city",
      type: "select",
      data: citiesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "city");
      },
      value: allData.city,
    },
    {
      label: "School / group / cohort",
      key: "filterTypeStudent",
      type: "radio",
      options: [
        { label: "School", value: "school", fetch: "" },
        { label: "Group", value: "group", fetch: "" },
        { label: "Cohort", value: "cohort", fetch: "" },
      ],
      onChange: (e: any) => {
        let data: any = dataObj[e];
        allData.childSchoolData = data;
        handleDropDownChange(e, "filterTypeStudent");
      },
      value: allData.filterTypeStudent || "",
    },
    {
      hideInput: !allData.filterTypeStudent,
      label: allData?.childSchoolData?.label || "Select School",
      key: "select_school",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: allData?.childSchoolData?.data || schoolsDataDropDown,
      onchange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school");
      },
      value: allData[allData?.childSchoolData?.key || "select_school"],
    },
    {
      label: "Select Class",
      key: "select_class",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: classesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "select_class");
      },
      value: allData.select_class,
    },
  ];

  let filters = isStudentFilters ? studentFilters : filtersSchools;

  const renderRadio = (item: any) => {
    const renderInputs = () => {
      return item.options.map((itemChild: any, index: any) => {
        return <Radio key={index} value={itemChild.value} label={itemChild.label} />;
      });
    };

    return (
      <Radio.Group {...item}>
        <Group mt="xs">{renderInputs()}</Group>
      </Radio.Group>
    );
  };

  const renderData = useCallback(() => {
    return filters.map((item: any, index) => {
      if (item.hideInput) {
        return;
      }
      let { type, data, label, placeholder, onchange, value, style } = item;
      if (type === "multiselect") {
        return (
          <div key={index} style={{ maxWidth: "15%", ...style }}>
            <MultiSelect
              searchable={true}
              size="sm"
              w="100%"
              onChange={onchange}
              value={value || ""}
              data={data}
              label={label}
              placeholder={placeholder || label}
            />
          </div>
        );
      } else if (type == "radio") {
        return <div key={index}>{renderRadio(item)}</div>;
      } else {
        return (
          <div key={index} style={{ maxWidth: "15%", ...style }}>
            <Select
              searchable={true}
              size="sm"
              w="100%"
              onChange={onchange}
              value={value || ""}
              data={data}
              label={label}
              placeholder={placeholder || label}
            />
          </div>
        );
      }
    });
  }, [filters]);

  const handleCHeckBOxes = (e: any, item: any = "") => {
    let checked: any = e.target.checked;
    let data: any = [];
    if (!!item) {
      data = selectCheckBOxData(allData?.schools, checked, item.school_name, schoolsData, "school_name");
    } else {
      data = selectCheckBOxData(allData?.schools, checked, "", schoolsData, "school_name");
    }

    allData.schools = data;
    setAllData({ ...allData });
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

  const renderSchoolsTable = useCallback(() => {
    // const renderSchoolsTable = () => {
    if (!schoolsData.length || isStudentFilters) {
      return <></>;
    }

    const renderTableData = () => {
      return schoolsData.map((item: any, index: any) => {
        return (
          <tr className="capitalize" key={index}>
            <td scope="row">
              <input
                type="checkbox"
                checked={Array.isArray(allData.schools) && allData.schools.includes(item.school_name)}
                onChange={(e: any) => {
                  handleCHeckBOxes(e, item);
                }}
              />
            </td>
            <td>{item.school_name}</td>
            <td className="text-center">{item.students_count}</td>
            <td className="text-center">
              {item?.certificate_url ? (
                <a href={item.certificate_url} target="_blank">
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
        <div className="d-flex justify-content-between px-4">
          <span></span>
          {zipUrl && (
            <a href={zipUrl} target="_blank">
              <span className="material-symbols-outlined text-success">folder_zip</span>
            </a>
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
                  checked={checkIsAllChecked(allData.schools, schoolsData)}
                  onChange={(e) => {
                    handleCHeckBOxes(e);
                  }}
                />
              </th>
              <th scope="col">School Name</th>
              <th scope="col" className="text-center">
                Students Count
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
  }, [allData.schools, schoolsData, themeColor, checkIsAllChecked(allData.schools, schoolsData), isStudentFilters]);

  const renderUsersTable = useCallback(() => {
    // const renderSchoolsTable = () => {
    if (!studentGridData.length || !isStudentFilters) {
      return <></>;
    }

    const renderTableData = () => {
      return studentGridData.map((item: any, index: any) => {
        return (
          <tr className="capitalize" key={index}>
            <td scope="row">
              <input
                type="checkbox"
                checked={Array.isArray(allData.studentsData) && allData.studentsData.includes(item["Registration No"])}
                onChange={(e: any) => {
                  handleCHeckBOxesStudents(
                    e,
                    item,
                    allData.studentsData,
                    studentGridData,
                    "Registration No",
                    "studentsData"
                  );
                }}
              />
            </td>
            <td>{item["Student Name"]}</td>
            <td>{item["School"]}</td>
            <td>{item["Registration No"]}</td>
            <td>{item["Seat No"]}</td>
            <td>{item["Division"]}</td>
            <td>{item["Group"]}</td>
            {/* <td className="text-center">
              {item?.certificate_url ? (
                <a href={item.certificate_url} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
              ) : (
                <span className="material-symbols-outlined text-secondary">download</span>
              )}
            </td> */}
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
                  checked={checkIsAllChecked(allData.studentsData, studentGridData)}
                  onChange={(e: any) => {
                    handleCHeckBOxesStudents(
                      e,
                      false,
                      allData.studentsData,
                      studentGridData,
                      "Registration No",
                      "studentsData"
                    );
                  }}
                />
              </th>
              <th scope="col">Student Name</th>
              <th scope="col">School</th>
              <th scope="col">Registration No</th>
              <th scope="col">Seat No</th>
              <th scope="col">Division</th>
              <th scope="col">Group</th>
              {/* <th scope="col" className="text-center">
                download
              </th> */}
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    );
  }, [
    allData.studentsData,
    studentGridData,
    checkIsAllChecked(allData.studentsData, studentGridData),
    isStudentFilters,
    themeColor,
  ]);

  // let downloadPdfstudent = (data: any, allData: any, setALlData: any, key: any = "") => {
  //   let newData = migrateData(data, allData, key, true);
  //   console.log(newData, "newData");
  //   setALlData([...newData]);
  // };

  const genrateStudentPdf = () => {
    setLoader(true);
    certificateDownload({ username: allData.studentsData })
      .then((res) => {
        setLoader(false);
        // console.log(res.data);
        if (res.data.certificate_url) {
          var link = document.createElement("a");
          link.href = res.data.certificate_url;
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((errors) => {
        setLoader(false);
      });
  };

  const AdmitCardDownLoad = () => {
    return (
      <div className="m-4">
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>
        <div className="table-responsive mt-4">{renderSchoolsTable()}</div>
        <div className="table-responsive mt-4">{renderUsersTable()}</div>
        {/* <div className="table-responsive  m-4">{renderTable()}</div> */}
        {allData?.schools?.length && !isStudentFilters ? (
          <div className="btn btn-primary form-control" onClick={() => readSchoolsData(true)}>
            Generate PDF
          </div>
        ) : (
          ""
        )}
        {allData?.studentsData?.length && isStudentFilters ? (
          <div className="btn btn-primary form-control" onClick={() => genrateStudentPdf()}>
            Generate PDF
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const uiFilters = {
    label: "Filter By",
    key: "",
    type: "radio",
    options: [
      { label: "School Wise", value: "schoolWise" },
      { label: "Student Wise", value: "studentWise" },
    ],
    onChange: (e: any) => {
      handleDropDownChange(e, "admitCardFilter");
    },
    value: allData.admitCardFilter || "schoolWise",
  };

  return (
    <div className="mx-4 py-5" style={{ maxHeight: "100%", overflow: "auto" }}>
      <div>{renderRadio(uiFilters)}</div>
      {AdmitCardDownLoad()}
      <Loader show={loader} />
    </div>
  );
}

export default Page;
