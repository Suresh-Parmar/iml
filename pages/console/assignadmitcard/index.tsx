import { handleDropDownChange } from "@/helpers/dateHelpers";
import { filterData } from "@/helpers/filterData";
import { iterateData } from "@/helpers/getData";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function Assignadmitcard() {
  const [allData, setAllData] = useState<any>({});
  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;
  let themeColor = state?.colorScheme;

  const genratePayload = (collection: string, filter?: any, required?: string) => {
    if (required) {
      if (!filter[required]) {
        return "";
      }
    }

    let obj: any = {
      collection_name: collection,
      filter_var: {
        country: countryName,
        status: true,
      },
      op_name: "find_many",
    };

    if (filter) {
      obj.filter_var = { ...obj.filter_var, ...filter };
    }

    return obj;
  };

  let handleApiData = (data: any) => {
    if (Array.isArray(data)) {
      return structuredClone(data);
    }
    return [];
  };

  let competitionData = useTableDataMatrixQuery(genratePayload("competitions"));
  competitionData = iterateData(competitionData);
  competitionData = handleApiData(competitionData);
  competitionData = filterData(competitionData, "label", "value", "code");

  let stateApiData = useTableDataMatrixQuery(genratePayload("states"));
  stateApiData = iterateData(stateApiData);
  stateApiData = handleApiData(stateApiData);
  stateApiData = filterData(stateApiData, "label", "value");

  let cityApiData = useTableDataMatrixQuery(genratePayload("cities", { state: allData.state }, "state"));
  cityApiData = iterateData(cityApiData);
  cityApiData = handleApiData(cityApiData);
  cityApiData = filterData(cityApiData, "label", "value");

  let examDateData = useTableDataMatrixQuery(genratePayload("exam_centers"));
  examDateData = iterateData(examDateData);
  examDateData = handleApiData(examDateData);
  examDateData = filterData(examDateData, "label", "value", "examdate", true, "examdate", "examdate");

  let classApiData = useTableDataMatrixQuery(genratePayload("classes"));
  classApiData = iterateData(classApiData);
  classApiData = handleApiData(classApiData);
  classApiData = filterData(classApiData, "label", "value", undefined, true, "code");
  classApiData = [{ value: undefined, label: "Select" }, ...classApiData];

  let schoolsData = useTableDataMatrixQuery(genratePayload("schools", { city: allData.second_city }, "city"));
  schoolsData = iterateData(schoolsData);
  schoolsData = handleApiData(schoolsData);
  schoolsData = filterData(schoolsData, "label", "value");

  let groupsapiData = useTableDataMatrixQuery(genratePayload("groups", { city: allData.second_city }, "city"));
  groupsapiData = iterateData(groupsapiData);
  groupsapiData = handleApiData(groupsapiData);
  groupsapiData = filterData(groupsapiData, "label", "value");

  let cohortsapiData = useTableDataMatrixQuery(genratePayload("cohorts", { city: allData.second_city }, "city"));
  cohortsapiData = iterateData(cohortsapiData);
  cohortsapiData = handleApiData(cohortsapiData);
  cohortsapiData = filterData(cohortsapiData, "label", "value");

  let boartTypeApiData = useTableDataMatrixQuery(genratePayload("boards"));
  boartTypeApiData = iterateData(boartTypeApiData);
  boartTypeApiData = handleApiData(boartTypeApiData);
  boartTypeApiData = filterData(boartTypeApiData, "label", "value", "board_type", true, "board_type", "board_type");

  let getStudentsList = useTableDataMatrixQuery(
    genratePayload("users", {
      role: "student",
      city: allData.city,
      school_name: allData.select_school,
      class_id: allData.class,
      competition_code: allData.competition,
      seat_number: null,
    })
  );
  getStudentsList = iterateData(getStudentsList);
  getStudentsList = handleApiData(getStudentsList);
  getStudentsList = filterData(getStudentsList, "label", "value");

  let examCentersData = useTableDataMatrixQuery(
    genratePayload("exam_centers", { examdate: allData.exam_date }, "examdate")
  );
  examCentersData = iterateData(examCentersData);
  examCentersData = handleApiData(examCentersData);

  examCentersData = filterData(examCentersData, "label", "value", "_id");

  let dataObj: any = {
    group: { objKey: "group", data: groupsapiData, label: "Group", key: "select_group" },
    cohort: { objKey: "cohort", data: cohortsapiData, label: "Cohort", key: "select_cohort" },
    school: { objKey: "school", data: schoolsData, label: "School", key: "select_school" },
  };

  let filters = [
    {
      label: "Competition",
      type: "select",
      data: competitionData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition", allData, setAllData);
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.competition || "",
    },
    {
      label: "Exam Date",
      type: "select",
      data: examDateData,
      onchange: (e: any) => {
        handleDropDownChange(e, "exam_date", allData, setAllData, "examcenter");
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.exam_date || "",
    },
    {
      label: "State",
      type: "select",
      style: { maxWidth: "35%", width: "20%" },
      data: stateApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state", allData, setAllData, "city");
      },
      value: allData.state || "",
    },
    {
      label: "City",
      style: { maxWidth: "35%", width: "20%" },
      type: "select",
      data: cityApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "city", allData, setAllData);
      },
      value: allData.city || "",
    },
    {
      label: "Exam Center",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: examCentersData,
      onchange: (e: any) => {
        handleDropDownChange(e, "examcenter", allData, setAllData);
      },
      value: allData.examcenter || "",
    },
    { type: "sec" },
    {
      label: "School / Group / Cohort",
      type: "radio",
      options: [
        { label: "School", value: "school", fetch: "" },
        { label: "Group", value: "group", fetch: "" },
        { label: "Cohort", value: "cohort", fetch: "" },
      ],
      onChange: (e: any) => {
        let data = dataObj[e];
        allData.childSchoolData = data;
        handleDropDownChange(e, "filterTypeStudent", allData, setAllData);
      },
      value: allData.filterTypeStudent || "",
    },
    {
      hideInput: !allData.filterTypeStudent,
      label: "City",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: cityApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "second_city", allData, setAllData);
      },
      value: allData.second_city || "",
    },
    {
      hideInput: allData?.childSchoolData?.key != "select_school",
      label: "Board Type",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: boartTypeApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "boardtype", allData, setAllData);
      },
      value: allData?.boardtype,
    },
    {
      hideInput: !allData.filterTypeStudent,
      label: allData?.childSchoolData?.label || "Select School",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      selectDataFrom: dataObj,
      data: allData?.childSchoolData?.data || ["schoolsDataDropDown"],
      onchange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school", allData, setAllData);
      },
      value: allData[allData?.childSchoolData?.key || "select_school"],
    },
    {
      hideInput: !allData.filterTypeStudent,
      label: "Class",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: classApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "class", allData, setAllData);
      },
      value: allData.class || "",
    },
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

  // const renderData = useCallback(() => {

  // console.log(dataObj[allData?.childSchoolData?.objKey].data);

  const renderData = () => {
    return filters.map((item: any, index) => {
      if (item.hideInput) {
        return;
      }
      let { type, data, label, placeholder, onchange, value, style, selectDataFrom } = item;

      if (selectDataFrom) {
        let objKey = allData?.childSchoolData?.objKey;
        data = selectDataFrom[objKey].data;
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
      } else if (type == "sec") {
        return <div key={index} style={{ width: "100%", background: "black", height: "2px" }} />;
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

  const assignNewAdmitCard = () => {
    let data: any = {
      group: allData.select_group,
      cohort: allData.select_cohort,
      school: allData.select_school,
    };

    let payload: any = {
      competition_code: allData.competition,
      examcenter: allData.examcenter,
      exam_date: allData.exam_date,
      city: allData.city,
      state: allData.state,
      boardtype: allData.boardtype,
      class: allData.class,
      students: allData.studentsList,
    };

    if (data[allData?.filterTypeStudent]) {
      payload[allData.filterTypeStudent] = data[allData.filterTypeStudent];
    }

    console.log(payload);
  };

  const renderUsersTable = () => {
    if (!getStudentsList.length) {
      return <></>;
    }

    const renderTableData = () => {
      return getStudentsList.map((item: any, index: any) => {
        return (
          <tr className="capitalize" key={index}>
            <td scope="row">
              <input
                type="checkbox"
                checked={Array.isArray(allData.studentsList) && allData.studentsList.includes(item["_id"])}
                onChange={(e: any) => {
                  handleCHeckBOxesStudents(e, item, allData.studentsList, getStudentsList, "_id", "studentsList");
                }}
              />
            </td>
            <td>{item["_id"]}</td>
            <td>{item["name"]}</td>
            <td>{item["school_name"]}</td>
            <td className="text-center">{item["class_code"]}</td>
            <td>{item["state"]}</td>
            <td>{item["city"]}</td>
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
                  checked={checkIsAllChecked(allData.studentsList, getStudentsList)}
                  onChange={(e: any) => {
                    handleCHeckBOxesStudents(e, false, allData.studentsList, getStudentsList, "_id", "studentsList");
                  }}
                />
              </th>
              <th scope="col">Reg No.</th>
              <th scope="col">Name</th>
              <th scope="col">School</th>
              <th scope="col" className="text-center">
                Class
              </th>
              <th scope="col">State</th>
              <th scope="col">City</th>
              {/* <th scope="col" className="text-center">
                download
              </th> */}
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="m-4">
      <div className="d-flex flex-wrap gap-4">{renderData()}</div>
      <div>{renderUsersTable()}</div>
      {allData?.studentsList?.length ? (
        <div className="btn btn-primary form-control" onClick={() => assignNewAdmitCard()}>
          Assign Admit Card
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Assignadmitcard;
