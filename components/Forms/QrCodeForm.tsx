import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  Select,
  LoadingOverlay,
  Container,
  MultiSelect,
  Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  FetchQRCODE,
  createCity,
  readApiData,
  readCities,
  readCompetitions,
  readCountries,
  readDataCustomFilter,
  readSchools,
  readStates,
  signupWithToken,
  updateCity,
} from "@/utilities/API";

import { notifications } from "@mantine/notifications";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";
import { useSelector } from "react-redux";
import { useTableDataMatrixQuery } from "@/redux/apiSlice";
import { genratePayload, handleApiData, iterateData } from "@/helpers/getData";
import { DateInput } from "@mantine/dates";
import { dateInputHandler, handleDropDownChange } from "@/helpers/dateHelpers";
import { formatDateString } from "@/helpers/dateHelpers";
import { createQrCode, readQrCode } from "@/utilities/API";
import { DateinputCustom } from "../utils";

function QrCodeForm({
  open,
  close,
  setData,
  setRowData,
  rowData,
  setFormTitle,
  readonly,
}: {
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: any;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [countriesData, setCountriesData] = useState<MatrixDataType>([]);
  const [oLoader, setOLoader] = useState<boolean>(false);
  const [schoolData, setSchoolData] = useState<MatrixDataType>([]);
  // const [competitionData, setCompetitionData] = useState<MatrixDataType>([]);
  const [amount, setAmount] = useState<Number>(0);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [allData, setAllData] = useState<any>({});
  const [price, setPrice] = useState<any>(0);
  const [loader, setLoader] = useState<any>(false);
  const [comeptitionsData, setCompetitionsData] = useState<MatrixDataType>([]);
  const [qrCodeImg, setQrCodeImg] = useState<any>("");

  const state: any = useSelector((state: any) => state.data);
  const countryId = state?.selectedCountry?._id;
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?._id;
  const country_selected: any = useSelector((state) => state);
  let qRId = rowData?._id; // get qr_id

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

  async function readCompetitionsData() {
    const competitions = await readCompetitions("status", true);
    setCompetitionsData(competitions);
  }

  async function fetchQrCode() {
    const countries = await readCountries("status", true);
    setCountriesData(countries);
  }

  async function readSchoolsData(
    filterBy?: "name" | "city",
    filterQuery?: string | number
  ) {
    let schools: MatrixDataType;
    if (filterBy && filterQuery) {
      schools = await readSchools(filterBy, filterQuery);
    } else {
      schools = await readSchools();
    }

    setSchoolData(schools);
  }

  const fetchQRcodeBaseOnId = () => {
    if (qRId) {
      let data = {
        qr_id: qRId,
        base_url: "http://ignitedmindlab.org",
      };
      FetchQRCODE(data)
        .then((res) => {
          console.log("res", res);
          if (res?.status === 200) {
            let data = res?.data?.response?.[0];
            setQrCodeImg(data?.qrcode);
            notifications.show({
              title: "Success !",
              message: "",
            });
          }
        })
        .catch((err) => {
          notifications.show({
            title: "Something went wrong!",
            message: "",
            color: "red",
          });
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchQRcodeBaseOnId();
    readSchoolsData();
    fetchQrCode();
    readCompetitionsData();

    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.school}`);
      else setFormTitle(`Update ${rowData.school}`);
    } else {
      setFormTitle(`Add QrCode`);
    }

    setPrice(rowData?.amount);
  }, []);

  const schoolNames = filterData(schoolData, "label", "value", "_id");

  // useEffect(() => {
  //   if (rowData?.country_id) {
  //     let findJson = findFromJson(countriesData, rowData.country_id, "_id");
  //     readStatesData("country", findJson.name);
  //   }
  // }, [!!countriesData.length, rowData?.country_id]);

  const form = useForm({
    initialValues: {
      ...rowData,
    },
    validate: {
      school: (value) => (value.length === 0 ? "Select School" : null),
      amount: (value) => (amount !== 0 ? "State must be selected" : null),
      competition: (value) =>
        value.length === 0 ? "Select Competition" : null,
    },
  });

  // let formvalues: any = form.values;
  // console.log("🚀 ~ formvalues:", formvalues);

  // const onHandleSubmit = async (values: any) => {
  //   setOLoader(true);
  //   values = { ...values };
  //   if (rowData !== undefined) {
  //     const isCityUpdated = await updateCity(rowData._id, values);
  //     if (isCityUpdated.toUpperCase() === "DOCUMENT UPDATED") {
  //       const cities = await readCities();
  //       setData(cities);
  //       setOLoader(false);
  //     } else {
  //       setOLoader(false);
  //     }
  //     setRowData(undefined);
  //     notifications.show({
  //       title: `City ${rowData.name} updated!`,
  //       message: `The above city has been updated with new information.`,
  //       color: "blue",
  //     });
  //   } else {
  //     const isCityCreated = await createCity(values as MatrixRowType);
  //     if (isCityCreated.toUpperCase() === "DOCUMENT CREATED") {
  //       const cities = await readCities();
  //       setData(cities);
  //       setOLoader(false);
  //       notifications.show({
  //         title: `City created!`,
  //         message: `A new city has been created.`,
  //         color: "green",
  //       });
  //     } else if (isCityCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
  //       setOLoader(false);
  //       notifications.show({
  //         title: `City already exists!`,
  //         message: `${values.name} already exists.`,
  //         color: "orange",
  //       });
  //     } else {
  //       setOLoader(false);
  //     }
  //   }
  //   form.setValues({
  //     name: "",
  //     state_id: "",
  //     country_id: "",
  //     status: true,
  //   });
  //   close();
  // };

  // const onChangeCountry = async (event: any) => {
  //   form.setFieldValue("country_id", event ?? "");
  //   form.setFieldValue("state_id", "");
  //   let findJson = findFromJson(countriesData, event, "_id");
  //   await readStatesData("country", findJson.name ?? "");
  // };

  // const stateNames = statesData.filter((c) => Boolean(c.status)).map((state) => state.name);
  const stateNames = filterData(statesData, "label", "value", "_id");
  const countryNames = filterData(countriesData, "label", "value", "_id");

  // const countryNames = countriesData.filter((c) => Boolean(c.status)).map((country) => country.name);

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

  const handleStartDateChange = (e: any) => {
    setStartDate(e);
  };

  const handleEndDateChange = (e: any) => {
    setEndDate(e);
  };

  const onChangeCompetitions = async (event: string) => {
    form.setFieldValue("competition_id", event ?? "");
  };

  const fetchQrCodeData = async () => {
    const qrCodeData = await readQrCode("country_id", selectedCountry);
    console.log("🚀 ~ fetchQrCodeData ~ qrCodeData:", qrCodeData);
    setData(qrCodeData);
    setLoader(false);
  };

  const handleGenerateQrReq = () => {
    setLoader(true);

    const competitionId = competitionData.filter(
      (competition: any) => competition.value == allData.competition
    )[0]?._id;

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
          close();
          fetchQrCodeData();
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

  const competitionsNames = filterData(
    comeptitionsData,
    "label",
    "value",
    "_id"
  );

  let filters = [
    {
      label: "School",
      type: "multiselect",
      data: schoolsData,
      onchange: (e: any) => {
        handleDropDownChange(e, "school", allData, setAllData);
      },
      style: { maxWidth: "35%" },
      value: allData.school || "",
    },
    {
      label: "Competition",
      type: "select",
      data: competitionData,
      onchange: (e: any) => {
        handleDropDownChange(e, "competition", allData, setAllData);
      },
      style: { maxWidth: "35%" },
      value: allData.competition || "",
    },
    {
      label: "Amount",
      type: "Text",
      data: price,
      onchange: (e: any) => {
        setPrice(e.target.value);
      },
      style: { maxWidth: "35%" },
      value: price || "",
    },
  ];

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
              disabled={readonly}
              searchable
              data={schoolNames}
              label={"Schools"}
              name="schools"
              mt={"md"}
              size="md"
              {...form.getInputProps("school_id")}
              onChange={(event) => {
                form.setFieldValue("school_id", event ?? "");
              }}
              w={"100%"}
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
              disabled={readonly}
              withAsterisk
              label="Amount"
              name="Amount"
              placeholder="Amount"
              {...form.getInputProps("amount")}
              w={"100%"}
              mt={"md"}
              size="md"
              onChange={(event) => {
                form.setFieldValue("amount", event.currentTarget.value);
              }}
            />
          </div>
        );
      } else {
        return (
          <div key={index} style={{ maxWidth: "15%", ...style }}>
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={competitionsNames}
              label={"Competition"}
              name="competition"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("competition_id")}
              onChange={onChangeCompetitions}
              w={"100%"}
            />
          </div>
        );
      }
    });
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

  const downloadQrCode = async (imageSrc: any) => {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "QrCode-image.jpg"; // Set the file name

    // Append the anchor to the body
    document.body.appendChild(link);

    // Programmatically click the anchor to trigger the download
    link.click();

    // Remove the anchor from the document
    document.body.removeChild(link);

    // Release the object URL
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box maw={"100%"} mx="auto" mih={500}>
      {/* <form onSubmit={form.onSubmit(onHandleSubmit)}> */}
      <LoadingOverlay visible={oLoader} overlayBlur={2} />
      {qrCodeImg && (
        <div className="d-flex flex-column justify-content-center">
          <img
            src={qrCodeImg}
            height="350px"
            width="350px"
            style={{ alignSelf: "center" }}
          />
          <Button
            className="btn btn-primary mt-4"
            onClick={() => downloadQrCode(qrCodeImg)}
            style={{ width: "250px", alignSelf: "center" }}
          >
            Download Qr Code
          </Button>
        </div>
      )}
      {/* <div className="m-4">
        <div className="d-flex flex-wrap gap-4">{renderData()}</div>

        <div className="d-flex flex-wrap gap-4">
          <div className="mt-4">
            <DateinputCustom
              inputProps={{
                popoverProps: {
                  withinPortal: true,
                },
                disabled: readonly,
                withAsterisk: true,
                name: "start_date",
                label: "Start Date",
                ...form.getInputProps("start_date"),
                w: "100%",
                mt: "md",
                size: "md",
                minDate: dateInputHandler(form.values.start_date),
              }}
            />
          </div>

          <div className="mt-4">
            <DateinputCustom
              inputProps={{
                popoverProps: {
                  withinPortal: true,
                },
                disabled: readonly,
                withAsterisk: true,
                name: "expiration_date",
                label: "Expiration Date",
                ...form.getInputProps("expiration_date"),
                w: "100%",
                mt: "md",
                size: "md",
                minDate: dateInputHandler(form.values.expiration_date),
              }}
            />
          </div>

          {readonly ? (
            ""
          ) : (
            <div className="mt-5">
              <Button
                className="btn btn-primary "
                onClick={() => handleGenerateQrReq()}
                // disabled={
                //   !allData.school?.length ||
                //   !allData.competition ||
                //   !price ||
                //   +price < 1 ||
                //   startDate == null ||
                //   endDate == null
                // }
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div> */}
    </Box>
  );
}

export { QrCodeForm };
