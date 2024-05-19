import { setGetData } from "@/helpers/getLocalStorage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyTable from "../Table";
import { readApiData, rmDashboard, trackShipment } from "@/utilities/API";
import Loader from "../common/Loader";
import { Tooltip } from "@mantine/core";
import { DispatchModalData } from "../dispatch";

function RMHomePage() {
  let authentication: any = setGetData("userData", false, true);

  const reduxData: any = useSelector((state: any) => state.data);
  let selectedCountry = reduxData?.selectedCountry?._id;

  const [counts, setCounts] = useState<any>({});
  const [tableData, setTableData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [shipmentDetails, setShipmentDetails] = useState("");

  let themeColor = reduxData.colorScheme;

  let bgColor = themeColor == "dark" ? "#141517" : "";
  let color = themeColor == "dark" ? "#fff" : "";

  useEffect(() => {
    getRmDataCounts();
  }, []);

  const getRmDataCounts = () => {
    setLoader(true);
    rmDashboard()
      .then((res) => {
        setLoader(false);
        setCounts(res.data);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  let payload = {
    collection_name: "dispatches_data",
    op_name: "find_many",
    filter_var: {
      country: selectedCountry,
      // username: String(authentication?.user?._id),
      // username: "100901256",
    },
  };

  const trackShipmentDetails = (item: any) => {
    let data = {
      shipment_id: item.awb_number,
    };
    setLoader(true);
    trackShipment(data)
      .then((res: any) => {
        setLoader(false);
        setShipmentDetails(res.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  async function readDispatches() {
    setLoader(true);

    const dispatches: any = await readApiData(null, payload);
    setLoader(false);

    setTableData(dispatches || []);
  }

  useEffect(() => {
    readDispatches();
  }, [selectedCountry]);

  const dispatchHtml = (item: any, show: any) => {
    if (!item.awb_number) return <></>;
    return (
      <Tooltip label="Track Shipment">
        <span className="material-symbols-outlined pointer gray" onClick={() => trackShipmentDetails(item)}>
          distance
        </span>
      </Tooltip>
    );
  };

  const headers = [
    "Sr. No.",
    // "Dispatch Date",
    // "AWB No",
    // "Consignee Name",
    // "Description of goods",
    "Weight (kg)",
    "Status",
    "Tracking",
  ];

  const keys = ["index", "approx_weight", "status", { html: dispatchHtml }];

  return (
    <div
      className="d-flex justify-content-around align-items-center p-3"
      style={{ overflow: "auto", height: "100%", background: bgColor, color: color }}
    >
      <div className="w-100 py-5">
        <div className="d-flex justify-content-around align-items-center py-3 flex-wrap">
          <div className="circleDiv">
            <div className="fs-1">{counts?.school_count || 0}</div>
            <div>No Of Schools</div>
          </div>
          <div className="circleDiv">
            <div className="fs-1"> {counts?.student_count || 0}</div>
            <div>No Of Students</div>
          </div>
        </div>
        <div className="my-3 fs-5">Dispatches</div>
        <MyTable data={tableData} headers={headers} keys={keys} />
      </div>
      <DispatchModalData data={shipmentDetails} />

      <Loader show={loader} />
    </div>
  );
}

export default RMHomePage;
