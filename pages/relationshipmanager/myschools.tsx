import CustomTable from "@/components/Table";
import { rmSchools } from "@/utilities/API";
import React, { useEffect } from "react";

function Myschools() {
  const renderTable = () => {
    const headers = ["Sr. No."];
    const keys = ["Sr. No."];

    const getSchools = () => {
      rmSchools()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      getSchools();
    }, []);

    return (
      <div>
        <CustomTable headers={headers} data={[]} keys={keys} />
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="fs-4">My Schools</div>
      {/* <div className="d-flex align-items-center justify-content-between mb-1">
        <div />
        <div> Search </div>
      </div> */}
      {renderTable()}
    </div>
  );
}

export default Myschools;
