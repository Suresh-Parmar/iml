import { filterData } from "@/helpers/filterData";
import { filterDrodownData, findFromJson } from "@/helpers/filterFromJson";
import { handleApiData, iterateData } from "@/helpers/getData";
import { validatePhone } from "@/helpers/validations";
import { useLandingPageAPisQuery } from "@/redux/apiSlice";
import { getDataLandingPage } from "@/utilities/API";
import { Select } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function MarksResult() {
  const allReduxData = useSelector((state: any) => state?.data);
  let themeColor = allReduxData?.colorScheme;
  let countryredux = allReduxData?.selectedCountry?.label;
  let themeBGColor = themeColor == "light" ? "bg-white" : "bg-dark";
  let textColer = themeColor == "light" ? "text-dark" : "text-white";

  const [allData, setallData] = useState<any>({ competition: "", competitionName: "", seat_number: "" });
  const [result, setResult] = useState<any>({});

  let payload = {
    collection_name: "competitions",
    op_name: "find_many",
    filter_var: {
      country: countryredux || "India",
      status: true,
    },
  };

  let getCompetition = useLandingPageAPisQuery(payload);
  getCompetition = iterateData(getCompetition);
  getCompetition = handleApiData(getCompetition);
  getCompetition = filterData(getCompetition, "label", "value", "code");

  const getMarks = () => {
    if (!allData.competition || !allData.seat_number) {
      alert("Please select Competition and Seat number");
      return;
    }

    let payload = {
      collection_name: "marks",
      op_name: "find_many",
      filter_var: {
        code: allData.competition,
        seatnumber: allData.seat_number,
        country: countryredux || "India",
        status: true,
      },
    };

    getDataLandingPage(payload)
      .then((res) => {
        if (res.data?.response && res.data?.response[0]) {
          let resultData = { ...res.data?.response[0] };
          resultData.competitionName = allData.competitionName;

          getSeatNo();
          setResult(resultData);
        } else {
          setResult({ res: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSeatNo = () => {
    let payload = {
      collection_name: "users",
      op_name: "find_many",
      filter_var: {
        seat_number: allData.seat_number,
        country: countryredux || "India",
        status: true,
      },
    };

    getDataLandingPage(payload)
      .then((res) => {
        console.log(res);
        // if (res.data?.response && res.data?.response[0]) {
        // let resultData = { ...res.data?.response[0] };
        // resultData.competitionName = allData.competitionName;
        // setResult(resultData);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
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

          <div className="d-flex justify-content-between">
            <div className="w-50">
              Class : <b> {result.class}</b>
            </div>

            <div className="w-50">
              School Name : <b> {result.schoolname}</b>
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
        <div className="form-group mb-2">
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
        <div className="form-group">
          <label>Seat Number</label>
          <input
            type="text"
            className={`form-control ${themeBGColor} ${textColer}`}
            value={allData.seat_number}
            onChange={(e) => {
              let val = e.target.value;
              // val = validatePhone(val, 15);
              setallData({ ...allData, seat_number: val });
            }}
            placeholder="Seat Number"
          />
        </div>
        <button onClick={getMarks} type="submit" className="btn btn-secondary mb-2 mt-4">
          Get Marks
        </button>
        {renderResult()}
      </div>
    </div>
  );
}

export default MarksResult;
