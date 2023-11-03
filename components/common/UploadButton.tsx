import React, { useState, useEffect } from "react";
import { Box, Button, FileInput } from "@mantine/core";
import { IconDownload, IconFileSpreadsheet, IconUpload } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  downloadSample,
  updateDataRes,
  updateSpreadsheet,
  updateSpreadsheetStudent,
  uploadSpreadsheet,
  uploadSpreadsheetStudent,
} from "@/utilities/API";
import { UseFormReturnType, useForm } from "@mantine/form";

import ModalBox from "./Modal";
import DownloadFile from "../DownloadFile";
import { saveExcel } from "@/helpers/validations";
import { usePathname } from "next/navigation";
import { findFromJson } from "@/helpers/filterFromJson";
import { siteJson as siteJsonData } from "../permissions";
import { useSelector } from "react-redux";
import { formTypeToTableMapper } from "@/helpers/formTypeMapper";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";
import Loader from "./Loader";
import { useRoleCrudOpsgetQuery } from "@/redux/apiSlice";
import { iterateData } from "@/helpers/getData";
import { setGetData } from "@/helpers/getLocalStorage";

interface SpreadSheetFormValues {
  spreadSheetFile: File | undefined;
  updateSpreadSheetFile: File | undefined;
}

const SpreadSheetFIleInput = ({
  form,
  title = "",
  fileKey = "",
}: {
  form: UseFormReturnType<SpreadSheetFormValues>;
  title: string;
  fileKey: string;
}) => {
  return (
    <FileInput
      {...form.getInputProps(fileKey || "spreadSheetFile")}
      mx={"xs"}
      maw="75%"
      miw="75%"
      radius={"sm"}
      label={title || "Upload Spreadsheet"}
      required
      placeholder={title || "Upload spreadsheet"}
      icon={<IconFileSpreadsheet size={"1.5rem"} />}
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    />
  );
};

function UploadButton(props: any) {
  const { formType, data, setData, label } = props;
  const [openModal, setOpenModal] = useState(false);
  const [permissionsData, setPermissionsData] = useState<any>({});
  const [siteJson, setSiteJson] = useState<any>(siteJsonData);
  const [loader, setLoader] = useState<any>(false);
  const pathname: any = usePathname();
  const reduxData: any = useSelector((state: any) => state?.data);

  let userData = setGetData("userData", "", true) || {};

  let activeUserID = userData?.user?._id;
  let defaultShow = userData?.user?.role == "super_admin";
  let selectedCountry = reduxData?.selectedCountry?.name;

  let rolesData = useRoleCrudOpsgetQuery(activeUserID);
  rolesData = iterateData(rolesData);

  useEffect(() => {
    if (loader) {
      notifications.show({
        title: `uploading ...`,
        loading: true,
        message: ``,
        color: "green",
        autoClose: 1000,
      });
    }
  }, [loader]);

  // let fetchData = () => {
  //   setLoader(true);
  //   updateDataRes("rolemappings", "", "name", activeUserID, "find_many")
  //     .then((res) => {
  //       setLoader(false);
  //       let data = res?.data?.response[0];
  //       if (data && data?.data) {
  //         setSiteJson([...data.data]);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    if (rolesData[0]?.data && Array.isArray(rolesData[0].data)) {
      setSiteJson(rolesData[0]?.data);
    }
  }, [rolesData]);

  const handleisValid = (pathname: string) => {
    if (pathname.includes("/")) {
      let arrKey = pathname.split("/");
      pathname = pathname.split("/")[arrKey.length - 1];
    }
    let data = findFromJson(siteJson, pathname, "link");
    setPermissionsData(data);
  };

  useEffect(() => {
    handleisValid(pathname);
  }, [pathname]);

  useEffect(() => {
    form.values.spreadSheetFile = undefined;
    form.values.updateSpreadSheetFile = undefined;
  }, [openModal]);

  const form = useForm<SpreadSheetFormValues>({
    initialValues: {
      spreadSheetFile: undefined,
      updateSpreadSheetFile: undefined,
    },
  });

  let lowercaseType = formType.toLowerCase();

  const json: any = {
    students: {
      collection_name: "users",
      filter_type: "student",
    },
    teachers: {
      collection_name: "users",
      filter_type: "teacher",
    },
    "relationship managers": {
      collection_name: "users",
      filter_type: "rm",
    },
    admin: {
      collection_name: "users",
      filter_type: "admin",
    },
    classes: {
      collection_name: "classes",
    },
    boards: {
      collection_name: "boards",
    },
    competitions: {
      collection_name: "competitions",
    },
    "exam center": {
      collection_name: "exam_centers",
    },
    schools: {
      collection_name: "schools",
    },
    subjects: {
      collection_name: "subjects",
    },
    country: {
      collection_name: "countries",
    },
    state: {
      collection_name: "states",
    },
    city: {
      collection_name: "cities",
    },
    "exam center mappings": {
      collection_name: "exam_center_mapping",
    },
    dispatch: {
      collection_name: "payments",
    },
  };

  let collection = {};

  if (json[lowercaseType]) {
    collection = json[lowercaseType];
  } else {
    if (!lowercaseType.endsWith("s")) {
      lowercaseType += "s";
    } else if (lowercaseType.endsWith("ss")) {
      lowercaseType += "es";
    }
    collection = { collection_name: lowercaseType };
  }

  let apiCall = (isUpdate: boolean) => {
    if (isUpdate) {
      if (formType == "Students") {
        return updateSpreadsheetStudent;
      } else {
        return updateSpreadsheet;
      }
    } else {
      if (formType == "Students") {
        return (file: any, collection: any, meta_data: any) => {
          let newMetaData = JSON.stringify({ country: selectedCountry });
          return uploadSpreadsheetStudent(file, collection, newMetaData);
        };
      } else {
        return uploadSpreadsheet;
      }
    }
  };

  const handleClick = async (isUpdate: boolean) => {
    let confirm = window.confirm("Are you sure you want to import the excel file?");

    if (!confirm) {
      return;
    }

    setLoader(true);
    let file = isUpdate ? form.values.updateSpreadSheetFile : form.values.spreadSheetFile;
    let meta_data: any = JSON.stringify(collection);
    if (formType && file) {
      const tableName = formTypeToTableMapper(formType);
      apiCall(isUpdate)(file, tableName, meta_data)
        .then((res) => {
          setLoader(false);
          setTimeout(() => {
            notifications.show({
              title: `File processed successfully!`,
              message: `The data in the spreadsheet has been processed and the table has been refreshed.`,
              color: "green",
              autoClose: 8000,
            });
          }, 1200);
          setOpenModal(false);

          let data;

          if (res.response && res.response["data with not correct parameters"]) {
            data = res.response["data with not correct parameters"];
          } else if (res["data not found"]) {
            data = res["data not found"];
          }

          saveExcel(data, "", "", formType, true);
          let fetchGridData = async () => {
            const fetcher = await formTypeToFetcherMapper(formType)();
            setData(fetcher);
          };
          fetchGridData();

          form.setValues({
            spreadSheetFile: undefined,
            updateSpreadSheetFile: undefined,
          });
        })
        .catch((err) => {
          setLoader(false);
          setOpenModal(false);
          setTimeout(() => {
            notifications.show({
              title: `Failed to upload !`,
              message: `For some reasons file uploading failed, please contact administrator.`,
              color: "red",
            });
          }, 1200);
        });
    } else {
      form.setValues({
        spreadSheetFile: undefined,
        updateSpreadSheetFile: undefined,
      });
      setTimeout(() => {
        notifications.show({
          title: `No file found!`,
          message: `If you have selected a file already, please re-select it.`,
          color: "red",
        });
      }, 1200);
    }
  };

  const renderUploadFunction = (isUpdate: boolean, isDisabled: any) => {
    return (
      <Button
        mt="auto"
        color={isDisabled ? "gray" : ""}
        variant={isDisabled ? "white" : "filled"}
        onClick={() => !isDisabled && handleClick(isUpdate)}
      >
        <IconUpload size={"1.5rem"} />
      </Button>
    );
  };

  const downloadSampleFile = () => {
    return downloadSample(collection);
  };

  const renderUploadIcon = () => (
    <Button
      mr={"xs"}
      variant={"filled"}
      onClick={() => {
        setOpenModal(!openModal);
      }}
    >
      <IconUpload size={"1.5rem"} />
    </Button>
  );

  const renderModal = () => {
    return (
      <ModalBox title={label || formType} open={openModal} setOpen={setOpenModal}>
        <Box mx={30} pt={10} style={{ cursor: "pointer" }}>
          <DownloadFile
            data={[]}
            fetchData={downloadSampleFile}
            formType={formType}
            filterString=""
            ShowIcon={IconDownload}
            title={`${label || formType} Template`}
            hideMsg={true}
          />
        </Box>
        <Box p={20}>
          {(permissionsData?.permissions?.uploadFile || defaultShow) && (
            <Box display="flex" m="auto" style={{ alignItems: "baseline" }}>
              <SpreadSheetFIleInput fileKey="spreadSheetFile" title="" form={form} />
              {renderUploadFunction(false, !form.values.spreadSheetFile)}
            </Box>
          )}
          {(permissionsData?.permissions?.updateFile || defaultShow) && (
            <Box display="flex" m="auto" mt={10} style={{ alignItems: "baseline" }}>
              <SpreadSheetFIleInput form={form} title="Update SpreadSheet" fileKey="updateSpreadSheetFile" />
              {renderUploadFunction(true, !form.values.updateSpreadSheetFile)}
            </Box>
          )}
        </Box>
        <Loader show={loader} />
      </ModalBox>
    );
  };

  return (
    <>
      {renderUploadIcon()}
      {openModal && renderModal()}
      <Loader show={loader} />
    </>
  );
}

export default UploadButton;
