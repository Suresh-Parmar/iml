import { filterData } from "@/helpers/filterData";
import { filterDrodownData, findFromJson } from "@/helpers/filterFromJson";
import { handleApiData, iterateData } from "@/helpers/getData";
import { validatePhone } from "@/helpers/validations";
import { useLandingPageAPisQuery } from "@/redux/apiSlice";
import { getDataLandingPage, getResult } from "@/utilities/API";
import { Group, Radio, Select } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Recaptcha } from "../common";

function MarksResult() {
  const allReduxData = useSelector((state: any) => state?.data);
  let themeColor = allReduxData?.colorScheme;
  let countryredux = allReduxData?.selectedCountry?.label;
  let countryId = allReduxData?.selectedCountry?._id;
  let themeBGColor = themeColor == "light" ? "bg-white" : "bg-dark";
  let textColer = themeColor == "light" ? "text-dark" : "text-white";

  const [allData, setallData] = useState<any>({
    competition: "",
    competitionName: "",
    seat_number: "",
    searchby: "seatnumber",
  });

  const [result, setResult] = useState<any>({});
  const [recaptcha, setRecaptcha] = useState<any>("");

  let payload = {
    collection_name: "competitions",
    op_name: "find_many",
    filter_var: {
      country_id: countryId || "India",
      status: true,
    },
  };

  let getCompetition = useLandingPageAPisQuery(payload);
  getCompetition = iterateData(getCompetition);
  getCompetition = handleApiData(getCompetition);
  getCompetition = filterData(getCompetition, "label", "value", "code");

  const getMarks = () => {
    if (!recaptcha) {
      alert("Please select Recaptcha");
      return;
    }

    if (!allData.competition || !allData.seat_number) {
      alert("Please select Competition and Seat number");
      return;
    }

    let payload = {
      collection_name: "marks",
      op_name: "find_many",
      filter_var: {
        code: allData.competition,
        [allData.searchby]: allData.seat_number,
        country_id: countryId || "India",
        status: true,
      },
    };

    getResult(payload)
      .then((res) => {
        if (res.data?.response && res.data?.response[0] && typeof res.data?.response[0] == "object") {
          let resultData = { ...res.data?.response[0] };
          resultData.competitionName = allData.competitionName;
          setResult(resultData);
        } else {
          setResult({ res: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showcheckbox = () => {
    return (
      <div>
        <Radio.Group
          value={allData.searchby}
          onChange={(e) => {
            allData.searchby = e;
            setallData({ ...allData });
          }}
        >
          <Group mt="xs">
            <Radio value="seatnumber" label="Seat Number" />
            <Radio value="registrationnumber" label="Registration Number" />
          </Group>
        </Radio.Group>
      </div>
    );
  };

  const renderResult = () => {
    if (!Object.keys(result).length) {
      return <></>;
    }

    if (result.res) {
      return <div>No Result Found</div>;
    }

    return (
      <div className="border p-2 my-2 rounded">
        <div style={{ lineHeight: "0.8" }} className="my-3">
          <p>
            Seat No. : <b> {result.seatnumber}</b>
          </p>
          <p>
            Student Name : <b> {result.name}</b>
          </p>

          <div className="d-flex justify-content-between">
            <div className="w-50">
              Class : <b> {result.class}</b>
            </div>

            <div className="w-50">
              School Name : <b> {result.school_name}</b>
            </div>
          </div>
        </div>
        <table className={`table table-${themeColor} table-bordered my-2`} key={themeColor}>
          <thead>
            <tr className="text-center">
              <th>Examination</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>% Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td>{result.competitionName}</td>
              <td>{result.marks}</td>
              <td>{result.totalmarks}</td>
              <td>{result.percent}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="d-flex justify-content-center w-100 py-3">
      <div className={`container p-3 m-2 w-100  ${themeBGColor} ${textColer} bordered`}>
        <h3 className="text-center"> {result?.competitionName || "Result"} </h3>
        <div style={{ margin: "20px auto" }}>
          {showcheckbox()}
          <div className="d-flex gap-3 align-items-center">
            <div className="form-group mb-2 mt-2 w-100">
              <Select
                label="Competition"
                clearable
                placeholder="Competition"
                value={allData.competition}
                onChange={(e) => {
                  let competitionName = findFromJson(getCompetition, e, "code");
                  setallData({ ...allData, competition: e, competitionName: competitionName.name });
                }}
                data={getCompetition}
              />
            </div>
            <div className="form-group w-100">
              <label>{allData.searchby == "registrationnumber" ? "Registration" : "Seat"} Number</label>
              <input
                type="text"
                className={`form-control ${themeBGColor} ${textColer}`}
                value={allData.seat_number}
                onChange={(e) => {
                  let val = e.target.value;
                  // val = validatePhone(val, 15);
                  setallData({ ...allData, seat_number: val });
                }}
                placeholder={allData.searchby == "registrationnumber" ? "Registration" : "Seat"}
              />
            </div>
          </div>
          <Recaptcha setRecaptcha={setRecaptcha} />
          <button onClick={getMarks} type="submit" className="btn btn-secondary mb-2">
            Get Marks
          </button>
        </div>
        {renderResult()}
      </div>
    </div>
  );
}

export default MarksResult;
