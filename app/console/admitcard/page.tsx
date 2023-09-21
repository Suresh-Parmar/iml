"use client";
import { readApiData, readCities, readClasses, readCompetitions, readSchools, readStates } from "@/utilities/API";
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
  const [classesData, setClassesData] = useState<any>([]);
  const [groupsData, setGroupData] = useState<any>([]);
  const [cohortsData, setcohortsData] = useState<any>([]);

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
    return newData;
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

  async function readSchoolsData(filterBy?: "name" | "city", filterQuery?: string | number) {
    let newPayload = {
      collection_name: "schools",
      op_name: "find_many",
      filter_var: {
        country: countryName || "India",
        state: allData.state,
        city: allData.city,
        affiliation: allData.affiliation,
      },
    };

    let schools: any = await readSchools(filterBy, filterQuery, newPayload);
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

    // readSchoolsData();
    // readCompetitionsData();
    // readClassesData();
    // getCohorts();
  }, [countryName]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    allData.city && allData.affiliation && readSchoolsData("city", allData.city);
  }, [allData.city, allData.affiliation]);

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
      label: "State",
      key: "state",
      type: "select",
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", "all");
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
    {
      label: "Affiliation",
      key: "affiliation",
      type: "radio",
      data: citiesData,
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      onChange: (e: any) => {
        handleDropDownChange(e, "affiliation");
      },
      value: allData.affiliation || "",
    },
  ];

  const renderRadio = (item: any) => {
    const renderInputs = () => {
      return item.options.map((itemChild: any, index: any) => {
        return <Radio value={itemChild.value} label={itemChild.label} />;
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

  const handleCHeckBOxes = (e: any, item?: any) => {
    let checked = e.target.checked;
    let data = [];
    if (!item) {
      data = selectCheckBOxData(allData.schools, checked, false, schoolsData, "name");
    } else {
      data = selectCheckBOxData(allData.schools, checked, item.name, schoolsData, "name");
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
                checked={Array.isArray(allData.schools) && allData.schools.includes(item.name)}
                onChange={(e) => {
                  handleCHeckBOxes(e, item);
                }}
              />
            </td>
            <td>{item.name}</td>
            <td>{item.city}</td>
            <td>{item.address}</td>
            <td>{item.code}</td>
            <td>{item.board}</td>
            <td>{item.affiliation}</td>
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
            <th scope="col">Name</th>
            <th scope="col">City</th>
            <th scope="col">Address</th>
            <th scope="col">Code</th>
            <th scope="col">Board</th>
            <th scope="col">Affiliation</th>
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
    </>
  );
}

export default Page;
