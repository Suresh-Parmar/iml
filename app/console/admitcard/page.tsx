"use client";
import {
  admitCardCountData,
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

  const state: any = useSelector((state) => state);
  const countryName = state?.client?.selectedCountry?.name;
  let isStudentFilters = allData.admitCardFilter == "studentWise";

  console.log(allData, "allData allData");

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

  const downloadPdf = (data: any) => {
    // console.log(data);
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

    admitCardCountData(newPayload).then((res) => {
      if (isSchool) {
        downloadPdf(res.data);
      } else {
        let data = genrateDataFormDropDown(res.data);
        setSchoolsDataDropDown(data);
        setSchoolsData(res.data);
      }
    });
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes = await readClasses();
    classes = filterData(classes, "label", "value");
    setClassesData(classes);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();

    competitions = filterData(competitions, "label", "value", "code");

    setCompetitionsData(competitions);
  }

  const getCohorts = () => {
    let payload = {
      collection_name: "cohorts",
      op_name: "find_many",
      filter_var: {
        country: countryName,
        state: allData.state,
        city: allData.city,
        competition_code: allData.competition,
      },
    };
    if (allData?.childSchoolData?.key == "select_cohort") {
      readApiData("cohorts", payload)
        .then((res) => {
          setcohortsData(filterData(res, "label", "value"));
        })
        .catch((error) => console.error(error));
    }
  };

  const getGroups = () => {
    let payload = {
      collection_name: "groups",
      op_name: "find_many",
      filter_var: {
        country: countryName,
        state: allData.state,
        city: allData.city,
        competition_code: allData.competition,
      },
    };

    if (allData?.childSchoolData?.key == "select_group") {
      readApiData("groups", payload)
        .then((res) => {
          setGroupData(filterData(res, "label", "value"));
        })
        .catch((error) => console.error(error));
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
  }, [allData.city, allData.competition, allData?.childSchoolData]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    allData.city && allData.competition && readSchoolsData();
  }, [allData.city, allData.competition]);

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
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      key: "city",
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
      value: allData.competition,
    },
    {
      label: "State",
      key: "state",
      type: "select",
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
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
        let data: any = {
          group: { data: groupsData, label: "Group", key: "select_group" },
          cohort: { data: cohortsData, label: "Cohort", key: "select_cohort" },
          school: { data: schoolsData, label: "School", key: "select_school" },
        };
        data = data[e];
        allData.childSchoolData = data;
        handleDropDownChange(e, "filterTypeStudent");
      },
      value: allData.filterTypeStudent || "",
    },
    {
      label: allData?.childSchoolData?.label || "Select School",
      key: "select_school",
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
            <td>{item.students_count}</td>
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
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    );
  }, [allData.schools, schoolsData, checkIsAllChecked(allData.schools, schoolsData), isStudentFilters]);

  const AdmitCardDownLoad = () => {
    return (
      <div className="m-4">
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>
        <div className="table-responsive mt-4">{renderSchoolsTable()}</div>
        {/* <div className="table-responsive  m-4">{renderTable()}</div> */}
        {allData?.schools?.length && !isStudentFilters ? (
          <div className="btn btn-primary form-control" onClick={() => readSchoolsData(true)}>
            Download admit cards in pdf
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
    </div>
  );
}

export default Page;
