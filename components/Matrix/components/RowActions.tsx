import { ActionIcon, Button, Dialog, Flex, Switch, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconEye, IconSettings } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { FormType, MatrixDataType, MatrixRowType } from "../types";
import { Dispatch, useState, useEffect, SetStateAction } from "react";
import {
  deleteRow,
  readAdmins,
  readBoards,
  readCities,
  readClasses,
  readCompetitions,
  readCountries,
  readExamCenters,
  readExamCentersMapping,
  readOrderConfigs,
  readPayments,
  readProductCategories,
  readProducts,
  readRelationshipManagers,
  readSMSConfigs,
  readSMTPConfigs,
  readSchools,
  readSiteConfigs,
  readStates,
  readStudents,
  readSubjects,
  readSuperAdmins,
  readTeachers,
  readTempates,
  unDeleteRow,
  updateDataRes,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { findFromJson } from "@/helpers/filterFromJson";
import { useSelector } from "react-redux";

export const formTypeToTableMapper = (formType: FormType) => {
  const mapper: any = {
    Students: "users",
    Teachers: "users",
    "Relationship Managers": "users",
    "Super Admins": "users",
    Admins: "users",
    Country: "countries",
    State: "states",
    City: "cities",
    Competition: "competitions",
    // Annoucements: 'annoucements',
    Board: "boards",
    School: "schools",
    Class: "classes",
    "Exam Center": "exam_centers",
    "Exam Center Mappings": "exam_center_mapping",
    Subjects: "subjects",
    SMTPConfigs: "smtp_configs",
    SMSConfigs: "sms_configs",
    OrderConfigs: "order_configs",
    SiteConfigs: "site_configs",
    Templates: "templates",
    Products: "products",
    Payments: "payments",
    ProductCategory: "product_types",
  };
  return mapper[formType];
};

export const formTypeToFetcherMapper = (formType: FormType) => {
  const mapper: any = {
    Students: readStudents,
    Teachers: readTeachers,
    "Relationship Managers": readRelationshipManagers,
    "Super Admins": readSuperAdmins,
    Admins: readAdmins,
    Country: readCountries,
    State: readStates,
    City: readCities,
    Competition: readCompetitions,
    Board: readBoards,
    School: readSchools,
    Class: readClasses,
    "Exam Center": readExamCenters,
    "Exam Center Mappings": readExamCentersMapping,
    Subjects: readSubjects,
    SMTPConfigs: readSMTPConfigs,
    SMSConfigs: readSMSConfigs,
    SiteConfigs: readSiteConfigs,
    OrderConfigs: readOrderConfigs,
    Templates: readTempates,
    Products: readProducts,
    Payments: readPayments,
    ProductCategory: readProductCategories,
  };

  return mapper[formType];
};

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
  siteJson,
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
  siteJson?: any;
}) => {
  const [permissionsData, setPermissionsData] = useState<any>({});
  const pathname = usePathname();

  const isUserForm = formTypeToTableMapper(formType) == "users" && formType != "Students";

  const handleisValid = (pathname: string) => {
    if (pathname.includes("/")) {
      let arrKey = pathname.split("/");
      pathname = pathname.split("/")[arrKey.length - 1];
    }
    let data = findFromJson(siteJson, pathname, "link");
    setPermissionsData({ ...data });
  };

  const reduxData: any = useSelector((state) => state);
  let defaultShow = reduxData?.authentication?.user?.role == "super_admin";

  useEffect(() => {
    handleisValid(pathname);
  }, [pathname, siteJson]);

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
    </Flex>
  );
};

export { RowActions };
