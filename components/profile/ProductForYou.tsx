import { readProducts } from "@/utilities/API";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ProductForYou() {
  const [product, setyourProducts] = useState<any>([]);

  let userData = useSelector((state: any) => state?.data?.userData?.user);

  const filterYourProducts = () => {
    //  const payload = { username: userData.username };
    //  studentAvailableproducts(payload);

    readProducts("class", userData?.class_id)
      .then((res: any) => {
        setyourProducts(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    userData.class_id && filterYourProducts();
  }, [userData?.class_id]);

  return (
    <div>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Product For you</div>
      {product.map((item: any, index: any) => (
        <div
          key={index}
          className="rounded relative"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            border: "1px solid gray",
            padding: "10px",
            width: "300px",
          }}
        >
          <img
            style={{ objectFit: "cover", width: "100%", borderRadius: "5px", height: "200px" }}
            className="justify-align-item-center"
            alt={item.name}
            src={item.image_url}
          />
          <div className="productView">{item.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ProductForYou;
