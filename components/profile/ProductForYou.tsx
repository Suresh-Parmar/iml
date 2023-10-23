import { readProducts } from "@/utilities/API";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ProductForYou() {
  const [product, setyourProducts] = useState<any>([]);

  let userData = useSelector((state: any) => state?.data?.userData?.user);
  let country = useSelector((state: any) => state?.data.selectedCountry);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: country.currency || "USD",
  });

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
  }, [userData?.class_id, country.value]);

  return (
    <div>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Product For you</div>
      <div className="d-flex gap-3 flex-wrap mb-5">
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
              src={item.imageuploadurl}
            />
            <div className="productView">{item.name}</div>
            <div className="btn btn-outline-danger">BUY {formatter.format(item.product_bundle_price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductForYou;
