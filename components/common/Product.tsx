import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalBox from "./Modal";

function ProductView(props: any) {
  const [showDescription, setShowDescription] = useState<any>(false);
  let { item, onClick, className } = props;

  let userData = useSelector((state: any) => state?.data?.userData?.user);
  let country = useSelector((state: any) => state?.data.selectedCountry);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: country.currency || "USD",
  });

  const confirmBuy = () => {
    if (item?.description) {
      if (showDescription) {
        let windowconfirm = window.confirm("Are you sure you want to buy this product?");
        if (windowconfirm) {
          onClick && onClick(item);
        }
      }
      setShowDescription(true);
    } else {
      let windowconfirm = window.confirm("Are you sure you want to buy this product?");
      if (windowconfirm) {
        onClick && onClick(item);
      }
    }
  };

  return (
    <div
      className={`rounded relative ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        border: "1px solid gray",
        padding: "10px",
        maxWidth: "300px",
        width: "100%",
      }}
    >
      <img
        style={{ objectFit: "cover", width: "100%", borderRadius: "5px", height: "200px" }}
        className="justify-align-item-center"
        alt={item.name}
        src={item.imageuploadurl}
      />
      <div className="productView">{item.name}</div>
      <div className="btn btn-outline-danger" onClick={confirmBuy}>
        BUY {formatter.format(item.product_bundle_price)}
      </div>
      <ModalBox
        open={showDescription && item?.description}
        size="80%"
        title={item.name || item.title || ""}
        setOpen={setShowDescription}
      >
        <>
          <div dangerouslySetInnerHTML={{ __html: item.description ? item.description : "" }}></div>
          <div className="btn btn-outline-danger form-control my-3" onClick={confirmBuy}>
            BUY {formatter.format(item.product_bundle_price)}
          </div>
        </>
      </ModalBox>
    </div>
  );
}

export default ProductView;
