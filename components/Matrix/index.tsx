import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Flex,
  Paper,
  ScrollArea,
  Table as MantineTable,
  createStyles,
  rem,
  useMantineTheme,
  Checkbox,
  Container,
  Button,
  Modal,
  LoadingOverlay,
  Select,
  NumberInput,
  ActionIcon,
  Text,
  Menu,
  Box,
} from "@mantine/core";
import {
  ExpandedState,
  useReactTable,
  ColumnFiltersState,
  ColumnResizeMode,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel,
  FilterFn,
  flexRender,
  SortingState,
  ColumnOrderState,
  getPaginationRowModel,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconColumns,
  IconSearch,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { DebouncedInput } from "./components/DebouncedInput";
import { FormType, MatrixDataType, MatrixRowType, UsersTypes } from "./types";
import { fuzzyFilter } from "./utilities";
import ColumnHeader from "./components/ColumnHeader";
import { UserForm } from "../Forms/UserForm";
import { Studentsform } from "../Forms/Studentsform";
import { SchoolForm } from "../Forms/SchoolForm";
import { readExamCenters, updateDataRes } from "@/utilities/API";
import { CompetitionForm } from "../Forms/CompetitionForm";
import { ClassForm } from "../Forms/ClassForm";
import { BoardForm } from "../Forms/BoardForm";
import { ExamCenterForm } from "../Forms/ExamCenterForm";
import { ExamCenterMappingForm } from "../Forms/ExamCenterMappingForm";
import { CountryForm } from "../Forms/CountryForm";
import { CityForm } from "../Forms/CityForm";
import { StateForm } from "../Forms/StateForm";
import { SubjectsForm } from "../Forms/SubjectsForm";
import DownloadFile from "../DownloadFile";
import { SMTPForm } from "../Forms/SMTPForm";
import { SMSForm } from "../Forms/SMSForm";
import { SiteForm } from "../Forms/SiteConfigForm";
import { TemplatesForm } from "../Forms/TemplatesForm";
import { OrderConfigForm } from "../Forms/OrderConfigForm";
import { ProductForm } from "../Forms/ProductsForm";
import { ProductTypeForm } from "../Forms/ProductsTypeForm";
import { UploadButton } from "../common";
import { AnnouncementsForm, CohortsForm, GroupsForm, TestimonialsForm, DispatchForm, MarksSheetForm } from "../Forms";
import { RenderFormTypes } from "../formtypes";
import { allTypes } from "../formtypes/renderTypesJson";
import { usePathname } from "next/navigation";
import { findFromJson } from "@/helpers/filterFromJson";
import { siteJson as allJsonData } from "../permissions";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { useRoleCrudOpsgetQuery } from "@/redux/apiSlice";
import { iterateData } from "@/helpers/getData";
import { WarehouseForm } from "../Forms/WarehouseForm";
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const useStyles = createStyles((theme) => ({
  toolbar: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    },
  },
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    zIndex: 1,

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    },
  },
  footer: {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    },
  },
}));

type MatrixProps = {
  data: MatrixDataType | Array<{}> | any;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  showCreateForm: boolean;
  formType?: FormType | any;
  formTypeData?: any;
};

function Matrix({ data, setData, showCreateForm, formType, formTypeData = {}, showLabel }: any) {
  const theme = useMantineTheme();
  let colorScheme = setGetData("colorScheme");

  const { classes, cx } = useStyles(colorScheme);
  const [oLoader, setOLoader] = useState<boolean>(false);
  const [rowData, setRowData] = useState<MatrixRowType>();

  const reduxData: any = useSelector((state) => state);

  const clientState = reduxData.data;
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [permissionsData, setPermissionsData] = useState<any>({});
  const [siteJson, setSiteJson] = useState<any>(allJsonData);

  const pathname = usePathname();

  let userData: any = setGetData("userData", false, true);
  let activeUserID = userData?.user?._id;
  let defaultShow = userData?.metadata?.role == "super_admin";

  let rolesData = useRoleCrudOpsgetQuery(activeUserID);
  rolesData = iterateData(rolesData);

  // let fetchData = () => {
  //   updateDataRes("rolemappings", "", "name", activeUserID, "find_many")
  //     .then((res) => {
  //       let data = res?.data?.response[0];
  //       if (data && data?.data) {
  //         setSiteJson([...data.data]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    if (rolesData[0]?.data && Array.isArray(rolesData[0].data)) {
      setSiteJson(rolesData[0]?.data);
    }
    // activeUserID && !defaultShow && fetchData();
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
  }, [pathname, siteJson]);

  const setColumnData = () => {
    let data = allTypes[formType];
    data = data || [];
    let dataObj: any = {};
    data.forEach((item: any) => {
      if (item.id) {
        dataObj[item.id] = !!item.defaultShow;
      }
    });
    return dataObj;
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(setColumnData());
  const [opened, { open, close }] = useDisclosure(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [isExtra, setIsExtra] = useState<any>(false);

  const columns = RenderFormTypes(
    formType,
    close,
    oLoader,
    open,
    rowData,
    setData,
    setReadOnly,
    setRowData,
    setOLoader,
    setIsExtra,
    showCreateForm
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(columns.map((column) => column.id as string));

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const renderUploadButton = (formType: any, data: object[]) => {
    if (permissionsData?.permissions?.updateFile || permissionsData?.permissions?.uploadFile || defaultShow) {
      return (
        <Box ml={10}>
          <UploadButton formType={formType} data={data} setData={setData} label={showLabel} />
        </Box>
      );
    }
    return;
  };

  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnOrder,
      columnVisibility,
      sorting,
      columnFilters,
      globalFilter,
      expanded,
      pagination,
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
    onExpandedChange: setExpanded,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const [examCentersData, setExamCentersData] = useState<MatrixDataType>([]);

  async function readExamCentersData() {
    const examCenters = await readExamCenters();
    setExamCentersData(examCenters);
  }

  useEffect(() => {
    readExamCentersData();
    if (table.getState().columnFilters[0]?.id === "Name") {
      if (table.getState().sorting[0]?.id !== "Name") {
        table.setSorting([{ id: "Name", desc: false }]);
      }
    }
  }, [table]);
  const [formTitle, setFormTitle] = useState<string>("...");

  const components: Record<string, React.ComponentType<any>> = {
    Country: CountryForm,
    State: StateForm,
    City: CityForm,
    Students: Studentsform,
    Teachers: UserForm,
    "Relationship Managers": UserForm,
    "Super Admins": UserForm,
    Admins: UserForm,
    Competition: CompetitionForm,
    School: SchoolForm,
    Class: ClassForm,
    SMTPConfigs: SMTPForm,
    SMSConfigs: SMSForm,
    SiteConfigs: SiteForm,
    OrderConfigs: OrderConfigForm,
    Templates: TemplatesForm,
    Subjects: SubjectsForm,
    Board: BoardForm,
    Products: ProductForm,
    ProductCategory: ProductTypeForm,
    "Exam Center": ExamCenterForm,
    "Exam Center Mappings": ExamCenterMappingForm,
    announcements: AnnouncementsForm,
    Dispatch: DispatchForm,
    testimonials: TestimonialsForm,
    groups: GroupsForm,
    cohorts: CohortsForm,
    warehouses: WarehouseForm,
    marks: MarksSheetForm,
  };

  const Component = components[formType];

  const getAddFormType = (formType: string) => {
    if (Component) {
      return (
        <Component
          readonly={readOnly}
          setFormTitle={setFormTitle}
          open={open}
          close={() => {
            setIsExtra(false);
            close();
          }}
          isExtra={isExtra}
          setData={setData}
          setRowData={setRowData}
          rowData={rowData}
          formType={formType}
          examCenterCode={
            formType === "Exam Center Mappings"
              ? examCentersData.find((ec) => ec._id === rowData?.exam_center_code)?.name ?? ""
              : ""
          }
        />
      );
    }
  };

  const addForm = getAddFormType(formType);

  return (
    <Container
      fluid
      h={"100%"}
      px={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* --data '{
    "school_names":[
        "Learners'\'' Academy, Bandra (W), Mumbai"
    ],
    "email_short_name":"Online GF Admit Card",
    "smtp_name":"Socketlabs IML",
    "subject":"This is a test subject by ankit",
    "city":"PANVEL",
    "competition":"Mental Maths Competition - 2023" */}

      <Modal
        opened={opened}
        onClose={() => {
          setIsExtra(false);
          close();
        }}
        closeOnClickOutside={false}
        title={`${formTitle}`}
        centered
        size={isExtra ? "100%" : "75%"}
        overlayProps={{
          color: colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        transitionProps={{
          transition: "slide-up",
          duration: 200,
          timingFunction: "linear",
        }}
      >
        {addForm}
      </Modal>
      <Paper p={"xs"} w={"100%"} pos={"sticky"} top={0} className={cx(classes.toolbar)}>
        <Flex direction={"row"} justify={"space-between"} align={"center"}>
          <Flex direction={"row"} justify={"center"} align={"center"}>
            <ActionIcon
              variant="light"
              ml={"xs"}
              onClick={() => {
                table.setPageIndex(0);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft size={"1.5rem"} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              ml={"xs"}
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft size={"1.5rem"} />
            </ActionIcon>
            <Flex mx={"xs"} direction={"row"} justify={"center"} align={"center"}>
              <NumberInput
                size={"xs"}
                maw={75}
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                value={table.getState().pagination.pageIndex + 1}
                max={table.getPageCount()}
                min={1}
                onChange={(e) => {
                  const page = e ? Number(e) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </Flex>
            <ActionIcon
              variant="light"
              mr={"xs"}
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight size={"1.5rem"} />
            </ActionIcon>

            <ActionIcon
              variant="light"
              mr={"xs"}
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight size={"1.5rem"} />
            </ActionIcon>

            <Select
              withinPortal
              maw={75}
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e) => {
                table.setPageSize(Number(e));
              }}
              data={[10, 20, 30, 40, 50].map((pageSize) => `${pageSize}`)}
            />

            {/* Table No of Rows */}
            {table.getPrePaginationRowModel().rows.length === table.getCoreRowModel().rows.length ? (
              <Text ml={"xs"} fz={"md"}>
                {table.getCoreRowModel().rows.length} rows
              </Text>
            ) : (
              <Text ml={"xs"} fz={"md"}>
                {table.getPrePaginationRowModel().rows.length} filtered rows
              </Text>
            )}
          </Flex>
          <Menu withinPortal closeOnItemClick={false} withArrow shadow="md" width={600}>
            <Menu.Target>
              <ActionIcon>
                <IconColumns size={"1.5rem"} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Checkbox
                  checked={table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                  label={table.getIsAllColumnsVisible() ? "Hide All Columns" : "Show All Columns"}
                />
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Manage Column Visibility</Menu.Label>
              <Flex w={"100%"} direction={"row"} wrap={"wrap"} justify={"flex-start"} align={"center"}>
                {table.getAllLeafColumns().map((column, index) => {
                  if (column.id !== "actions")
                    return (
                      <Menu.Item w={"33%"} key={column.id + index}>
                        <Checkbox
                          label={column.id}
                          {...{
                            checked: column.getIsVisible(),
                            onChange: column.getToggleVisibilityHandler(),
                          }}
                        />
                      </Menu.Item>
                    );
                })}
              </Flex>
            </Menu.Dropdown>
          </Menu>
          <Flex direction={"row"} justify={"center"} align={"center"}>
            {(permissionsData?.permissions?.export || defaultShow) && (
              <div className="me-3">
                <DownloadFile formType={formType} data={data} filterString={globalFilter} />
              </div>
            )}

            {renderUploadButton(formType, data)}
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              icon={<IconSearch size="1.5rem" />}
            />
            {showCreateForm &&
              formType &&
              !clientState.showAsideBar &&
              (permissionsData?.permissions?.create || defaultShow) && (
                <Button
                  ml={"xs"}
                  variant={"filled"}
                  onClick={() => {
                    setReadOnly(false);
                    setRowData(undefined);
                    open();
                  }}
                >
                  Add {showLabel || formType}
                </Button>
              )}
          </Flex>
        </Flex>
      </Paper>
      <ScrollArea h={"100%"} w={"100%"}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <DndProvider backend={HTML5Backend}>
          <MantineTable
            {...{
              style: {
                width: table.getCenterTotalSize(),
              },
            }}
            h={"100%"}
            striped
            highlightOnHover
            withBorder
            withColumnBorders
          >
            <thead className={cx(classes.header)}>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <tr key={headerGroup.id + index}>
                  {headerGroup.headers.map((header: any) => {
                    return header?.id !== "actions" ? (
                      <ColumnHeader
                        columnResizeMode={columnResizeMode}
                        key={header?.id + index}
                        header={header}
                        table={table}
                        showFilter={false}
                        hideFilterIcon
                        hideVisibleIcon
                      />
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center bold h-100"
                        style={{ background: "white" }}
                      >
                        Actions
                      </div>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody style={{ height: "100%" }}>
              {table.getRowModel().rows.map((row, index) => (
                <tr key={row.id + index}>
                  {row.getVisibleCells().map((cell, index) => (
                    <td key={cell.id + index}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </MantineTable>
        </DndProvider>
      </ScrollArea>
    </Container>
  );
}

export default Matrix;
export type { MatrixRowType, MatrixDataType };
