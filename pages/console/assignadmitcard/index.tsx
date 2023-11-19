import { handleDropDownChange } from "@/helpers/dateHelpers";
import { filterData } from "@/helpers/filterData";
import { iterateData } from "@/helpers/getData";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function Assignadmitcard() {
  const [allData, setAllData] = useState<any>({});
  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;

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

  let schoolsData = useTableDataMatrixQuery(genratePayload("schools"));
  schoolsData = iterateData(schoolsData);
  schoolsData = handleApiData(schoolsData);
  schoolsData = filterData(schoolsData, "label", "value");

  let groupsapiData = useTableDataMatrixQuery(genratePayload("groups"));
  groupsapiData = iterateData(groupsapiData);
  groupsapiData = handleApiData(groupsapiData);
  groupsapiData = filterData(groupsapiData, "label", "value");

  let cohortsapiData = useTableDataMatrixQuery(genratePayload("cohorts"));
  cohortsapiData = iterateData(cohortsapiData);
  cohortsapiData = handleApiData(cohortsapiData);
  cohortsapiData = filterData(cohortsapiData, "label", "value");

  let boartTypeApiData = useTableDataMatrixQuery(genratePayload("boards"));
  boartTypeApiData = iterateData(boartTypeApiData);
  boartTypeApiData = handleApiData(boartTypeApiData);
  boartTypeApiData = filterData(boartTypeApiData, "label", "value", "board_type", true, "board_type", "board_type");

  let examCentersData = useTableDataMatrixQuery(
    genratePayload("exam_centers", { examdate: allData.exam_date }, "examdate")
  );
  examCentersData = iterateData(examCentersData);
  examCentersData = handleApiData(examCentersData);
  examCentersData = filterData(examCentersData, "label", "value");

  let dataObj: any = {
    group: { data: groupsapiData, label: "Group", key: "select_group" },
    cohort: { data: cohortsapiData, label: "Cohort", key: "select_cohort" },
    school: { data: schoolsData, label: "School", key: "select_school" },
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
      label: allData?.childSchoolData?.label || "Select School",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: allData?.childSchoolData?.data || ["schoolsDataDropDown"],
      onchange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school", allData, setAllData);
      },
      value: allData[allData?.childSchoolData?.key || "select_school"],
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
    <div className="m-4">
      <div className="d-flex flex-wrap gap-4">{renderData()}</div>
    </div>
  );
}

export default Assignadmitcard;
