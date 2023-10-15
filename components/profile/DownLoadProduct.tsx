import { setGetData } from "@/helpers/getLocalStorage";
import { admitCardCountData, certificateDownload, omrSheetDownload } from "@/utilities/API";
import { Button } from "@mantine/core";
import React, { useState } from "react";
import Loader from "../common/Loader";

function DownLoadProduct() {
  let userDataDetails = setGetData("userData", "", true);
  userDataDetails = userDataDetails?.user;
  const [loader, setLoader] = useState<any>(false);
  const [url, setUrl] = useState<any>("");

  const genrateStudentPdf = (item: any, index: any) => {
    setLoader(true);
    if (item.label == "Download Admit Card" && index === 0) {
      admitCardCountData({ username: [userDataDetails.username] })
        .then((res) => {
          setLoader(false);
          // console.log(res.data);
          setUrl(res.data.admit_card_url);
          if (res.data.admit_card_url) {
            var link = document.createElement("a");
            link.href = res.data.admit_card_url;
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
        .catch((errors) => {
          setLoader(false);
        });
    } else if (item.label === "Download Certificate" && index === 1) {
      certificateDownload({ username: [userDataDetails.username] })
        .then((res) => {
          setLoader(false);
          // console.log(res.data);
          setUrl(res.data.admit_card_url);
          if (res.data.admit_card_url) {
            var link = document.createElement("a");
            link.href = res.data.admit_card_url;
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
        .catch((errors) => {
          setLoader(false);
        });
    }
    // else if (item.label === 'Download Marksheet') {
    //   certificateDownload({ username: [userDataDetails.username] })
    //     .then((res) => {
    //       setLoader(false);
    //       // console.log(res.data);
    //       setUrl(res.data.admit_card_url);
    //       if (res.data.admit_card_url) {
    //         var link = document.createElement('a');
    //         link.href = res.data.admit_card_url;
    //         link.setAttribute('target', '_blank');
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //       }
    //     })
    //     .catch((errors) => {
    //       setLoader(false);
    //     });
    // }
    else {
      omrSheetDownload({ username: [userDataDetails.username] })
        .then((res) => {
          setLoader(false);
          // console.log(res.data);
          setUrl(res.data.admit_card_url);
          if (res.data.admit_card_url) {
            var link = document.createElement("a");
            link.href = res.data.admit_card_url;
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
        .catch((errors) => {
          setLoader(false);
        });
    }
  };

  const downloadsCardImages = [
    {
      label: "Download Admit Card",
      type: "downloads",
      url: "https://www.placementstore.com/wp-content/uploads/Admit-Card.jpg",
    },
    {
      label: "Download Certificate",
      type: "downloads",
      url: "https://i.pinimg.com/474x/11/b7/b5/11b7b5e2cd89d3f503211bcb2e939fb8.jpg",
    },
    {
      label: "Download OMR",
      type: "downloads",
      url: "https://i0.wp.com/www.sscgyan.com/wp-content/uploads/2019/02/OMR-Sheet-Pdf.jpg?fit=549%2C350&ssl=1",
    },

    {
      label: "Download Marksheet",
      type: "downloads",
      url: "https://i0.wp.com/www.sscgyan.com/wp-content/uploads/2019/02/OMR-Sheet-Pdf.jpg?fit=549%2C350&ssl=1",
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
            {url ? (
              <a href={url} className="form-control btn btn-primary">
                <button> {item.label}</button>
              </a>
            ) : (
              <button
                className="form-control btn btn-outline-primary"
                onClick={() => {
                  genrateStudentPdf(item, index);
                }}
              >
                {" "}
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
