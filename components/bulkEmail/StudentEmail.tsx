import { Group, Radio, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { readApiData, readData, readSMTPConfigs, readSchools, sendBulkEmailToStudent } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { filterData } from "@/helpers/filterData";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";
import { findFromJson } from "@/helpers/filterFromJson";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { genratePayload, handleApiData, iterateData } from "@/helpers/getData";

function StudentEmail(props: any) {
  const [allData, setAllData] = useState<any>({});
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [groupsData, setGroupData] = useState<any>([]);
  const [studentsList, setstudentsList] = useState<any>();
  const [cohortsData, setcohortsData] = useState<any>([]);
  const [templeteType, setTempleteType] = useState<any>("");

  let classesData: any = [];
  let citiesData: any = [];
  let statesData: any = [];
  let templetesData: any = [];
  let smtpData: any = [];

  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?._id;
  let themeColor = userData?.colorScheme;
  const getGroups = () => {
    setLoader(true);
    readApiData("groups")
      .then((res) => {
        setLoader(false);
        let groupDataApi: any = filterData(res, "label", "value", "_id");
        setGroupData([...groupDataApi]);
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  const readStudentsData = () => {
    if (!allData?.city_id) {
      alert("Please select a city  ");
      return;
    }

    let key: any = allData?.childSchoolData?.key;
    let label = String(allData?.childSchoolData?.label).toLowerCase() + "s";

    let keyVal: any = {
      select_school: "school_id",
      select_group: "group_id",
      select_cohort: "cohort_id",
    };
    let newkey = "";
    if (keyVal[key]) {
      newkey = keyVal[key];
    }

    let payload = {
      collection_name: "users",
      op_name: "find_many",
      filter_var: {
        role: "student",
        country_id: selectedCountry,
        city_id: allData?.city_id,
        competition: allData?.competition,
        [newkey]: allData[key],
        class_id: allData?.select_class,
        exam_center_id: allData?.exam_center,
      },
    };
    setLoader(true);
    readApiData(undefined, payload)
      .then((res) => {
        setLoader(false);
        setstudentsList(res);
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  const readSchoolsData = async () => {
    setLoader(true);
    const schools = await readSchools("city_id", allData.city_id);
    setLoader(false);
    let newData = filterData(schools, "label", "value", "_id");

    setSchoolsData(newData);
  };

  statesData = useTableDataMatrixQuery(genratePayload("states", undefined, undefined, selectedCountry));
  statesData = iterateData(statesData);
  statesData = handleApiData(statesData);
  statesData = filterData(statesData, "label", "value", "_id");

  citiesData = useTableDataMatrixQuery(
    genratePayload("cities", { state_id: allData.state_id }, "state_id", selectedCountry)
  );
  citiesData = iterateData(citiesData);
  citiesData = handleApiData(citiesData);
  citiesData = filterData(citiesData, "label", "value", "_id");

  classesData = useTableDataMatrixQuery(genratePayload("classes", undefined, undefined, selectedCountry));
  classesData = iterateData(classesData);
  classesData = handleApiData(classesData);
  classesData = filterData(classesData, "label", "value", "_id", true, "order_code", undefined, true);
  classesData = [{ value: undefined, label: "Select" }, ...classesData];

  templetesData = useTableDataMatrixQuery(
    genratePayload("templates", { templatetype: "email" }, undefined, selectedCountry)
  );
  templetesData = iterateData(templetesData);
  templetesData = handleApiData(templetesData);
  templetesData = filterData(templetesData, "label", "value", "shortname");

  smtpData = useTableDataMatrixQuery(genratePayload("smtp_configs", undefined, undefined, selectedCountry));
  smtpData = iterateData(smtpData);
  smtpData = handleApiData(smtpData);
  smtpData = filterData(smtpData, "label", "value");

  const getCohorts = () => {
    setLoader(true);
    readApiData("cohorts")
      .then((res) => {
        setLoader(false);
        setcohortsData(filterData(res, "label", "value", "_id"));
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };
  useEffect(() => {
    getGroups();
  }, [selectedCountry]);

  useEffect(() => {
    allData.city_id && readSchoolsData();
  }, [allData.city_id]);

  useEffect(() => {
    selectedCountry && getCohorts();
  }, [selectedCountry]);

  const handleDropDownChange = (value: any, key: string, clear: any = "") => {
    if (clear) {
      if (clear == "all") {
        setAllData({ [key]: value });
      } else {
        setAllData({ ...allData, [clear]: "", [key]: value });
      }
    } else {
      setAllData({ ...allData, [key]: value });
    }
  };

  const testData = [
    { label: "None", value: "" },
    { label: "Admit Cards", value: "admit_cards" },
    { label: "Certifications", value: "certifications" },
    { label: "Attach File", value: "attached" },
  ];

  const studentFilters = [
    {
      label: "State",
      key: "state",
      type: "select",

      data: statesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "state_id", "city_id");
      },
      value: allData.state_id,
    },
    {
      label: "City",

      key: "city",
      type: "select",
      data: citiesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "city_id", "filterTypeStudent");
      },
      value: allData.city_id,
    },

    {
      llabel: "School / Group / Cohort",
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
      hideInput: !allData.filterTypeStudent,
      label: allData?.childSchoolData?.label || "Select School",
      key: "select_school",
      type: "select",
      data: allData?.childSchoolData?.data || schoolsData,
      onChange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school");
      },
      value: allData[allData?.childSchoolData?.key || "select_school"] || "",
    },
    {
      label: "Class",
      key: "select_class",
      type: "select",
      data: classesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "select_class");
      },
      value: allData.select_class,
    },
  ];

  const mailConfigData = [
    {
      label: "Subject",
      value: allData.subject,
      placeholder: "Subject",
      onChange: (e: any) => handleDropDownChange(e.target.value, "subject"),
    },
    {
      type: "select",
      label: "SMTP Name",
      data: smtpData,
      value: allData.smtp_name,
      placeholder: "SMTP Name",
      onChange: (e: any) => {
        handleDropDownChange(e, "smtp_name");
      },
    },

    {
      type: "select",
      label: "Email Short Name",
      data: templetesData,
      value: allData.email_short_name,
      placeholder: "Email Short Name",
      onChange: (e: any) => {
        let data: any = findFromJson(templetesData, e, "value");
        setTempleteType(data);
        handleDropDownChange(e, "email_short_name");
      },
    },
    {
      type: "select",
      label: "Attachment Name",
      data: testData,
      value: allData.attachment_name || "",
      placeholder: "Attachment Name",
      onChange: (e: any) => {
        handleDropDownChange(e, "attachment_name");
      },
    },
    {
      type: "file",
      label: "Test File Upload",
      style: {
        display: allData.attachment_name == "attached" ? "block" : "none",
      },
      onChange: (e: any) => {
        let file = e.target.files[0];
        handleDropDownChange(file, "attachment_name_File");
      },
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

  let renderFields = (dataTOshow: any = studentFilters) => {
    return dataTOshow.map((item: any, index: any) => {
      if (item.hideInput) {
        return;
      }
      if (item.type == "select") {
        return <Select clearable searchable={true} size="sm" key={index} w="31%" {...item} />;
      } else if (item.inputType == "file") {
        return (
          <div className="mb-3" style={{ minWidth: "31%" }} key={index}>
            <input {...item} className="form-control" />
          </div>
        );
      } else if (item.type == "radio") {
        return (
          <div key={index} className="mb-3" style={{ minWidth: "31%" }}>
            {renderRadio(item)}
          </div>
        );
      } else {
        return <TextInput size="sm" style={{ minWidth: "31%" }} key={index} {...item} />;
      }
    });
  };

  const sendEmail = () => {
    if (!allData.email_short_name || !allData.subject || !allData.smtp_name) {
      alert("email short name, subject and smtp name are required");
      return;
    }

    let windowConfirm = window.confirm("Are you sure you want to send");
    if (!windowConfirm) {
      return;
    }

    let key = allData.childSchoolData.key;
    let label = String(allData.childSchoolData.label).toLowerCase() + "s";

    let payloadData = new FormData();
    let metaData: any = {
      email_short_name: allData.email_short_name,
      smtp_config: allData.smtp_name,
      subject: allData.subject,
      city_id: allData.city,
      state: allData.state_id,
      competition: allData.competition,
      class: allData.select_class,
      exam_center: allData.exam_center,
      [label]: allData[key],
      registration_Number: allData?.studentsData,
    };

    if (allData.attachment_name) {
      if (allData.attachment_name == "attached") {
        if (!allData.attachment_name_File) {
          alert("Please select attachment");
          return;
        }
        payloadData.append("file", allData.attachment_name_File);
      }
      metaData.attachment_name = allData.attachment_name;
    }
    payloadData.append("meta_data", JSON.stringify(metaData));

    setLoader(true);
    sendBulkEmailToStudent(payloadData)
      .then((res) => {
        setLoader(false);
        notifications.show({ title: "Email sent Successfully", message: "", autoClose: 8000 });
      })
      .catch((err) => {
        setLoader(false);
        notifications.show({ title: "Faililed to send Email", message: "", autoClose: 8000, color: "red" });
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

  const renderUsersTable = () => {
    // const renderSchoolsTable = () => {

    if (studentsList && !studentsList.length) {
      return <> No Record Found</>;
    }

    if (!studentsList || !studentsList.length) {
      return;
    }

    const renderTableData = () => {
      return studentsList.map((item: any, index: any) => {
        return (
          <tr className="capitalize" key={index}>
            <td scope="row">
              <input
                type="checkbox"
                checked={Array.isArray(allData.studentsData) && allData.studentsData.includes(item["username"])}
                onChange={(e: any) => {
                  handleCHeckBOxesStudents(e, item, allData.studentsData, studentsList, "username", "studentsData");
                }}
              />
            </td>
            <td>{item["name"]}</td>
            <td>{item["school_name"]}</td>
            <td>{item["username"]}</td>
            <td>{item["seat_number"]}</td>
            {/* <td>{item["Division"]}</td>
            <td>{item["Group"]}</td> */}
            {/* <td className="text-center">
              {item?.admit_card_url ? (
                <a href={item.admit_card_url} target="_blank">
                  <span className="material-symbols-outlined text-success">download</span>
                </a>
              ) : (
                <span className="material-symbols-outlined text-secondary">download</span>
              )}
            </td> */}
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
                  checked={checkIsAllChecked(allData.studentsData, studentsList)}
                  onChange={(e: any) => {
                    handleCHeckBOxesStudents(e, false, allData.studentsData, studentsList, "username", "studentsData");
                  }}
                />
              </th>
              <th scope="col">Student Name</th>
              <th scope="col">School</th>
              <th scope="col">Registration No</th>
              <th scope="col">Seat No</th>
              {/* <th scope="col">Division</th>
              <th scope="col">Group</th> */}
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
    <div className="p-4">
      <div className="d-flex w-100 gap-3 align-items-center flex-wrap mx-auto justify-content-between">
        {renderFields()}
      </div>
      <div className="btn btn-primary form-control my-4" onClick={readStudentsData}>
        Get List
      </div>
      <div className="d-flex w-100 gap-3 align-items-center flex-wrap mx-auto justify-content-between">
        {renderFields(mailConfigData)}
      </div>

      {renderUsersTable()}
      {allData?.studentsData?.length ? (
        <div className="btn btn-primary form-control mt-4" onClick={sendEmail}>
          Send Email
        </div>
      ) : (
        ""
      )}
      <Loader show={loader} />
      {templeteType.content ? (
        <div className="my-3">
          <Editor label={templeteType?.name + " Template"} readOnly disabled={true} value={templeteType.content} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default StudentEmail;
