import React from "react";
import { useSelector } from "react-redux";

function YourProduct() {
  let userData = useSelector((state: any) => state?.data?.userData?.user);

  const yourProductJson = userData?.myproducts || [];
  return (
    <>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Your Product</div>
      <div className="wrapperbox">
        {yourProductJson.map((item: any, index: any) => (
          <div key={index}>
            <embed src={item.resourcefileurl + "#toolbar=0"} style={{ width: "70lvw", height: "70lvh" }}></embed>
          </div>
        ))}
      </div>
    </>
  );
}

export default YourProduct;
