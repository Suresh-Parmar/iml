import {
  downloadMarksSheet,
  readApiData,
  readCities,
  readClasses,
  readCompetitions,
  readSchools,
  readStates,
} from "@/utilities/API";
import { Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import { SingleStudent } from "@/components/admitCard";
import Loader from "@/components/common/Loader";
import { filterData as filterHelper } from "@/helpers/filterData";

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
  const [pdfLoader, setpdfLoader] = useState<any>(false);
  const [genratedData, setGenratedData] = useState<any>([]);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  let isStudentFilters = allData.admitCardFilter == "studentWise";

  const filterData = (data: any[], key: string, val: string, findkey: any = "") => {
    let newData: any[] = [];
    if (Array.isArray(data)) {
      data.forEach((element: any) => {
        element[key] = element.name;
        element[val] = findkey ? element[findkey] : element.name;
        if (element.group) {
          element.groupName = element.group;
          delete element.group;
        }

        if (element.status && element[key] && element[key] != "None") {
          let data = newData.find((elm) => elm[key] == element[key]);

          if (!data) {
            newData.push(element);
          }
        }
      });
    }

    return newData.sort((a: any, b: any) => {
      let fa = a.label.toLowerCase(),
        fb = b.label.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  };

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
        let newDataa = { ...item, ...newItem };
        newData.push(newDataa);
      } else {
        // delete item.admit_card_url;
        newData.push(item);
      }
    });

    return newData;
  };

  const downloadPdf = (data: any) => {
    let newData = migrateData(data, schoolsData, "school_name");
    setSchoolsData(structuredClone(newData));
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

  async function readSchoolsData(isSchool = false) {
    if (pdfLoader) {
      return;
    }

    setGenratedData([]);

    let newPayload: any = {
      country: countryName || "India",
      competition_code: allData.competition || "",
      state: allData.state,
      city: allData.city,
      // affiliation: allData.affiliation,
    };

    if (isSchool) {
      for (const school of allData.schools) {
        const payload = { ...newPayload, school_name: [school] };
        setpdfLoader(school);

        try {
          const res = await downloadMarksSheet(payload);
          setpdfLoader(false);
          let dataObj: any = res.data[0];
          if (!dataObj.school_name) dataObj.school_name = school;
          genratedData.push(dataObj);
          setGenratedData([genratedData]);
          downloadPdf(genratedData);
        } catch (errors) {
          setpdfLoader(false);
        }
      }
    } else {
      setLoader(true);

      downloadMarksSheet(newPayload).then((res) => {
        setLoader(false);

        // let data = genrateDataFormDropDown(res.data);
        // setSchoolsDataDropDown(data);
        setSchoolsData(res.data);
      });
    }
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes = await readClasses();
    classes = filterHelper(classes, "label", "value", "", true, "code");
    setClassesData(classes);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();

    competitions = filterData(competitions, "label", "value", "code");

    setCompetitionsData(competitions);
  }

  const getCohorts = () => {
    if (!isStudentFilters) {
      return;
    }
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

  // const readSchoolGridData = () => {
  //   if (!isStudentFilters) {
  //     return;
  //   }

  //   let payload = {
  //     collection_name: "schools",
  //     op_name: "find_many",
  //     filter_var: {
  //       country: countryName || "India",
  //       city: allData.city,
  //     },
  //   };

  //   setLoader(true);
  //   readApiData("schools", payload)
  //     .then((res) => {
  //       setLoader(false);
  //       setSchoolsDataDropDown(filterData(res, "label", "value"));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setLoader(false);
  //     });
  // };

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
        handleDropDownChange(e, "city", "schools");
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
        let data = dataObj[e];
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

  const renderData = () => {
    // const renderData = useCallback(() => {
    return filters.map((item: any, index) => {
      let { type, data, label, placeholder, onchange, value, style, hideInput } = item;
      if (hideInput) {
        return;
      }
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
              clearable
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
  };
  // }, [filters]);

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

  const renderSchoolsTable = useCallback(() => {
    // const renderSchoolsTable = () => {
    if (isStudentFilters) {
      return <> </>;
    }
    if (!schoolsData.length) {
      return <>No Record Found</>;
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
            <td>{item.students_count}</td>
            <td>
              {item.school_name == pdfLoader ? (
                <div style={{ height: 32 }}> loading... </div>
              ) : item.marksheets_url ? (
                <a href={item.marksheets_url} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
              ) : (
                <span className="material-symbols-outlined">download</span>
              )}
            </td>
          </tr>
        );
      });
    };

    return (
      <table className="table">
        <thead>
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
            <th scope="col">Students Count</th>
            <th scope="col"> download</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    );
  }, [allData.schools, schoolsData, checkIsAllChecked(allData.schools, schoolsData), isStudentFilters, pdfLoader]);

  const AdmitCardDownLoad = () => {
    return (
      <div className="m-4">
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>
        <div className="table-responsive mt-4">{renderSchoolsTable()}</div>
        {/* <div className="table-responsive  m-4">{renderTable()}</div> */}
        {allData?.schools?.length && !isStudentFilters ? (
          <div
            className={`btn btn-primary form-control ${pdfLoader ? "disabled btn-secondary" : ""}`}
            onClick={() => readSchoolsData(true)}
          >
            Download Marksheets
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
    <div className="m-4">
      <div>{renderRadio(uiFilters)}</div>
      {AdmitCardDownLoad()}
      <Loader show={loader} />
    </div>
  );
}

export default Page;
