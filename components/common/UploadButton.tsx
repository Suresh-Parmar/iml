"use client";

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
  const { formType, data, setData } = props;
  const [openModal, setOpenModal] = useState(false);
  const [permissionsData, setPermissionsData] = useState<any>({});
  const [siteJson, setSiteJson] = useState<any>(siteJsonData);

  const pathname: any = usePathname();

  const reduxData: any = useSelector((state) => state);
  let activeUserID = reduxData?.authentication?.user?._id;
  let defaultShow = reduxData?.authentication?.user?.role == "super_admin";

  let fetchData = () => {
    updateDataRes("rolemappings", "", "name", activeUserID, "find_many")
      .then((res) => {
        let data = res?.data?.response[0];
        if (data && data?.data) {
          setSiteJson([...data.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    activeUserID && !defaultShow && fetchData();
  }, [activeUserID]);

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
        return uploadSpreadsheetStudent;
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

    let file = isUpdate ? form.values.updateSpreadSheetFile : form.values.spreadSheetFile;
    let meta_data: any = JSON.stringify(collection);
    if (formType && file) {
      const tableName = formTypeToTableMapper(formType);
      apiCall(isUpdate)(file, tableName, meta_data)
        .then((res) => {
          notifications.show({
            title: `File processed successfully!`,
            message: `The data in the spreadsheet has been processed and the table has been refreshed.`,
            color: "green",
            autoClose: 8000,
          });

          let data = res.response["data with not correct parameters"];
          saveExcel(data, "", "", formType, true);

          form.setValues({
            spreadSheetFile: undefined,
            updateSpreadSheetFile: undefined,
          });
        })
        .catch((err) => {
          notifications.show({
            title: `Failed to upload !`,
            message: `For some reasons file uploading failed, please contact administrator.`,
            color: "red",
          });
        });

      const fetcher = formTypeToFetcherMapper(formType);
      const dataFetch = await fetcher();
      setData(dataFetch);
    } else {
      form.setValues({
        spreadSheetFile: undefined,
        updateSpreadSheetFile: undefined,
      });

      notifications.show({
        title: `No file found!`,
        message: `If you have selected a file already, please re-select it.`,
        color: "red",
      });
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
      <ModalBox title={formType} open={openModal} setOpen={setOpenModal}>
        <Box mx={30} pt={10} style={{ cursor: "pointer" }}>
          <DownloadFile
            data={[]}
            fetchData={downloadSampleFile}
            formType={formType}
            filterString=""
            ShowIcon={IconDownload}
            title={`${formType} Template`}
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
      </ModalBox>
    );
  };

  return (
    <>
      {renderUploadIcon()}
      {openModal && renderModal()}
    </>
  );
}

export default UploadButton;
