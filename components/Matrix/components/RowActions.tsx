import { ActionIcon, Button, Dialog, Flex, Switch, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconEye, IconLock, IconPassword, IconRefresh, IconSettings } from "@tabler/icons-react";
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
        console.log(res, "resres");
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
          Are you sure you want to mark {formType} {id} {label} as {status ? "in-active" : "active"}?
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
                  title: `${formType} ${id} ${label} marked as ${status ? "in-active" : "active"}`,
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
          <span className="material-symbols-outlined pointer gray" onClick={trackShipmentDetails}>
            distance
          </span>
        ) : (
          ""
        )
      ) : (permissionsData?.permissions?.delete && showStatus) || defaultShow ? (
        <Tooltip label={status ? "Disable the user" : "Enable the user"}>
          <Switch
            checked={status ? true : false}
            onChange={() => {
              dialogToggle();
            }}
          />
        </Tooltip>
      ) : null}
      {((permissionsData?.permissions?.update && showEdit) || defaultShow) && showCreateForm ? (
        <ActionIcon
          onClick={(event) => {
            setReadOnly(false);
            setRowData(row.original);
            open();
          }}
        >
          <IconEdit size={"1.5rem"} />
        </ActionIcon>
      ) : null}
      {(permissionsData?.permissions?.update || defaultShow) && showEdit && isUserForm ? (
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
      ) : null}
      {showCreateForm && (
        <ActionIcon
          onClick={(event) => {
            setReadOnly(true);
            setRowData(row.original);
            open();
          }}
        >
          <IconEye size={"1.5rem"} />
        </ActionIcon>
      )}
      {showResetPassword && (
        <ActionIcon onClick={resetPassWord}>
          <IconRefresh size={"1.5rem"} />
        </ActionIcon>
      )}
      {isDispatchForm ? (
        labelData || label_url ? (
          <a href={labelData || label_url} target="_blank" className="text-success">
            <span className="material-symbols-outlined">download</span>
          </a>
        ) : (
          <span className="material-symbols-outlined pointer gray" onClick={createShipment}>
            box_add
          </span>
        )
      ) : (
        ""
      )}
      <DispatchModalData data={shipmentDetails} />
      <Loader show={loading} />
    </Flex>
  );
};

export { RowActions };
