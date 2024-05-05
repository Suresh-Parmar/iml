import { setGetData } from "@/helpers/getLocalStorage";
import { ControlApplicationShellComponents } from "@/redux/slice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyTable from "../Table";
import { readApiData, rmDashboard } from "@/utilities/API";
import Loader from "../common/Loader";

function RMHomePage() {
  const dispatch = useDispatch();
  let authentication: any = setGetData("userData", false, true);
  let role = authentication?.user?.role;
  const router: any = useRouter();

  const reduxData: any = useSelector((state: any) => state.data);
  let selectedCountry = reduxData?.selectedCountry?._id;

  const [counts, setCounts] = useState<any>({});
  const [tableData, setTableData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);

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
      // country: selectedCountry,
      username: String(authentication?.user?._id),
      // username: "100901256",
    },
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

  const headers = [
    "Sr. No.",
    // "Dispatch Date",
    // "AWB No",
    // "Consignee Name",
    // "Description of goods",
    "Weight (kg)",
    "Status",
    // "Tracking",
  ];

  const keys = [
    "index",
    "approx_weight",
    "status",
    // "Tracking"
  ];

  return (
    <div className="d-flex justify-content-around align-items-center p-3" style={{ overflow: "auto", height: "100%" }}>
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
      <Loader show={loader} />
    </div>
  );
}

export default RMHomePage;
