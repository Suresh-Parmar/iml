import React from "react";
import { fuzzySort } from "../Matrix/utilities";
import { IconTableOptions } from "@tabler/icons-react";
import { RowActions } from "../Matrix/components/RowActions";
import { allTypes } from "./renderTypesJson";

function RenderFormTypes(
  formType: any,
  close: any,
  oLoader: any,
  open: any,
  rowData: any,
  setData: any,
  setReadOnly: any,
  setRowData: any,
  setOLoader: any,
  extra?: any
) {
  const renderTypes = () => {
    let data = [];

    if (allTypes[formType]) {
      data = allTypes[formType];
    }

    let allDataReturn: any[] = [];

    let actionsData = {
      id: "actions",
      cell: (props: any) => (
        <RowActions
          setReadOnly={setReadOnly}
          open={open}
          close={close}
          row={props.row}
          rowData={rowData}
          setRowData={setRowData}
          status={props.row.original.status}
          oLoader={oLoader}
          setOLoader={setOLoader}
          formType={formType}
          setData={setData}
          id={props.row.original._id}
          label={props.row.original.name}
          extra={extra}
        />
      ),
      header: () => (
        <span>
          <IconTableOptions size={"1.5rem"} />
        </span>
      ),
      footer: () => (
        <span>
          <IconTableOptions size={"0.75rem"} />
        </span>
      ),
    };

    data.map((item: any) => {
      let objData: any = {
        accessorFn: (row: any) => {
          let showData = row[item.key];
          if (!showData || showData == "nan") {
            if (showData === false) {
              showData = "false";
            } else {
              showData = "";
            }
          }

          return String(showData);
        },
        id: item["id"],
        cell: (info: any) => info.getValue(),
        header: () => <span>{item["id"]}</span>,
        footer: (props: any) => props.column.id,
      };

      if (item.filterFn) {
        objData.filterFn = item.filterFn;
      }
      if (item.sortingFn) {
        objData.sortingFn = item.sortingFn;
      }

      if (item.actions) {
        allDataReturn.push(actionsData);
      } else {
        allDataReturn.push(objData);
      }
    });

    return allDataReturn;
  };

  return renderTypes();
}

export default RenderFormTypes;
