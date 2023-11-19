import { handleDropDownChange } from "@/helpers/dateHelpers";
import { Group, MultiSelect, Radio, Select } from "@mantine/core";
import React, { useState } from "react";

function Assignadmitcard() {
  const [allData, setAllData] = useState<any>({});

  let dataObj: any = {
    group: { data: ["groupsData"], label: "Group", key: "select_group" },
    cohort: { data: ["cohortsData"], label: "Cohort", key: "select_cohort" },
    school: { data: ["schoolsDataDropDown"], label: "School", key: "select_school" },
  };

  let filters = [
    {
      label: "Competition",
      type: "select",
      data: ["comeptitionsData"],
      onchange: (e: any) => {
        handleDropDownChange(e, "competition", allData, setAllData);
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.competition,
    },
    {
      label: "Exam Date",
      type: "select",
      data: ["comeptitionsData exam Date"],
      onchange: (e: any) => {
        handleDropDownChange(e, "exam_date", allData, setAllData);
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.exam_date,
    },
    {
      label: "State",
      type: "select",
      style: { maxWidth: "35%", width: "20%" },
      data: ["statesData"],
      onchange: (e: any) => {
        handleDropDownChange(e, "state", allData, setAllData, "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      style: { maxWidth: "35%", width: "20%" },
      type: "select",
      data: ["citiesData"],
      onchange: (e: any) => {
        handleDropDownChange(e, "city", allData, setAllData);
      },
      value: allData.city,
    },
    {
      label: "Exam Center",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: ["examcenter"],
      onchange: (e: any) => {
        handleDropDownChange(e, "examcenter", allData, setAllData);
      },
      value: allData.examcenter,
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
      data: ["BoardType"],
      onchange: (e: any) => {
        handleDropDownChange(e, "boardtype", allData, setAllData);
      },
      value: allData?.boardtype,
    },
    {
      label: "Class",
      style: { maxWidth: "35%", width: "25%" },
      type: "select",
      data: ["classesData"],
      onchange: (e: any) => {
        handleDropDownChange(e, "class", allData, setAllData);
      },
      value: allData.class,
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
