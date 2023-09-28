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

function Page() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  // const [classesData, setClassesData] = useState<any>([]);
  // const [groupsData, setGroupData] = useState<any>([]);
  // const [cohortsData, setcohortsData] = useState<any>([]);

  console.log(allData, "allData");

  const state: any = useSelector((state) => state);
  const countryName = state?.client?.selectedCountry?.name;

  const filterData = (data: any[], key: string, val: string) => {
    let newData: any[] = [];
    if (Array.isArray(data)) {
      data.forEach((element: any) => {
        element[key] = element.name;
        element[val] = element.name;
        if (element.group) {
          element.groupName = element.group;
          delete element.group;
        }
        if (element.status) {
          newData.push(element);
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

  console.log(allData, "allData");

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

  function readSchoolsData(isSchool: any = false) {
    let newPayload: any = {
      country: countryName || "India",
      competition: allData.competition || "",
      state: allData.state,
      city: allData.city,
      affiliation: allData.affiliation,
    };

    if (isSchool) {
      newPayload = { school_name: [allData.schools] };
    }

    console.log(newPayload, "newPayload");

    admitCardCountData(newPayload).then((res) => {
      isSchool ? console.log(res, "newPayload") : setSchoolsData(res.data);
    });
  }

  // async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
  //   let classes = await readClasses();
  //   classes = filterData(classes, "label", "value");
  //   setClassesData(classes);
  // }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();
    competitions = filterData(competitions, "label", "value");

    setCompetitionsData(competitions);
  }

  // const getCohorts = () => {
  //   readApiData("cohorts")
  //     .then((res) => {
  //       setcohortsData(filterData(res, "label", "value"));
  //     })
  //     .catch((error) => console.error(error));
  // };

  // const getGroups = () => {
  //   readApiData("groups")
  //     .then((res) => {
  //       setGroupData(filterData(res, "label", "value"));
  //     })
  //     .catch((error) => console.error(error));
  // };

  // fetch data

  useEffect(() => {
    countryName && readStatesData();

    // readSchoolsData();
    readCompetitionsData();
    // readClassesData();
    // getCohorts();
  }, [countryName]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    allData.city && readSchoolsData();
  }, [allData.city]);

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

  const filters = [
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
        handleDropDownChange(e, "city", "affiliation");
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
    if (!schoolsData.length) {
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
  }, [allData.schools, schoolsData, checkIsAllChecked(allData.schools, schoolsData)]);

  return (
    <>
      <div className="d-flex flex-wrap gap-4 m-4">{renderData()}</div>
      <div className="table-responsive  m-4">{renderSchoolsTable()}</div>
      {/* <div className="table-responsive  m-4">{renderTable()}</div> */}
      <div onClick={() => readSchoolsData(true)}>get Data</div>
    </>
  );
}

export default Page;
