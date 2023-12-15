import React, { useState } from "react";
import { ExamCenterFilter, SchoolEmail, StudentEmail, TeacherFIleters } from "@/components/bulkEmail";
import { Group, Radio } from "@mantine/core";

function BulkEmail() {
  const [allData, setAllData] = useState<any>({});
  let isStudentFilters = allData.admitCardFilter == "studentWise";

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

  const uiFilters = {
    label: "Filter By",
    key: "",
    type: "radio",
    options: [
      { label: "Student", value: "studentWise" },
      { label: "Exam Centers", value: "examCenterWise" },
      { label: "Teachers", value: "teachersWise" },
    ],
    onChange: (e: any) => {
      handleDropDownChange(e, "admitCardFilter");
    },
    value: allData.admitCardFilter || "schoolWise",
  };

  const renderData = () => {
    let obj: any = {
      studentWise: StudentEmail,
      examCenterWise: ExamCenterFilter,
      teachersWise: TeacherFIleters,
    };

    let Component = obj[allData.admitCardFilter];
    if (allData.admitCardFilter) {
      return <Component />;
    }
    return;
  };

  return (
    <div className="px-4 py-5" style={{ maxHeight: "100%", overflow: "auto" }}>
      <div>{renderRadio(uiFilters)}</div>
      {/* <SchoolEmail hide={isStudentFilters} /> */}
      {/* <StudentEmail hide={!isStudentFilters} /> */}
      {renderData()}
    </div>
  );
}

export default BulkEmail;
