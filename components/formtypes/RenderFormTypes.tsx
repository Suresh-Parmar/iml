import React, { useEffect, useState } from "react";
import { fuzzySort } from "../Matrix/utilities";
import { IconTableOptions } from "@tabler/icons-react";
import { RowActions } from "../Matrix/components/RowActions";
import { allTypes } from "./renderTypesJson";
import { useSelector } from "react-redux";
import { readApiData, updateDataRes } from "@/utilities/API";
import { siteJson as siteJsonData } from "@/components/permissions";
import { usePathname } from "next/navigation";
import { collectionNameGenrate, findFromJson } from "@/helpers/filterFromJson";
import { formTypeToTableMapper } from "@/helpers/formTypeMapper";
import { setGetData } from "@/helpers/getLocalStorage";

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
  extra?: any,
  showCreateForm?: any,
  checkboxData?: any
) {
  const [siteJson, setSiteJson] = useState<any>(siteJsonData);
  const [permissionsData, setPermissionsData] = useState<any>({});
  const pathname: any = usePathname();

  let getLocalStorageDataRoles = setGetData("rolemappings", "", true);
  let activeUserID = setGetData("userData", "", true)?.user?._id;

  const getServerRoleMatrix = () => {
    updateDataRes("rolemappings", "", "name", activeUserID, "find_many")
      .then((res) => {
        let data = res?.data?.response[0];
        if (data && data?.data) {
          setGetData("rolemappings", data.data, true);
          setSiteJson([...data.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let fetchData = () => {
    if (getLocalStorageDataRoles) {
      setSiteJson(getLocalStorageDataRoles);
    } else {
      getServerRoleMatrix();
    }
  };

  const handleisValid = (pathname: string) => {
    if (pathname.includes("/")) {
      let arrKey = pathname.split("/");
      pathname = pathname.split("/")[arrKey.length - 1];
    }
    let data = findFromJson(siteJson, pathname, "link");
    setPermissionsData({ ...data });
  };

  let isSuperAdmin = setGetData("userData", "", true)?.user?.role == "super_admin";

  let isUserForm = formTypeToTableMapper(formType) == "users";
  let showResetPassword = isSuperAdmin && isUserForm;

  useEffect(() => {
    handleisValid(pathname);
  }, [pathname, siteJson]);

  useEffect(() => {
    activeUserID && !isSuperAdmin && fetchData();
  }, [activeUserID]);

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
          defaultShow={isSuperAdmin}
          permissionsData={permissionsData}
          showResetPassword={showResetPassword}
          showCreateForm={showCreateForm}
          checkboxData={checkboxData}
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
              showData = "Inactive";
            } else {
              showData = "";
            }
          } else if (showData === true) {
            showData = "Active";
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
