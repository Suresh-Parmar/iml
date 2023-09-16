import { TextInput, Button, Group, Box, Flex, LoadingOverlay, Select, MultiSelect, Radio } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createProduct,
  readBoards,
  readClasses,
  readCompetitions,
  readProductCategories,
  readProducts,
  readSubjects,
  updateProduct,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { BoardType, ClassType, ProductsType } from "@/utilities/api-types";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";

function ProductForm({
  open,
  close,
  setData,
  setRowData,
  rowData,
  setFormTitle,
  readonly,
}: {
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: MatrixRowType;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [visible, { toggle, close: closeOverlay, open: openOverlay }] = useDisclosure(true);
  const [productTypes, setProductTypes] = useState<MatrixDataType>([]);
  const [boards, setBoards] = useState<MatrixDataType>([]);
  const [classes, setClasses] = useState<MatrixDataType>([]);
  const [subjects, setSubjects] = useState<MatrixDataType>([]);
  const [competitions, setCompetitions] = useState<MatrixDataType>([]);
  const [products, setProducts] = useState<MatrixDataType>([]);
  const [selectedRecords, setSelectedRecords] = useState<ProductsType[]>(rowData?.products ?? []);

  const form = useForm({
    initialValues: {
      ...rowData,
      name: rowData?.name ?? "",
    },
    validate: {
      name: (value) => (value?.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  async function fetchProductTypes() {
    const productTypesRes = await readProductCategories();
    setProductTypes(productTypesRes);
  }

  async function fetchBoards() {
    const boardsRes = await readBoards();
    setBoards(boardsRes);
  }

  async function fetchClasses() {
    const classesRes = await readClasses();
    setClasses(classesRes);
  }

  async function fetchSubjects() {
    const subjectsRes = await readSubjects();
    setSubjects(subjectsRes);
    toggle();
  }

  async function fetchCompetitions(subjectName: string) {
    const competitionsRes = await readCompetitions("subject_id", subjectName);
    setCompetitions(competitionsRes);
  }

  async function fetchProducts() {
    const classname = form.values.class?.replace("Class", "");
    const productsRes = await readProducts("class", classname?.trim());
    setProducts(productsRes);
  }

  useEffect(() => {
    if (form.values.class && form.values.bundle) {
      fetchProducts();
    }
  }, [form.values.bundle, form.values.class]);

  // Fetch Product Types
  useEffect(() => {
    fetchProductTypes();
    fetchBoards();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add Product`);
    }
  }, []);

  const onHandleSubmit = async (values: any) => {
    openOverlay();

    if (rowData !== undefined) {
      const isProductUpdated = await updateProduct(rowData._id, {
        ...values,
        products: selectedRecords,
      });
      if (isProductUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const products = await readProducts();
        setData(products);
        closeOverlay();
      } else {
        closeOverlay();
      }
      setRowData(undefined);
      notifications.show({
        title: `Product ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isProductCreated = await createProduct({
        ...values,
        products: selectedRecords,
        bundle: Boolean(selectedRecords.length),
      });
      if (isProductCreated.toUpperCase() === "DOCUMENT CREATED") {
        const products = await readProducts();
        setData(products);
        closeOverlay();
        notifications.show({
          title: `Product created!`,
          message: `A new product has been created.`,
          color: "green",
        });
      } else if (isProductCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        closeOverlay();
        notifications.show({
          title: `Product already exists!`,
          message: `${values.name} already exists.`,
          color: "orange",
        });
      } else {
        closeOverlay();
      }
    }
    closeOverlay();
    close();
  };

  const onChangeSubject = (value: string | null) => {
    form.setFieldValue("subject", value ?? "");
    fetchCompetitions(value ?? "");
  };

  const onChangeClass = (value: string) => {
    form.setFieldValue("class", value ?? "");
  };

  let iterateValue = (array: any[], key: string): any[] => {
    let val: any[] = [];
    for (const value of array) {
      if (value.status && value[key]) {
        val.push(value[key]);
      }
    }
    return val;
  };

  const productTypesOptions = iterateValue(productTypes, "name");
  let boardsOptions = iterateValue(boards, "code");
  const classesOptions = iterateValue(classes, "name");
  const subjectsOptions = iterateValue(subjects, "name");
  const competitionsOptions = iterateValue(competitions, "name");

  const renderBundles = () => {
    if (!form.values.bundle) {
      return null;
    }

    if (!products.length) {
      return "No Products Available for the selected class";
    }

    return (
      <DataTable
        withBorder
        withColumnBorders
        records={products.filter((product) => !(product?.bundle ?? null)) as ProductsType[]}
        columns={[
          { accessor: "name" },
          { accessor: "hsncode" },
          { accessor: "amount" },
          { accessor: "delivery" },
          { accessor: "gst" },
        ]}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        idAccessor="_id"
        isRecordSelectable={() => !rowData?.bundle}
      />
    );
  };

  return (
    <Box maw={"100%"} mx="auto">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={productTypesOptions}
            label={"Product Types"}
            name="producttype"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("producttype")}
            onChange={(value) => {
              form.setFieldValue("producttype", value ?? "");
            }}
            w={"100%"}
          />
          <MultiSelect
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={boardsOptions}
            label={"Boards"}
            name="boards"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("boards")}
            onChange={(value) => {
              form.setFieldValue("boards", value ?? "");
            }}
            w={"100%"}
          />
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={classesOptions}
            label={"Classes"}
            name="class"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("class")}
            onChange={onChangeClass}
            w={"100%"}
          />
          <Radio.Group
            value={form.values.bundle ? "yes" : "no"}
            onChange={(value) => {
              form.setFieldValue("bundle", value === "yes");
            }}
            name="bundle"
            withAsterisk
            label="Is this combination of bundled product?"
            mt={"md"}
            size="md"
          >
            <Group mt="xs">
              <Radio value={"yes"} label="Yes" disabled={readonly || Boolean(rowData?.bundle)} />
              <Radio value={"no"} label="No" disabled={readonly || Boolean(rowData?.bundle)} />
            </Group>
          </Radio.Group>
          <Box w={"100%"} mt="md">
            {renderBundles()}
          </Box>
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Title"
            placeholder="Title"
            {...form.getInputProps("name")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("name", event.currentTarget.value);
            }}
          />
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={subjectsOptions}
            label={"Subjects"}
            name="subject"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("subject")}
            onChange={onChangeSubject}
            w={"100%"}
          />
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={competitionsOptions}
            label={"Competitions"}
            name="competition"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("competition")}
            onChange={(value) => {
              form.setFieldValue("competition", value ?? "");
            }}
            w={"100%"}
          />

          <TextInput
            disabled={readonly}
            withAsterisk
            label="Amount"
            placeholder="Amount"
            {...form.getInputProps("amount")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("amount", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="HSN Code"
            placeholder="HSN Code"
            {...form.getInputProps("hsncode")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("hsncode", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Quantiy"
            placeholder="Quantiy"
            {...form.getInputProps("qty")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("qty", event.currentTarget.value);
            }}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export { ProductForm };
