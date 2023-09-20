"use client";
import { readApiData, readCities, readClasses, readCompetitions, readSchools, readStates } from "@/utilities/API";
import { MultiSelect, Select } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [classesData, setClassesData] = useState<any>([]);
  const [groupsData, setGroupData] = useState<any>([]);
  const [cohortsData, setcohortsData] = useState<any>([]);

  const state: any = useSelector((state) => state);
  const countryName = state?.client?.selectedCountry?.name;

  const filterData = (data: any[], key: string, val: string) => {
    let newData: any[] = [];
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

    return newData;
  };

  // fetch data

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    let states = await readStates(filterBy, filterQuery);
    states = filterData(states, "label", "value");
    setStatesData(states);
  }

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: any[];
    if (filterBy && filterQuery) {
      cities = await readCities(filterBy, filterQuery);
    } else {
      cities = await readCities();
    }
    cities = filterData(cities, "label", "value");
    setCitiesData(cities);
  }

  async function readSchoolsData(filterBy?: "name" | "city", filterQuery?: string | number) {
    let schools: any;
    if (filterBy && filterQuery) {
      schools = await readSchools(filterBy, filterQuery);
    } else {
      schools = await readSchools();
    }
    schools = filterData(schools, "label", "value");

    setSchoolsData(schools);
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes = await readClasses();
    classes = filterData(classes, "label", "value");
    setClassesData(classes);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();
    competitions = filterData(competitions, "label", "value");

    setCompetitionsData(competitions);
  }

  const getCohorts = () => {
    readApiData("cohorts")
      .then((res) => {
        console.log(res, "resres");
        setcohortsData(filterData(res, "label", "value"));
      })
      .catch((error) => console.error(error));
  };

  const getGroups = () => {
    readApiData("groups")
      .then((res) => {
        setGroupData(filterData(res, "label", "value"));
      })
      .catch((error) => console.error(error));
  };

  // fetch data

  useEffect(() => {
    countryName && readStatesData();
    readCitiesData();
    readSchoolsData();
    readCompetitionsData();
    readClassesData();
    getCohorts();
  }, [countryName]);

  const handleDropDownChange = (e: any, key: any) => {
    setAllData({ ...allData, [key]: e });
  };

  const filters = [
    {
      label: "State",
      key: "state",
      type: "select",
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state");
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
      label: "School",
      key: "school",
      type: "multiselect",
      data: schoolsData,
      style: { maxWidth: "30%" },
      onchange: (e: any) => {
        handleDropDownChange(e, "school");
      },
      value: allData.school,
    },
    {
      label: "Class",
      key: "class",
      type: "multiselect",
      data: classesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "class");
      },
      value: allData.class,
    },
    {
      label: "Comeptitions",
      key: "comeptitions",
      data: comeptitionsData,
      type: "multiselect",
      onchange: (e: any) => {
        handleDropDownChange(e, "comeptitions");
      },
      value: allData.comeptitions,
    },
    {
      label: "Cohort",
      key: "cohort",
      data: cohortsData,
      type: "multiselect",
      onchange: (e: any) => {
        handleDropDownChange(e, "cohort");
      },
      value: allData.cohort,
    },
    {
      label: "Group",
      key: "group",
      data: groupsData,
      type: "multiselect",
      onchange: (e: any) => {
        handleDropDownChange(e, "group");
      },
      value: allData.group,
    },
  ];

  const renderData = () => {
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
  };

  const renderTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              <input type="checkbox" />
            </th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">
              <input type="checkbox" />
            </td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td scope="row">
              <input type="checkbox" />
            </td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td scope="row">
              <input type="checkbox" />
            </td>
            <td>Larry the Bird</td>
            <td>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-4 m-4">{renderData()}</div>
      <div className="table-responsive  m-4">{renderTable()}</div>
    </>
  );
}

export default Page;
