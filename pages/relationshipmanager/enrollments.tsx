import CustomTable from "@/components/Table";
import Loader from "@/components/common/Loader";
import { rmEnrolments } from "@/utilities/API";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Enrollments() {
  const reduxData: any = useSelector((state: any) => state.data);
  let selectedCountry = reduxData?.selectedCountry?._id;

  const [loader, setLoader] = useState<any>(false);
  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => {
    getEnrolments();
  }, [selectedCountry]);

  const getEnrolments = () => {
    setLoader(true);
    rmEnrolments({
      country_id: selectedCountry,
      rm_id: 100901256,
      city_id: "65b5e666d902af67de4862b1",
      competition_id: "65f2f85ed960562332f822a8",
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

  const renderTable = () => {
    const headers = ["Sr. No.", "School Name", "City", "total_students"];
    const keys = ["index", "name", "city", "total_students"];

    return (
      <div>
        <CustomTable headers={headers} data={tableData || []} keys={keys} />
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="fs-4">Enrollments</div>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div>Competitions</div>
        <div>City</div>
      </div>
      {renderTable()}
      <Loader show={loader} />
    </div>
  );
}

export default Enrollments;
