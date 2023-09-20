import { ActionIcon, Button, Dialog, Flex, Switch, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconEye, IconLock, IconPassword, IconRefresh, IconSettings } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { FormType, MatrixDataType, MatrixRowType } from "../types";
import { Dispatch, SetStateAction } from "react";
import { deleteRow, unDeleteRow } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { formTypeToTableMapper } from "@/helpers/formTypeMapper";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";

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
}) => {
  const isUserForm = formTypeToTableMapper(formType) == "users" && formType != "Students";
  const [dialogOpened, { toggle: dialogToggle, close: dialogClose }] = useDisclosure(false);

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
      {(permissionsData?.permissions?.delete && showStatus) || defaultShow ? (
        <Tooltip label={status ? "Disable the user" : "Enable the user"}>
          <Switch
            checked={status ? true : false}
            onChange={() => {
              dialogToggle();
            }}
          />
        </Tooltip>
      ) : null}
      {(permissionsData?.permissions?.update && showEdit) || defaultShow ? (
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
      <ActionIcon
        onClick={(event) => {
          setReadOnly(true);
          setRowData(row.original);
          open();
        }}
      >
        <IconEye size={"1.5rem"} />
      </ActionIcon>
      {showResetPassword && (
        <ActionIcon
          onClick={(event) => {
            let windowConfirm = window.confirm("Are you sure you want to reset Password?");
          }}
        >
          <IconRefresh size={"1.5rem"} />
        </ActionIcon>
      )}
    </Flex>
  );
};

export { RowActions };
