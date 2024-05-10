import CustomTable from "@/components/Table";
import Loader from "@/components/common/Loader";
import { handleDropDownChange } from "@/helpers/dateHelpers";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";
import { genratePayload, handleApiData, iterateData } from "@/helpers/getData";
import { setGetData } from "@/helpers/getLocalStorage";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { ControlApplicationShellComponents } from "@/redux/slice";
import { classwiseRm, rmEnrolments } from "@/utilities/API";
import { MultiSelect, Select } from "@mantine/core";
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

  let stateApiData = useTableDataMatrixQuery(genratePayload("states", undefined, undefined, selectedCountry));
  stateApiData = iterateData(stateApiData);
  stateApiData = handleApiData(stateApiData);
  stateApiData = filterData(stateApiData, "label", "value", "_id");

  let cityApiData = useTableDataMatrixQuery(
    genratePayload("cities", { state_id: allData.state_id }, "state_id", selectedCountry)
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
      state_id: allData.state_id,
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
    setSingleSchool(school || {});
    setLoader(true);
    classwiseRm({
      country_id: selectedCountry,
      rm_id: String(userId),
      state_id: allData.state_id,
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

  const renderSingleTable = () => {
    if (!singleSchoolData.length) return <></>;

    const headers = ["Sr. No.", "Class", "Section", "Name"];
    const keys = ["index", "class_code", "section", "name"];

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
    {
      label: "State",
      type: "select",
      style: { maxWidth: "35%", width: "30%" },
      data: stateApiData,
      onchange: (e: any) => {
        handleDropDownChange(e, "state_id", allData, setAllData, "city_id");
      },
      value: allData.state_id || "",
    },
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

  return (
    <div className="p-3" style={{ background: bgColor, color: color }}>
      <div className="fs-4">Enrollments</div>
      <div className="d-flex align-items-center justify-content-between mb-3">{renderFilters()}</div>
      {renderTable()}
      <div className="my-3 mt-5">{renderSingleTable()}</div>
      <Loader show={loader} />
    </div>
  );
}

export default Enrollments;
