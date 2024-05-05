import CustomTable from "@/components/Table";
import React from "react";

function Enrollments() {
  const renderTable = () => {
    const headers = ["Sr. No."];
    const keys = ["Sr. No."];

    return (
      <div>
        <CustomTable headers={headers} data={[]} keys={keys} />
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
    </div>
  );
}

export default Enrollments;
