import { Container, Select, TextInput } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import {
  readCities,
  readCompetitions,
  readData,
  readSMTPConfigs,
  readSchools,
  readStates,
  sendBulkEmail,
} from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { filterData } from "@/helpers/filterData";
import { checkIsAllChecked, selectCheckBOxData } from "@/helpers/selectCheckBox";
import { filterDataSingle } from "@/helpers/dropDownData";
import { notifications } from "@mantine/notifications";
import { findFromJson } from "@/helpers/filterFromJson";
import Editor from "../editor/editor";

function SchoolEmail(props: any) {
  const { hide } = props;
  const [allData, setAllData] = useState<any>({});
  const [schoolsData, setSchoolsData] = useState<any>([]);
  const [templetesData, setTempletesData] = useState<any>([]);
  const [smtpData, setSmtpData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
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

  useEffect(() => {
    allData.city && readSchoolsData();
  }, [selectedCountry, allData.city]);

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

  useEffect(() => {
    selectedCountry && readStatesData();
    selectedCountry && readCompetitionsData();
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

  const handleCHeckBOxes = (e: any, item: any = "") => {
    let checked: any = e.target.checked;
    let data: any = [];
    if (!!item) {
      data = selectCheckBOxData(allData?.school_names, checked, item.name, schoolsData, "name");
    } else {
      data = selectCheckBOxData(allData?.school_names, checked, "", schoolsData, "name");
    }

    allData.school_names = data;
    setAllData({ ...allData });
  };

  const renderTableData = () => {
    return schoolsData.map((item: any, index: any) => {
      return (
        <tr className="capitalize" key={index}>
          <td scope="row">
            <input
              type="checkbox"
              checked={Array.isArray(allData.school_names) && allData.school_names.includes(item.name)}
              onChange={(e: any) => {
                handleCHeckBOxes(e, item);
              }}
            />
          </td>
          <td>{item.name}</td>
        </tr>
      );
    });
  };

  let renderSchoolsTable = () => {
    return (
      <div className="my-4 table-responsive" style={{ maxHeight: "300px", overflow: "auto" }}>
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
                  checked={checkIsAllChecked(allData.school_names, schoolsData)}
                  onChange={(e) => {
                    handleCHeckBOxes(e);
                  }}
                />
              </th>
              <th scope="col">School Name</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    );
  };

  let handleChange = (value: any, key: string, clear: any = "") => {
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

  let renderDataFields = [
    {
      label: "State",
      key: "state",
      inputType: "dropDown",
      data: statesData,
      onChange: (e: any) => {
        handleChange(e, "state", "city");
      },
      value: allData.state,
    },
    {
      label: "City",
      key: "city",
      inputType: "dropDown",
      data: citiesData,
      onChange: (e: any) => {
        handleChange(e, "city");
      },
      value: allData.city,
    },
    {
      label: "Competition",
      key: "competition",
      inputType: "dropDown",
      data: comeptitionsData,
      onChange: (e: any) => {
        handleChange(e, "competition");
      },
      value: allData.competition,
    },
    {
      label: "Subject",
      value: allData.subject,
      placeholder: "Subject",
      onChange: (e: any) => handleChange(e.target.value, "subject"),
    },
    {
      inputType: "dropDown",
      label: "SMTP Name",
      data: smtpData,
      value: allData.smtp_name,
      placeholder: "SMTP Name",
      onChange: (e: any) => {
        handleChange(e, "smtp_name");
      },
    },
    {
      inputType: "dropDown",
      label: "Email Short Name",
      data: templetesData,
      value: allData.email_short_name,
      placeholder: "Email Short Name",
      onChange: (e: any) => {
        let data: any = findFromJson(templetesData, e, "value");

        setTempleteType(data);
        handleChange(e, "email_short_name");
      },
    },
    {
      inputType: "dropDown",
      label: "Attachment Name",
      data: testData,
      value: allData.attachment_name || "",
      placeholder: "Attachment Name",
      onChange: (e: any) => {
        handleChange(e, "attachment_name");
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
        handleChange(file, "attachment_name_File");
      },
    },
  ];

  let renderFields = () => {
    return renderDataFields.map((item: any, index: any) => {
      if (item.inputType == "dropDown") {
        return <Select searchable={true} size="sm" key={index} w="31%" {...item} />;
      } else if (item.inputType == "file") {
        return (
          <div className="mb-3" style={{ minWidth: "31%" }} key={index}>
            <input {...item} className="form-control" />
          </div>
        );
      } else {
        return <TextInput size="sm" style={{ minWidth: "31%" }} key={index} {...item} />;
      }
    });
  };

  const sendEmail = () => {
    if (!allData.school_names || !allData.email_short_name) {
      return;
    }

    let windowConfirm = window.confirm("Are you sure you want to send");
    if (!windowConfirm) {
      return;
    }

    let payloadData = new FormData();
    let metaData: any = {
      school_names: allData.school_names,
      email_short_name: allData.email_short_name,
      smtp_name: allData.smtp_name,
      subject: allData.subject,
      city: allData.city,
      state: allData.state,
      competition: allData.competition,
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
    sendBulkEmail(payloadData)
      .then((res) => {
        setLoader(false);
        notifications.show({ title: "Email sent Successfully", message: "", autoClose: 8000 });
      })
      .catch((err) => {
        setLoader(false);
        notifications.show({ title: "Faililed to send Email", message: "", autoClose: 8000, color: "red" });
      });
  };

  if (hide) {
    return;
  }

  return (
    <div className="p-4">
      <div className="d-flex w-100 gap-3 align-items-center flex-wrap mx-auto justify-content-between">
        {renderFields()}
      </div>
      {schoolsData.length ? renderSchoolsTable() : ""}
      <div className="btn btn-primary form-control mt-4" onClick={sendEmail}>
        Send Email
      </div>
      <Loader show={loader} />
      {templeteType.content && (
        <div className="my-3">
          <Editor label={templeteType?.shortname} readOnly disabled={true} value={templeteType.content} />
        </div>
      )}
    </div>
  );
}

export default SchoolEmail;
