import { filterData } from "@/helpers/filterData";
import { genratePayload, handleApiData, iterateData } from "@/helpers/getData";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { readApiData, readCities, readCompetitions, readStates } from "@/utilities/API";
import { Checkbox, Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function Reports() {
  const [allData, setAllData] = useState<any>({});
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [pdfLoader, setpdfLoader] = useState<any>(false);

  console.log(allData);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  let themeColor = state?.colorScheme;

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();
    competitions = filterData(competitions, "label", "value", "code");
    setCompetitionsData(competitions);
  }

  let getStudentsListApiData = useTableDataMatrixQuery(
    genratePayload("users", { role: "student", seat_number: null }, undefined, countryName)
  );
  let getStudentsList = iterateData(getStudentsListApiData);
  getStudentsList = handleApiData(getStudentsList);
  getStudentsList = filterData(getStudentsList, "label", "value");

  let statesData = useTableDataMatrixQuery(genratePayload("states", undefined, undefined, countryName));
  statesData = iterateData(statesData);
  statesData = handleApiData(statesData);
  statesData = filterData(statesData, "label", "value");

  let classesData = useTableDataMatrixQuery(genratePayload("classes", undefined, undefined, countryName));
  classesData = iterateData(classesData);
  classesData = handleApiData(classesData);
  classesData = filterData(classesData, "label", "value", undefined, true, "order_code", undefined, true);

  let schoolsData = useTableDataMatrixQuery(
    genratePayload(
      "schools",
      {
        country: countryName || "India",
        city: allData.city,
      },
      undefined,
      countryName
    )
  );

  schoolsData = iterateData(schoolsData);
  schoolsData = handleApiData(schoolsData);
  schoolsData = filterData(schoolsData, "label", "value");

  let groupsData = useTableDataMatrixQuery(
    genratePayload(
      "groups",
      {
        country: countryName || "India",
        city: allData.city,
      },
      undefined,
      countryName
    )
  );
  groupsData = iterateData(groupsData);
  groupsData = handleApiData(groupsData);
  groupsData = filterData(groupsData, "label", "value");

  let citiesData = useTableDataMatrixQuery(genratePayload("cities", { state: allData.state }, "state", countryName));
  citiesData = iterateData(citiesData);
  citiesData = handleApiData(citiesData);
  citiesData = filterData(citiesData, "label", "value");

  let examCenterData = useTableDataMatrixQuery(
    genratePayload(
      "exam_centers",
      {
        country: countryName || "India",
        city: allData.city,
      },
      undefined,
      countryName
    )
  );
  examCenterData = iterateData(examCenterData);
  examCenterData = handleApiData(examCenterData);
  examCenterData = filterData(examCenterData, "label", "value");

  useEffect(() => {
    countryName && readCompetitionsData();
  }, [countryName]);

  let dataObj: any = {
    school: { data: schoolsData, label: "School", key: "select_school" },
    group: { data: groupsData, label: "Group", key: "select_group" },
    examcenter: { data: examCenterData, label: "Exam Center", key: "select_examcenter" },
  };

  const school_group_examCommon = [
    {
      label: "School / Group / Exam Center",
      key: "filterTypeStudent",
      type: "radio",
      options: [
        { label: "School", value: "school", fetch: "" },
        { label: "Group", value: "group", fetch: "" },
        { label: "Exam Center", value: "examcenter", fetch: "" },
      ],

      onChange: (e: any) => {
        let data = dataObj[e];
        allData.childSchoolData = data;
        handleDropDownChange(e, "filterTypeStudent", "schools");
      },
      value: allData.filterTypeStudent || "",
    },
    {
      hideInput: !allData.filterTypeStudent,
      label: allData?.childSchoolData?.label || "Select School",
      key: "select_school",
      style: { maxWidth: "35%", width: "25%" },
      type: "gridview",
      data: allData?.childSchoolData?.data || schoolsData,
      onchange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school");
      },
      value: allData[allData?.childSchoolData?.key || "select_school"],
    },
  ];

  const school_group_filter = [
    {
      label: "School / Group / Exam Center",
      key: "filterTypeStudent",
      type: "radio",
      options: [
        { label: "School", value: "school", fetch: "" },
        { label: "Group", value: "group", fetch: "" },
      ],

      onChange: (e: any) => {
        let data = dataObj[e];
        allData.childSchoolData = data;
        handleDropDownChange(e, "filterTypeStudent", "schools");
      },
      value: allData.filterTypeStudent || "",
    },
    {
      hideInput: !allData.filterTypeStudent,
      label: allData?.childSchoolData?.label || "Select School",
      key: "select_school",
      style: { maxWidth: "35%", width: "25%" },
      type: "gridview",
      data: allData?.childSchoolData?.data || schoolsData,
      onchange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school");
      },
      value: allData[allData?.childSchoolData?.key || "select_school"],
    },
  ];

  const competitionFilter = [
    {
      label: "Competition",
      style: { maxWidth: "35%", width: "30%" },
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition");
      },
      value: allData.competition,
    },
  ];

  const commonJson = [
    {
      label: "State",
      key: "state",
      type: "select",
      style: { maxWidth: "35%", width: "30%" },
      data: statesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      key: "city",
      style: { maxWidth: "35%", width: "30%" },
      type: "select",
      data: citiesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "city", "filterTypeStudent");
      },
      value: allData.city,
    },
  ];

  let classesFilter = [
    {
      label: "class",
      key: "class",
      type: "select",
      style: { maxWidth: "35%", width: "30%" },
      data: classesData,
      onchange: (e: any) => {
        handleDropDownChange(e, "class");
      },
      value: allData.class,
    },
  ];

  let schoolsFilter = [
    {
      label: allData?.childSchoolData?.label || "Select School",
      key: "select_school",
      type: "gridview",
      data: schoolsData || [],
      onchange: (e: any) => {
        handleDropDownChange(e, "select_school");
      },
      value: "select_school",
    },
  ];

  let divisionBreak = [
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

  const filterDataJson: any = [
    { label: "Students List School-group-exam center wise", value: "Students List School-group-exam center wise" },
    {
      label: "Students List School-group-exam center wise with contact details",
      value: "Students List School-group-exam center wise with contact details",
    },
    {
      label: "Students List who are not assigned any exam center",
      value: "Students List who are not assigned any exam center",
    },
    {
      label: "Student count class-wise school-wise for selected competition",
      value: "Student count class-wise school-wise for selected competition",
    },
    { label: "List of Students - worksheet list", value: "List of Students - worksheet list" },
    { label: "GF Students qualified list school-group wise", value: "GF Students qualified list school-group wise" },
    { label: "GF Students Paid list school-group wise", value: "GF Students Paid list school-group wise" },

    {
      label: "Class-section wise count report highlighting the numbers above threshold",
      value: "Class-section wise count report highlighting the numbers above threshold",
    },
    {
      label: "School results",
      value: "School results",
    },
    {
      label: "Medal winners list",
      value: "Medal winners list",
    },
    {
      label: "Scholarship winners list",
      value: "Scholarship winners list",
    },
    {
      label: "School boards",
      value: "School boards",
    },
    {
      label: "GF invites",
      value: "GF invites",
    },
  ];

  let josnObjects: any = {
    "Students List School-group-exam center wise": [...competitionFilter, ...commonJson, ...school_group_examCommon],
    "Students List School-group-exam center wise with contact details": [
      ...competitionFilter,
      ...commonJson,
      ...school_group_examCommon,
    ],
    "Students List who are not assigned any exam center": [...competitionFilter, ...commonJson, ...classesFilter],
    "Student count class-wise school-wise for selected competition": [
      ...competitionFilter,
      ...commonJson,
      ...schoolsFilter,
    ],
    "List of Students - worksheet list": [...competitionFilter, ...commonJson, ...divisionBreak, ...schoolsFilter],
    "GF Students qualified list school-group wise": [...competitionFilter, ...commonJson, ...divisionBreak],
    "GF Students Paid list school-group wise": [...school_group_filter, ...divisionBreak],
    "Class-section wise count report highlighting the numbers above threshold": [...competitionFilter, ...commonJson],
    "School results": [...competitionFilter, ...commonJson, ...divisionBreak],
    "Medal winners list": [...competitionFilter, ...commonJson],
    "Scholarship winners list": [...competitionFilter, ...commonJson],
    "School boards": [...competitionFilter, ...commonJson],
    "GF invites": [...competitionFilter, ...commonJson],
  };

  const handleCHeckBOxes = (e: any, item: any = "", showData = schoolsData) => {
    let checked: any = e.target.checked;
    let data: any = [];
    if (!!item) {
      data = selectCheckBOxData(allData?.schools, checked, item._id, showData, "_id");
    } else {
      data = selectCheckBOxData(allData?.schools, checked, "", showData, "_id");
    }

    allData.schools = data;
    setAllData({ ...allData });
  };

  const renderSchoolsTable = (schoolsData: any, arrKey: any) => {
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
                checked={Array.isArray(allData.schools) && allData.schools.includes(item._id)}
                onChange={(e: any) => {
                  handleCHeckBOxes(e, item, schoolsData);
                }}
              />
            </td>
            <td>{item.name}</td>
            <td>{item.city}</td>
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
          {/* {genratedData.length ? (
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
          )} */}
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
                    handleCHeckBOxes(e, "", schoolsData);
                  }}
                />
              </th>
              <th scope="col">Name</th>
              <th scope="col">City</th>
              <th scope="col" className="text-center">
                download
              </th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    );
  };

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

  const renderFilter = () => {
    return (
      <div className="d-flex justify-content-center">
        <Select
          clearable
          searchable
          placeholder="Report Name"
          nothingFound="No options"
          data={filterDataJson}
          label="Report Name"
          mt="md"
          size="md"
          onChange={(e) => {
            handleDropDownChange(e, "reportname", "all");
          }}
          w={"80%"}
        />
      </div>
    );
  };

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
    let dataToMap = josnObjects[allData.reportname];

    if (!dataToMap || !Array.isArray(dataToMap)) {
      return;
    }

    return dataToMap.map((item: any, index) => {
      if (item.hideInput) {
        return <></>;
      }

      let { type, data, label, placeholder, onchange, value, style, arrKey, checked } = item;
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
      } else if (type == "gridview") {
        if (!data) {
          return <div key={index}></div>;
        }
        return (
          <div key={index} className="w-100">
            {renderSchoolsTable(data, arrKey)}
          </div>
        );
      } else if (type == "checkbox") {
        return (
          <Checkbox key={index} checked={checked} label={label} w={"100%"} mt={"md"} size="md" onChange={onchange} />
        );
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

  return (
    <div className="p-4">
      {renderFilter()}

      <div className="d-flex py-4 flex-wrap gap-4">{renderData()}</div>
    </div>
  );
}

export default Reports;
