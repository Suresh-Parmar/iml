import { ActionIcon, Button, Dialog, Flex, Switch, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconEye, IconLock, IconPassword, IconRefresh, IconSettings, IconTrash } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { FormType, MatrixDataType, MatrixRowType } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteRow, dispatchIDGenration, forgotCreds, trackShipment, unDeleteRow } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { formTypeToTableMapper } from "@/helpers/formTypeMapper";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";
import Loader from "@/components/common/Loader";
import { DispatchModalData } from "@/components/dispatch";

const RowActions = ({
  setReadOnly,
  open,
  close,
  row,
  rowData,
  setRowData,
  status,
  id,
  label,
  formType,
  setData,
  oLoader,
  setOLoader,
  extra,
  showStatus = true,
  showEdit = true,
  defaultShow,
  permissionsData,
  showResetPassword,
  showCreateForm,
  checkboxData,
}: {
  extra?: any;
  open: () => void;
  close: () => void;
  setReadOnly: Dispatch<SetStateAction<boolean>>;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  row: Row<MatrixRowType>;
  rowData: MatrixRowType | undefined;
  id: string;
  label?: string;
  formType: FormType;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  oLoader: boolean;
  setOLoader: Dispatch<SetStateAction<boolean>>;
  status: boolean;
  showStatus?: boolean;
  showEdit?: boolean;
  defaultShow?: any;
  permissionsData?: any;
  showResetPassword?: any;
  showCreateForm?: any;
  checkboxData?: any;
}) => {
  const isUserForm = formTypeToTableMapper(formType) == "users" && formType != "Students";
  const [dialogOpened, { toggle: dialogToggle, close: dialogClose }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);
  const [labelData, setLabelData] = useState("");
  const [shipmentDetails, setShipmentDetails] = useState("");
  let newFormType: any = formType;
  let isDispatchForm: any = newFormType === "Dispatch";

  let formRowData: any = row?.original;

  const resetPassWord = () => {
    let windowConfirm = window.confirm("Are you sure you want to reset Password?");
    if (!windowConfirm) {
      return;
    }

    let payload: any = {
      registration_details: row?.original?.username,
      ops_identifier: "reset_password",
    };

    forgotCreds(payload, true)
      .then((res) => {
        notifications.show({
          title: `Reset Password Successfully`,
          message: ``,
          autoClose: 8000,
        });
      })
      .catch((err) => {
        console.log(err, "resres");
      });
  };

  const createShipment = () => {
    let data: any = structuredClone(row?.original);
    let payload = { dispatch_id: data?.dispatch_id };
    // let payload = { dispatch_id: "D10020" };

    let windowConfirm = window.confirm("Are you sure you want to create shipment");
    if (windowConfirm && data?.dispatch_id) {
      setLoading(true);
      dispatchIDGenration(payload)
        .then((res) => {
          setLabelData(res.data.label_url);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  let label_url = formRowData?.label_url;
  let invoice_url = formRowData?.invoice_url;

  const trackShipmentDetails = () => {
    let data = {
      shipment_id: formRowData.awb_number,
    };
    setLoading(true);
    trackShipment(data)
      .then((res) => {
        setLoading(false);
        setShipmentDetails(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const checkboxChecked = () => {
    if (checkboxData?.checked && Array.isArray(checkboxData?.checked)) {
      return checkboxData.checked.includes(row.original._id) || checkboxData.checked.includes("all");
    }
    return false;
  };

  const setChecked = (event: any) => {
    if (Array.isArray(checkboxData?.checked)) {
      if (event.target.checked) {
        if (!checkboxData.checked.includes(row?.original?._id)) {
          checkboxData.checked.push(row?.original?._id);
          if (checkboxData?.setChecked) {
            checkboxData?.setChecked([...checkboxData.checked]);
          }
        }
      } else {
        let checkedData = checkboxData?.checked.filter((id: any) => id !== row?.original?._id);
        if (checkboxData?.setChecked) {
          checkboxData?.setChecked([...checkedData]);
        }
      }
    }
  };

  return (
    <Flex mx={"xl"} direction={"row"} justify={"center"} align={"center"} gap={"xs"}>
      <Dialog
        withBorder
        transition={"slide-up"}
        transitionDuration={200}
        transitionTimingFunction={"linear"}
        opened={dialogOpened}
        withCloseButton
        onClose={dialogClose}
        shadow="xl"
        p={30}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" weight={500}>
          Are you sure you want to mark {formType} {label} as {status ? "in-active" : "active"}?
        </Text>
        <Flex align="center" gap={"sm"} justify={"flex-end"}>
          <Button variant={"light"} color={"green"} onClick={dialogClose}>
            No
          </Button>
          <Button
            variant={"filled"}
            color={"red"}
            onClick={async () => {
              setOLoader(true);
              let isDeleted: string;
              if (status) {
                isDeleted = await deleteRow(formTypeToTableMapper(formType), id);
              } else {
                isDeleted = await unDeleteRow(formTypeToTableMapper(formType), id);
              }
              if (isDeleted.toUpperCase() === "DOCUMENT UPDATED") {
                const dataLoader = formTypeToFetcherMapper(formType);
                const data = await dataLoader();
                setData(data);
                notifications.show({
                  title: `${formType}  ${label} marked as ${status ? "in-active" : "active"}`,
                  message: `The above ${formType} has been marked as ${status ? "in-active" : "active"}.`,
                  color: status ? "red" : "green",
                });
              }
              dialogClose();
              setOLoader(false);
            }}
          >
            Yes
          </Button>
        </Flex>
      </Dialog>

      {isDispatchForm ? (
        formRowData?.awb_number ? (
          <Tooltip label="Track Shipment">
            <span className="material-symbols-outlined pointer gray" onClick={trackShipmentDetails}>
              distance
            </span>
          </Tooltip>
        ) : (
          ""
        )
      ) : (permissionsData?.permissions?.delete && showStatus) || defaultShow ? (
        <div style={{ position: "relative" }}>
          <Tooltip label={status ? "Disable" : "Enable"}>
            <div>
              <Switch
                checked={status ? true : false}
                onChange={() => {
                  dialogToggle();
                }}
              />
            </div>
          </Tooltip>
        </div>
      ) : null}
      {((permissionsData?.permissions?.update && showEdit) || defaultShow) && showCreateForm ? (
        <Tooltip label="Edit">
          <ActionIcon
            onClick={(event) => {
              setReadOnly(false);
              setRowData(row.original);
              open();
            }}
          >
            <IconEdit size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
      ) : null}
      {(permissionsData?.permissions?.update || defaultShow) && showEdit && isUserForm ? (
        <Tooltip label="Edit">
          <ActionIcon
            onClick={(event) => {
              setReadOnly(false);
              setRowData(row.original);
              open();
              extra && extra("roles");
            }}
          >
            <IconSettings size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
      ) : null}
      {showCreateForm && (
        <Tooltip label="Preview">
          <ActionIcon
            onClick={(event) => {
              setReadOnly(true);
              setRowData(row.original);
              open();
            }}
          >
            <IconEye size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
      )}
      {(permissionsData?.permissions?.remove || defaultShow) && (
        <Tooltip label="Select">
          <input
            type="checkbox"
            checked={checkboxChecked()}
            style={{ minHeight: "40px", minWidth: "15px" }}
            onChange={setChecked}
          />
        </Tooltip>
      )}
      {showResetPassword && (
        <Tooltip label="Refresh">
          <ActionIcon onClick={resetPassWord}>
            <IconRefresh size={"1.5rem"} />
          </ActionIcon>
        </Tooltip>
      )}
      {isDispatchForm ? (
        <>
          {labelData || label_url ? (
            <Tooltip label="Download receipt">
              <a href={labelData || label_url} target="_blank" className="text-success">
                <span className="material-symbols-outlined">download</span>
              </a>
            </Tooltip>
          ) : (
            <Tooltip label="Create Shipment">
              <span className="material-symbols-outlined pointer gray" onClick={createShipment}>
                box_add
              </span>
            </Tooltip>
          )}
          {invoice_url && (
            <Tooltip label="Download invoice">
              <a href={invoice_url} target="_blank" className="text-success">
                <span className="material-symbols-outlined">apk_install</span>
              </a>
            </Tooltip>
          )}
        </>
      ) : (
        ""
      )}
      <DispatchModalData data={shipmentDetails} />
      <Loader show={loading} />
    </Flex>
  );
};

export { RowActions };
