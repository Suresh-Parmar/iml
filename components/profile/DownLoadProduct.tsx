import { setGetData } from "@/helpers/getLocalStorage";
import {
  admitCardCountData,
  certificateDownload,
  downloadMarksSheet,
  omrSheetDownload,
  omrSheetDownloadStudent,
  readCompetitions,
  readSubjects,
} from "@/utilities/API";
import { Button, MultiSelect, Select } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { filterData } from "@/helpers/filterData";
import { useSelector } from "react-redux";

function DownLoadProduct() {
  let userDataDetails = setGetData("userData", "", true);
  userDataDetails = userDataDetails?.user;
  const [loader, setLoader] = useState<any>(false);
  const [url, setUrl] = useState<any>({});
  const [comeptitionsData, setCompetitionsData] = useState<any>([]);
  const [subjectsData, setSubjectsData] = useState<any>([]);
  const [allData, setAllData] = useState<any>({});

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;

  async function readCompetitionsData() {
    setLoader(true);
    let competitions = await readCompetitions("subject_id", allData.subject);
    setLoader(false);

    competitions = filterData(competitions, "label", "value");
    setCompetitionsData(competitions);
  }

  async function readSubjectsData() {
    setLoader(true);
    let subjects = await readSubjects();
    setLoader(false);
    subjects = filterData(subjects, "label", "value");
    setSubjectsData(subjects);
  }

  useEffect(() => {
    readSubjectsData();
  }, [countryName]);

  useEffect(() => {
    allData.subject && readCompetitionsData();
  }, [allData.subject]);

  const callAPi = (item: any, index: any) => {
    let apis: any = {
      admitCard: admitCardCountData,
      certificate: certificateDownload,
      omr: omrSheetDownloadStudent,
      marksheet: downloadMarksSheet,
    };
    let payload = { username: [userDataDetails?.username], competition: allData.competition, whitbackground: true };

    setLoader(true);
    let callApi = apis[item.key](payload);
    callApi
      .then((res: any) => {
        setLoader(false);
        let dataObj = res.data;

        if (Array.isArray(dataObj)) {
          dataObj = dataObj[0];
        }

        setUrl({ ...url, [item.apiKey]: dataObj[item.apiKey] });
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
      apiKey: "marksheets_url",
    },
  ];

  const handleDropDownChange = (e: any, key: any, clear?: any) => {
    if (clear) {
      if (clear == "all") {
        setAllData({ [key]: e });
      } else {
        setAllData({ ...allData, [clear]: "", [key]: e });
      }
    } else {
      setAllData({ ...allData, [key]: e });
    }
  };

  const downloadFilters = [
    {
      label: "Subject",
      key: "subject",
      type: "select",
      data: subjectsData,
      onChange: (e: any) => {
        handleDropDownChange(e, "subject", "competition");
      },
      value: allData.subject,
    },
    {
      label: "Competition",
      key: "competition",
      type: "select",
      data: comeptitionsData,
      onChange: (e: any) => {
        handleDropDownChange(e, "competition");
      },
      value: allData.competition,
    },
  ];

  const renderFilters = () => {
    const renderData = () => {
      return downloadFilters.map((item: any, index) => {
        if (item.hideInput) {
          return;
        }
        let { type, data, label, placeholder, onchange, value, style } = item;
        if (type === "multiselect") {
          return (
            <div key={index}>
              <MultiSelect searchable={true} {...item} />
            </div>
          );
        } else {
          return (
            <div key={index}>
              <Select clearable searchable={true} {...item} />
            </div>
          );
        }
      });
    };

    return <div className="d-flex flex-wrap gap-4 mb-5">{renderData()}</div>;
  };

  return (
    <div>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Download</div>
      <div>{renderFilters()}</div>
      <div
        className="justify-content-center "
        style={{ display: "flex", flexDirection: "row", gap: "25px", flexWrap: "wrap" }}
      >
        {downloadsCardImages.map((item, index) => {
          return (
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
                style={{ objectFit: "cover", width: "100%", borderRadius: "5px", height: "150px" }}
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
          );
        })}
      </div>
      <Loader show={loader} />
    </div>
  );
}

export default DownLoadProduct;
