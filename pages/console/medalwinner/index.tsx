import { admitCardCountData, readCities, readCompetitions, readStates } from "@/utilities/API";
import { Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import Loader from "@/components/common/Loader";
import { filterData } from "@/helpers/filterData";
import { sortData } from "@/helpers/sorting";

function Page() {
  const [allData, setAllData] = useState<any>({});
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [pdfLoader, setpdfLoader] = useState<any>(false);
  const [zipUrl, setZipUrl] = useState<any>("");
  const [genratedData, setGenratedData] = useState<any>([]);
  const [order, setOrder] = useState<any>(true);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  let isStudentFilters = allData.admitCardFilter == "studentWise";
  let themeColor = state?.colorScheme;

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

    const newPayload = {
      country: countryName || "India",
      competition_code: allData.competition || "",
      state: allData.state,
      city: allData.city,
    };

    if (isSchool) {
      for (const school of allData.schools) {
        const payload = { ...newPayload, school_name: [school] };
        setpdfLoader(school);

        try {
          const res = await admitCardCountData(payload);
          setpdfLoader(false);

          if (Array.isArray(res.data) && res.data.length > 1) {
            setZipUrl(res.data[res.data.length - 1]?.zip_file);
          }
          genratedData.push(...res.data);
          setGenratedData([genratedData]);
          downloadPdf(genratedData);
        } catch (errors) {
          setpdfLoader(false);
        }
      }
    } else {
      setLoader(true);

      try {
        const res = await admitCardCountData(newPayload);
        setLoader(false);

        if (isSchool) {
          if (Array.isArray(res.data) && res.data.length > 1) {
            setZipUrl(res.data[res.data.length - 1]?.zip_file);
          }
          downloadPdf(res.data);
        } else {
          const data = genrateDataFormDropDown(res.data);
          // setSchoolsDataDropDown(data);
          setSchoolsData(res.data);
        }
      } catch (errors) {
        setLoader(false);
      }
    }
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();
    competitions = filterData(competitions, "label", "value", "code");
    setCompetitionsData(competitions);
  }

  // fetch data

  useEffect(() => {
    countryName && readStatesData();
    readCompetitionsData();
  }, [countryName]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    allData.city && allData.competition && !isStudentFilters && readSchoolsData();
  }, [allData.city, allData.competition, !!isStudentFilters]);

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
  ];

  let filters = filtersSchools;

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

  // const renderData = useCallback(() => {
  const renderData = () => {
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
      return <></>;
    }

    if (!schoolsData.length) {
      return <> No Record Found</>;
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
              {item?.admit_card_url ? (
                <a href={item.admit_card_url} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
              ) : pdfLoader == item.school_name ? (
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
                  checked={checkIsAllChecked(allData.schools, schoolsData)}
                  onChange={(e) => {
                    handleCHeckBOxes(e);
                  }}
                />
              </th>
              <th
                scope="col"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(schoolsData, "school_name", order);
                  setSchoolsData([...data]);
                }}
              >
                School Name
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => {
                  setOrder(!order);
                  let data = sortData(schoolsData, "students_count", order);
                  setSchoolsData([...data]);
                }}
              >
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
  }, [
    allData.schools,
    schoolsData,
    pdfLoader,
    themeColor,
    checkIsAllChecked(allData.schools, schoolsData),
    isStudentFilters,
  ]);

  const genrateStudentPdf = () => {
    let data: any = {
      school: allData.select_school,
      group: allData.select_group,
      cohort: allData.select_cohort,
    };

    let newPayload: any = {
      country: countryName || "India",
      competition_code: allData.competition || "",
      state: allData.state,
      city: allData.city,
      username: allData.studentsData,
      [allData.filterTypeStudent]: data[allData.filterTypeStudent],
    };

    setLoader(true);
    admitCardCountData(newPayload)
      .then((res) => {
        setLoader(false);
        // console.log(res.data);
        if (res.data.admit_card_url) {
          var link = document.createElement("a");
          link.href = res.data.admit_card_url;
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

  const downloadZipConcept = async () => {
    for (let item of genratedData[0]) {
      if (item.admit_card_url) {
        let a = document.createElement("a");
        a.href = item.admit_card_url;
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

  const AdmitCardDownLoad = () => {
    return (
      <div className="m-4">
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>
        <div className="table-responsive mt-4">{renderSchoolsTable()}</div>
        {/* <div className="table-responsive  m-4">{renderTable()}</div> */}
        {allData?.schools?.length && !isStudentFilters && !pdfLoader ? (
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

  return (
    <div className="mx-4 py-5" style={{ maxHeight: "100%", overflow: "auto" }}>
      {AdmitCardDownLoad()}
      <Loader show={loader} />
    </div>
  );
}

export default Page;
