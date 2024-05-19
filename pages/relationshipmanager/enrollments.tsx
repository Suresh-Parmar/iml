import { Studentsform } from "@/components/Forms/Studentsform";
import CustomTable from "@/components/Table";
import Loader from "@/components/common/Loader";
import { handleDropDownChange } from "@/helpers/dateHelpers";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";
import { genratePayload, handleApiData, iterateData } from "@/helpers/getData";
import { setGetData } from "@/helpers/getLocalStorage";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { ControlApplicationShellComponents } from "@/redux/slice";
import {
  admitCardCountData,
  certificateDownload,
  classwiseRm,
  downloadMarksSheet,
  omrSheetDownloadStudent,
  readStudents,
  rmEnrolments,
} from "@/utilities/API";
import { ActionIcon, Modal, MultiSelect, Select, Tooltip } from "@mantine/core";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Enrollments() {
  const reduxData: any = useSelector((state: any) => state.data);
  let selectedCountry = reduxData?.selectedCountry?._id;

  let themeColor = reduxData.colorScheme;

  let bgColor = themeColor == "dark" ? "#141517" : "";
  let color = themeColor == "dark" ? "#fff" : "";

  const [loader, setLoader] = useState<any>(false);
  const [allData, setAllData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [singleSchoolData, setSingleSchoolData] = useState<any>([]);
  const [singleSchool, setSingleSchool] = useState<any>({});
  const [userData, setuserData] = useState<any>(false);
  const [viewOnly, setviewOnly] = useState<any>(false);
  const [payloadData, setpayloadData] = useState<any>({});

  const dispatch = useDispatch();
  let authentication: any = setGetData("userData", false, true);
  let { role, _id: userId } = authentication?.user;
  const router: any = useRouter();

  useEffect(() => {
    if (role == "student") {
      router.replace("/");
    }

    if (authentication?.metadata?.status == "unauthenticated" || !authentication) {
      router.replace("/authentication/signin");
    } else {
      dispatch(
        ControlApplicationShellComponents({
          showHeader: true,
          showFooter: false,
          showNavigationBar: role == "student",
          hideNavigationBar: false,
          showAsideBar: false,
        })
      );
    }
  }, [authentication?.metadata?.status, dispatch, router]);

  let competitionData = useTableDataMatrixQuery(genratePayload("competitions", undefined, undefined, selectedCountry));
  competitionData = iterateData(competitionData);
  competitionData = handleApiData(competitionData);
  competitionData = filterData(competitionData, "label", "value", "_id");

  // let stateApiData = useTableDataMatrixQuery(genratePayload("states", undefined, undefined, selectedCountry));
  // stateApiData = iterateData(stateApiData);
  // stateApiData = handleApiData(stateApiData);
  // stateApiData = filterData(stateApiData, "label", "value", "_id");

  let cityApiData = useTableDataMatrixQuery(
    genratePayload("cities", undefined, undefined, selectedCountry)
    // genratePayload("cities", { state_id: allData.state_id }, "state_id", selectedCountry)
  );
  cityApiData = iterateData(cityApiData);
  cityApiData = handleApiData(cityApiData);
  cityApiData = filterData(cityApiData, "label", "value", "_id");

  useEffect(() => {
    if (allData.city_id) {
      getEnrolments();
    }
  }, [allData?.city_id]);

  useEffect(() => {
    setAllData({});
  }, [selectedCountry]);

  const getEnrolments = () => {
    setLoader(true);
    rmEnrolments({
      country_id: selectedCountry,
      rm_id: String(userId),
      // state_id: allData.state_id,
      city_id: allData.city_id,
      competition_id: allData.competition_id,
    })
      .then((res) => {
        setLoader(false);
        setTableData(res?.data?.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const getClasswiseRm = (key: any, val: any, school: any) => {
    setpayloadData({ key, school });
    setSingleSchool(school || {});
    setLoader(true);
    classwiseRm({
      country_id: selectedCountry,
      rm_id: String(userId),
      // state_id: allData.state_id,
      city_id: allData.city_id,
      competition_id: allData.competition_id,
      school_id: school.school_id,
      class: key,
    })
      .then((res) => {
        setLoader(false);
        setSingleSchoolData(res?.data?.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const getstudentData = (userId: any) => {
    let payload = {
      collection_name: "users",
      op_name: "find_many",
      filter_var: {
        role: "student",
        _id: userId,
      },
    };

    readStudents(payload)
      .then((student) => {
        if (student && student[0]) {
          setuserData(student[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderActions = (item: any) => {
    return (
      <div className="d-flex gap-2">
        <Tooltip label="Preview">
          <ActionIcon
            onClick={(event) => {
              setviewOnly(true);
              getstudentData(item?._id);
            }}
          >
            <IconEye size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit">
          <ActionIcon
            onClick={(event) => {
              setviewOnly(false);
              getstudentData(item?._id);
            }}
          >
            <IconEdit size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
      </div>
    );
  };

  const downloadItems: any = {
    admitCard: {
      label: "Download Admit Card",
      type: "downloads",
      key: "admitCard",
      apiKey: "admit_card_url",
    },
    certificate: {
      label: "Download Certificate",
      key: "certificate",
      type: "downloads",
      apiKey: "certificate_url",
    },
    marksheet: {
      label: "Download Marksheet",
      key: "marksheet",
      type: "downloads",
      apiKey: "marksheets_url",
    },
  };

  const callAPi = (item: any, username: any) => {
    let apis: any = {
      admitCard: admitCardCountData,
      certificate: certificateDownload,
      omr: omrSheetDownloadStudent,
      marksheet: downloadMarksSheet,
    };
    let payload = {
      username: [username],
      competition: allData.competition,
      whitbackground: true,
      country_id: selectedCountry,
    };

    setLoader(true);
    let callApi = apis[item.key](payload);
    callApi
      .then((res: any) => {
        setLoader(false);
        let dataObj = res.data;

        if (Array.isArray(dataObj)) {
          dataObj = dataObj[0];
        }

        if (dataObj[item.apiKey]) {
          var link = document.createElement("a");
          link.href = dataObj[item.apiKey];

          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((errors: any) => {
        console.log(errors);
        setLoader(false);
      });
  };

  const downloadDocs = (item: any, type: any) => {
    return (
      <div className="text-center">
        <span className="material-symbols-outlined pointer" onClick={() => callAPi(downloadItems[type], item._id)}>
          download
        </span>
      </div>
    );
  };

  const renderSingleTable = () => {
    if (!singleSchoolData.length) return <></>;

    const headers = ["Sr. No.", "Class", "Section", "Name", "Admit card", "MarkSheet", "Certificate", "Actions"];
    const keys = [
      "index",
      "class_code",
      "section",
      "name",
      { html: (item: any) => downloadDocs(item, "admitCard") },
      { html: (item: any) => downloadDocs(item, "marksheet") },
      { html: (item: any) => downloadDocs(item, "certificate") },

      { html: renderActions },
    ];

    let competition = findFromJson(competitionData, allData?.competition_id, "_id");

    return (
      <div>
        <div className="m-3 d-flex align-items-center justify-content-between">
          <div>School : {singleSchool?.name}</div>
          <div>Competition : {competition?.name}</div>
        </div>

        <CustomTable headers={headers} data={singleSchoolData || []} keys={keys} />
      </div>
    );
  };

  const renderTable = () => {
    const headers = ["Sr. No.", "School Name", "City", "Total"];
    const keys = ["index", "name", "city", "total_students"];

    return (
      <CustomTable
        expose="class_counts"
        clickable="class_counts"
        getSingleColumn
        onClickRow={(key: any, val: any, row: any) => getClasswiseRm(key, val, row)}
        headers={headers}
        data={tableData || []}
        keys={keys}
      />
    );
  };

  let filtersPayload = [
    {
      label: "Competition",
      type: "select",
      style: { maxWidth: "35%", width: "30%" },
      data: competitionData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition_id", allData, setAllData);
      },
      value: allData.competition_id || "",
    },
    // {
    //   label: "State",
    //   type: "select",
    //   style: { maxWidth: "35%", width: "30%" },
    //   data: stateApiData,
    //   onchange: (e: any) => {
    //     handleDropDownChange(e, "state_id", allData, setAllData, "city_id");
    //   },
    //   value: allData.state_id || "",
    // },
    {
      label: "City",
      type: "select",
      style: { maxWidth: "35%", width: "30%" },
      data: cityApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "city_id", allData, setAllData);
      },
      value: allData.city_id || "",
    },
  ];

  const renderFilters = () => {
    return filtersPayload.map((item: any, index) => {
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

  const renderModal = () => {
    console.log(userData);

    return (
      <div>
        <Modal
          opened={userData}
          onClose={() => {
            setuserData(null);
          }}
          closeOnClickOutside={false}
          title={`${userData?.name}`}
          centered
          size={"75%"}
          overlayProps={{
            color: color,
            opacity: 0.55,
            blur: 3,
          }}
          transitionProps={{
            transition: "slide-up",
            duration: 200,
            timingFunction: "linear",
          }}
        >
          {userData ? (
            <Studentsform
              apiCall={true}
              readonly={viewOnly}
              setFormTitle={() => {}}
              open={userData}
              close={() => {
                getClasswiseRm(payloadData.key, false, payloadData.school);
                setuserData(false);
              }}
              setData={() => {}}
              setRowData={() => {}}
              rowData={userData}
              formType={"Students"}
            />
          ) : (
            <></>
          )}
        </Modal>
      </div>
    );
  };

  return (
    <div className="p-3" style={{ background: bgColor, color: color }}>
      <div className="fs-4">Enrollments</div>
      <div className="d-flex align-items-center gap-3 mb-3">{renderFilters()}</div>
      {/* <div className="d-flex align-items-center justify-content-between mb-3">{renderFilters()}</div> */}
      {renderTable()}
      <div className="my-3 mt-5">{renderSingleTable()}</div>
      <Loader show={loader} />
      {renderModal()}
    </div>
  );
}

export default Enrollments;
