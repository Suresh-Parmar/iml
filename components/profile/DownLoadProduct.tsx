import { setGetData } from "@/helpers/getLocalStorage";
import { admitCardCountData, certificateDownload, omrSheetDownload, omrSheetDownloadStudent } from "@/utilities/API";
import { Button } from "@mantine/core";
import React, { useState } from "react";
import Loader from "../common/Loader";

function DownLoadProduct() {
  let userDataDetails = setGetData("userData", "", true);
  userDataDetails = userDataDetails?.user;
  const [loader, setLoader] = useState<any>(false);
  const [url, setUrl] = useState<any>({});

  const callAPi = (item: any, index: any) => {
    let apis: any = {
      admitCard: admitCardCountData,
      certificate: certificateDownload,
      omr: omrSheetDownloadStudent,
      marksheet: omrSheetDownload,
    };
    let payload = { username: [userDataDetails?.username] };
    setLoader(true);
    let callApi = apis[item.key](payload);
    callApi
      .then((res: any) => {
        setLoader(false);
        setUrl({ ...url, [item.apiKey]: res.data[item.apiKey] });
        if (res.data[item.apiKey]) {
          var link = document.createElement("a");
          link.href = res.data[item.apiKey];
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((errors: any) => {
        setLoader(false);
      });
  };

  const downloadsCardImages = [
    {
      label: "Download Admit Card",
      type: "downloads",
      key: "admitCard",
      url: "https://www.placementstore.com/wp-content/uploads/Admit-Card.jpg",
      apiKey: "admit_card_url",
    },
    {
      label: "Download Certificate",
      key: "certificate",
      type: "downloads",
      url: "https://i.pinimg.com/474x/11/b7/b5/11b7b5e2cd89d3f503211bcb2e939fb8.jpg",
      apiKey: "certificate_url",
    },
    {
      label: "Download OMR",
      type: "downloads",
      key: "omr",
      url: "https://i0.wp.com/www.sscgyan.com/wp-content/uploads/2019/02/OMR-Sheet-Pdf.jpg?fit=549%2C350&ssl=1",
      apiKey: "OMR_url",
    },

    {
      label: "Download Marksheet",
      key: "marksheet",
      type: "downloads",
      url: "https://i0.wp.com/www.sscgyan.com/wp-content/uploads/2019/02/OMR-Sheet-Pdf.jpg?fit=549%2C350&ssl=1",
      apiKey: "marksheet_url",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Download</div>
      <div
        className="justify-content-center "
        style={{ display: "flex", flexDirection: "row", gap: "25px", flexWrap: "wrap" }}
      >
        {downloadsCardImages.map((item, index) => (
          <div
            key={index}
            className="rounded"
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
              alt={item.label}
              src={item.url}
            />
            {url[item.apiKey] ? (
              <a href={url[item.apiKey]} className="form-control btn btn-primary">
                {item.label}
              </a>
            ) : (
              <button
                className="form-control btn btn-outline-primary"
                onClick={() => {
                  callAPi(item, index);
                }}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </div>
      <Loader show={loader} />
    </div>
  );
}

export default DownLoadProduct;
