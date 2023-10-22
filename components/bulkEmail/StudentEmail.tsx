import { Container, Group, Radio, Select, TextInput } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import {
  readApiData,
  readCities,
  readClasses,
  readCompetitions,
  readData,
  readExamCenters,
  readSMTPConfigs,
  readSchools,
  readStates,
  sendBulkEmail,
  sendBulkEmailToStudent,
} from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { filterData } from "@/helpers/filterData";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import { filterDataSingle } from "@/helpers/dropDownData";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";
import { findFromJson } from "@/helpers/filterFromJson";

function StudentEmail(props: any) {
  const { hide } = props;
  const [allData, setAllData] = useState<any>({});
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [templetesData, setTempletesData] = useState<any>([]);
  const [smtpData, setSmtpData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [groupsData, setGroupData] = useState<any>([]);
  const [classesData, setClassesData] = useState<any>([]);
  const [dataExamCenters, setDataExamCenters] = useState<any>([]);
  const [cohortsData, setcohortsData] = useState<any>([]);
  const [templeteType, setTempleteType] = useState<any>("");

  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;
  let themeColor = userData?.colorScheme;

  useEffect(() => {
    setLoader(true);
    async function readDataa() {
      let data = {
        collection_name: "templates",
        op_name: "find_many",

        filter_var: {
          templatetype: "email",
          status: true,
          country: "India",
        },
      };

      let templates = await readData("", "find_many", "name", "", data);
      let dataSet = filterData(templates, "label", "value");
      setTempletesData(dataSet);
      setLoader(false);
    }
    readDataa();
  }, [selectedCountry]);

  const getGroups = () => {
    setLoader(true);
    readApiData("groups")
      .then((res) => {
        setLoader(false);
        let groupDataApi: any = filterData(res, "label", "value");
        setGroupData([...groupDataApi]);
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    let states = await readStates(filterBy, filterQuery);
    states = filterData(states, "label", "value");
    setStatesData(states);
  }

  const readSchoolsData = async () => {
    setLoader(true);
    const schools = await readSchools("city", allData.city);
    setLoader(false);
    let newData = filterData(schools, "label", "value");

    setSchoolsData(newData);
  };

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let competitions = await readCompetitions();
    competitions = filterData(competitions, "label", "value");
    setCompetitionsData(competitions);
  }

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: any[];
    cities = await readCities(filterBy, filterQuery);
    cities = filterData(cities, "label", "value");
    setCitiesData(cities);
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes: any = await readClasses();
    classes = filterData(classes, "label", "value", "", false);
    // classes.unshift("all");
    setClassesData(classes);
  }

  async function readExamCentersData() {
    setLoader(true);
    let examCenters = await readExamCenters();
    setLoader(false);
    examCenters = filterData(examCenters, "label", "value", "_id");
    setDataExamCenters(examCenters);
  }

  const getCohorts = () => {
    setLoader(true);
    readApiData("cohorts")
      .then((res) => {
        setLoader(false);
        setcohortsData(filterData(res, "label", "value"));
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  useEffect(() => {
    readClassesData();
    getGroups();
    readExamCentersData();
  }, [selectedCountry]);

  useEffect(() => {
    allData.city && readSchoolsData();
  }, [allData.city]);

  useEffect(() => {
    selectedCountry && readStatesData();
    selectedCountry && readCompetitionsData();
    selectedCountry && getCohorts();
  }, [selectedCountry]);

  useEffect(() => {
    allData.state && readCitiesData("state", allData.state);
  }, [allData.state]);

  useEffect(() => {
    setLoader(true);
    async function readDataa() {
      const smsConfigs = await readSMTPConfigs();
      let dataSet = filterDataSingle(smsConfigs || [], "name");
      setSmtpData(dataSet);
      setLoader(false);
    }
    readDataa();
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
        handleDropDownChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",

      key: "city",
      type: "select",
      data: citiesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "city", "filterTypeStudent");
      },
      value: allData.city,
    },
    {
      label: "Competition",
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onChange: (e: any) => {
        handleDropDownChange(e, "competition");
      },

      value: allData.competition,
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
      label: "Select Class",
      key: "select_class",
      type: "select",
      data: classesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "select_class");
      },
      value: allData.select_class,
    },
    {
      type: "select",
      label: "Exam Center",
      data: dataExamCenters,
      value: allData.exam_center,
      placeholder: "Exam Center",
      onChange: (e: any) => {
        handleDropDownChange(e, "exam_center");
      },
    },
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

  let renderFields = () => {
    return studentFilters.map((item: any, index: any) => {
      if (item.hideInput) {
        return;
      }
      if (item.type == "select") {
        return <Select searchable={true} size="sm" key={index} w="31%" {...item} />;
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

  if (hide) {
    return;
  }

  const sendEmail = () => {
    if (!allData.email_short_name || !allData.childSchoolData) {
      console.log(allData);
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
      city: allData.city,
      state: allData.state,
      competition: allData.competition,
      class: allData.select_class,
      exam_center: allData.exam_center,
      [label]: allData[key],
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

  return (
    <div className="p-4">
      <div className="d-flex w-100 gap-3 align-items-center flex-wrap mx-auto justify-content-between">
        {renderFields()}
      </div>

      <div className="btn btn-primary form-control mt-4" onClick={sendEmail}>
        Send Email
      </div>
      <Loader show={loader} />
      {templeteType.content && (
        <div className="my-3">
          <Editor label={templeteType?.name + " Template"} readOnly disabled={true} value={templeteType.content} />
        </div>
      )}
    </div>
  );
}

export default StudentEmail;
