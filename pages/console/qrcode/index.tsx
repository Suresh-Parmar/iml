import Loader from "@/components/common/Loader";
import { handleDropDownChange } from "@/helpers/dateHelpers";
import { filterData } from "@/helpers/filterData";
import { genratePayload, handleApiData, iterateData } from "@/helpers/getData";
import { createQrCode, readQrCode } from "@/utilities/API";
import { DateInput } from "@mantine/dates";
import { formatDateString } from "@/helpers/dateHelpers";

import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import {
  Button,
  Container,
  Group,
  MultiSelect,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { error } from "console";
import { notifications } from "@mantine/notifications";
import Matrix, { MatrixDataType } from "@/components/Matrix";

function QrCode() {
  const [allData, setAllData] = useState<any>({});
  const [price, setPrice] = useState<any>(0);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [loader, setLoader] = useState<any>(false);

  const state: any = useSelector((state: any) => state.data);
  // const countryId = state?.selectedCountry?._id;
  const countryId = state?.userData?.user?.country_id;

  // ====== matrix code
  const [data, setData] = useState<MatrixDataType>([]);
  const country_selected: any = useSelector((state) => state);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?._id;

  useEffect(() => {
    setLoader(true);
    async function readData() {
      const qrCodeData = await readQrCode("country_id", selectedCountry);
      setData(qrCodeData);
      setLoader(false);
    }
    readData();
  }, [country_selected?.client?.selectedCountry?.name, selectedCountry]);

  let competitionData = useTableDataMatrixQuery(
    genratePayload("competitions", undefined, undefined, countryId)
  );
  competitionData = iterateData(competitionData);
  competitionData = handleApiData(competitionData);
  competitionData = filterData(competitionData, "label", "value", "code");

  let schoolsData = useTableDataMatrixQuery(
    genratePayload(
      "schools",
      { city: allData.second_city },
      undefined,
      countryId
    )
  );
  schoolsData = iterateData(schoolsData);
  schoolsData = handleApiData(schoolsData);
  schoolsData = filterData(schoolsData, "label", "value");

  let filters = [
    {
      label: "School",
      type: "multiselect",
      data: schoolsData,
      onchange: (e: any) => {
        handleDropDownChange(e, "school", allData, setAllData);
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.school || "",
    },
    {
      label: "Competition",
      type: "select",
      data: competitionData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition", allData, setAllData);
      },
      style: { maxWidth: "35%", width: "20%" },
      value: allData.competition || "",
    },
    {
      label: "Amount",
      type: "Text",
      data: price,
      onchange: (e: any) => {
        setPrice(e.target.value);
      },
      style: { maxWidth: "35%", width: "20%" },
      value: price || "",
    },
  ];

  const renderRadio = (item: any) => {
    const renderInputs = () => {
      return item.options.map((itemChild: any, index: any) => {
        return (
          <Radio key={index} value={itemChild.value} label={itemChild.label} />
        );
      });
    };

    return (
      <Radio.Group {...item}>
        <Group mt="xs">{renderInputs()}</Group>
      </Radio.Group>
    );
  };

  const renderData = () => {
    return filters.map((item: any, index) => {
      if (item.hideInput) {
        return;
      }
      let {
        type,
        data,
        label,
        placeholder,
        onchange,
        value,
        style,
        selectDataFrom,
      } = item;

      if (selectDataFrom) {
        let objKey = allData?.childSchoolData?.objKey;
        data = selectDataFrom[objKey].data;
      }

      if (type === "multiselect") {
        return (
          <div key={index} style={{ maxWidth: "15%", ...style }}>
            <MultiSelect
              searchable={true}
              size="sm"
              w="100%"
              onChange={onchange}
              value={value || ""}
              data={data}
              label={label}
              placeholder={placeholder || label}
            />
          </div>
        );
      } else if (type == "sec") {
        return (
          <div
            key={index}
            style={{ width: "100%", background: "black", height: "2px" }}
          />
        );
      } else if (type == "radio") {
        return <div key={index}>{renderRadio(item)}</div>;
      } else if (type == "Text") {
        return (
          <div key={index} style={{ maxWidth: "15%", ...style }}>
            <TextInput
              withAsterisk
              label="Amount"
              placeholder="Amount"
              w={"100%"}
              onChange={(event) => {
                setPrice(event.target.value);
              }}
              value={price}
            />
          </div>
        );
      } else {
        return (
          <div key={index} style={{ maxWidth: "15%", ...style }}>
            <Select
              clearable
              withAsterisk
              searchable={true}
              size="sm"
              w="100%"
              onChange={onchange}
              value={value || ""}
              data={data}
              label={label}
              placeholder={placeholder || label}
            />
          </div>
        );
      }
    });
  };

  // const downloadQrCode = (url: string) => {
  //   fetch(url)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       // Create a blob URL for the blob object
  //       const blobUrl = URL.createObjectURL(blob);

  //       // Create a temporary anchor element
  //       const link = document.createElement("a");
  //       link.href = blobUrl;
  //       link.download = "qr_code.png"; // Specify your desired filename here
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //       // Clean up the blob URL after the download
  //       URL.revokeObjectURL(blobUrl);
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading QR code:", error);
  //     });
  // };

  const handleStartDateChange = (e: any) => {
    setStartDate(e);
  };

  const handleEndDateChange = (e: any) => {
    setEndDate(e);
  };

  const formattedDate = (date: any) => {
    let date1: any = new Date(date);
    if (date1 == "Invalid Date") {
      date1 = new Date();
    }

    return date1
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleGenerateQrReq = () => {
    setLoader(true);

    const competitionId = competitionData.filter(
      (competition: any) => competition.value == allData.competition
    )[0]._id;

    const schoolIdArray = schoolsData
      .map((school: any) => {
        if (allData.school.includes(school.value)) {
          return {
            $oid: `${school._id}`,
          };
        }
        return null; // Ensure all elements are handled
      })
      .filter((id: any) => id !== null); // Filter out null values

    const payload: any = {
      school_id: schoolIdArray,
      competition_id: {
        $oid: `${competitionId}`,
      },
      amount: price,
      start_date: formatDateString(`${startDate}`),
      expiration_date: formatDateString(`${endDate}`),
      country_id: {
        $oid: `${countryId}`,
      },
    };

    createQrCode(payload)
      .then((res: any) => {
        if (res?.toUpperCase()?.trim() === "QR CODE GENERATED") {
          notifications.show({
            title: `Qr Code`,
            message: `Qr Code Generated Successfully`,
            color: "orange",
          });
          setAllData((prevAllData: any) => ({
            ...prevAllData,
            school: undefined,
            competition: "",
          }));
          setStartDate(null);
          setEndDate(null);
          setPrice(0);
        } else {
          notifications.show({
            title: `Qr Code Faild`,
            message: `Qr Code Failed to Generated ${res}`,
            color: "red",
          });
        }
      })
      .catch((error) => {
        notifications.show({
          title: `Qr Code Faild`,
          message: `Qr Code Failed to Generated ${error}`,
          color: "red",
        });
      });

    setLoader(false);
  };

  useEffect(() => {}, [allData.school]);

  return (
    <Container h={"70%"} fluid p={0}>
      <div className="m-4">
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>

        <div className="d-flex flex-wrap gap-4">
          <div className="mt-4">
            <DateInput
              valueFormat="DD-MM-YYYY"
              placeholder={formattedDate("")}
              label="Start Date"
              withAsterisk
              onChange={(e: any) => {
                handleStartDateChange(e);
              }}
              value={startDate}
            />
          </div>

          <div className="mt-4">
            <DateInput
              valueFormat="DD-MM-YYYY"
              placeholder={formattedDate("")}
              label="End Date"
              withAsterisk
              onChange={(e: any) => {
                handleEndDateChange(e);
              }}
              value={endDate}
              previousDisabled={true} // Function to disable past dates
            />
          </div>

          <div className="mt-5">
            <Button
              className="btn btn-primary "
              onClick={() => handleGenerateQrReq()}
              disabled={
                !allData.school?.length ||
                !allData.competition ||
                !price ||
                +price < 1 ||
                startDate == null ||
                endDate == null
              }
            >
              Generate QR Code
            </Button>
          </div>
        </div>
      </div>
      <Matrix
        data={data?.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType={"QrCode"}
        showApiSearch={true}
        // totalrecords={totalrecords}
        // setPagiData={setPagiData}
        // pagiData={pagiData}
      />
      <Loader show={loader} />
    </Container>
  );
}

export default QrCode;
