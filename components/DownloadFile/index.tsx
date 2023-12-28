import React, { useEffect } from "react";
import { Box, Button, ThemeIcon, Tooltip } from "@mantine/core";
import { IconTableExport } from "@tabler/icons-react";
import { FormType, MatrixDataType } from "../Matrix/types";
import { notifications } from "@mantine/notifications";
import { saveExcel } from "@/helpers/validations";

type DownloadFileProps = {
  formType: any;
  data: MatrixDataType;
  filterString?: string;
  fetchData?: any;
  title?: any;
  ShowIcon?: any;
  hideMsg?: any;
  headers?: {
    key: string;
    header: string;
  }[];
};

export default function DownloadFile({
  formType,
  data = [],
  headers = [],
  filterString = "",
  fetchData,
  ShowIcon,
  title = "",
  hideMsg,
}: DownloadFileProps) {
  let fileName = formType + "-import-template";

  const prepareData = () => {
    if (fetchData) {
      fetchData().then((data: any) => {
        if (data.response) {
          notifications.show({
            message: data.response,
          });
        } else if (data) {
          saveExcel([data], "", filterString, fileName, hideMsg);
        }
      });
    }
  };

  const DownloadIcon = () => {
    if (title) {
      return (
        <Button onClick={prepareData}>
          {ShowIcon && <ShowIcon />} &nbsp; {title}
        </Button>
      );
    } else {
      return (
        <ThemeIcon
          mx={0}
          sx={(theme) => ({ padding: theme.spacing.xs, cursor: "pointer" })}
          size={36}
          onClick={() => saveExcel("", data, filterString, fileName, hideMsg)}
        >
          <Tooltip label="Export to XLSX File" position="left" offset={10}>
            <IconTableExport />
          </Tooltip>
        </ThemeIcon>
      );
    }
  };

  return DownloadIcon();
}
