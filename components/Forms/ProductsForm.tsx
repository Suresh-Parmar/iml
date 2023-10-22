import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  LoadingOverlay,
  Select,
  MultiSelect,
  Radio,
  Checkbox,
  FileInput,
} from "@mantine/core";
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
  uploadMedia,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { ProductsType } from "@/utilities/api-types";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import { filterDataSingle } from "@/helpers/dropDownData";
import { validatePhone } from "@/helpers/validations";
import Loader from "../common/Loader";

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
  const [loader, setLoader] = useState<any>(false);

  const form = useForm({
    initialValues: rowData,
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
    const productsRes = await readProducts("class", form.values.class);
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

  const uploadFIleToCloud = async (file: any, key: any, values: any) => {
    let payload: any = new FormData();
    payload.append("file", file);
    setLoader(true);
    await uploadMedia(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.actual_url) {
          form.setFieldValue(key, res.data.actual_url ?? "");
          values[key] = res.data.actual_url;
          onHandleSubmit(values);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const onHandleSubmit = async (values: any) => {
    if (typeof values.resourcefileurl == "object") {
      await uploadFIleToCloud(values.resourcefileurl, "resourcefileurl", values);
      return;
    }

    if (typeof values.imageuploadurl == "object") {
      await uploadFIleToCloud(values.imageuploadurl, "imageuploadurl", values);
      return;
    }

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
    // fetchCompetitions(value ?? "");
  };

  const onChangeClass = (value: string) => {
    form.setFieldValue("class", value ?? "");
  };

  const productTypesOptions = filterDataSingle(productTypes, "name");
  let boardsOptions = filterDataSingle(boards, "code");
  const classesOptions = filterDataSingle(classes, "name", "", "", false);
  const subjectsOptions = filterDataSingle(subjects, "name");
  const competitionsOptions = filterDataSingle(competitions, "name");

  let formValues: any = form.values;

  useEffect(() => {
    formValues.subject && fetchCompetitions(formValues.subject ?? "");
  }, [formValues.subject]);

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
          <TextInput
            disabled={readonly}
            label="SKU Name"
            placeholder="SKU Name"
            {...form.getInputProps("sku_name")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("sku_name", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            label="SKU Code"
            placeholder="SKU Code"
            {...form.getInputProps("sku_code")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("sku_code", event.currentTarget.value);
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
              let val = validatePhone(event.currentTarget.value, 5);
              form.setFieldValue("amount", val);
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
              let val = validatePhone(event.currentTarget.value, 8);
              form.setFieldValue("hsncode", val);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Max Selling Quantity"
            placeholder="Max Selling Quantity"
            {...form.getInputProps("qty")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 4);
              form.setFieldValue("qty", val);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Product Bundle Price"
            placeholder="Product Bundle Price"
            {...form.getInputProps("product_bundle_price")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("product_bundle_price", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Tax Name"
            placeholder="Tax Name"
            {...form.getInputProps("taxname")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("taxname", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Tax Percent"
            placeholder="Tax Percent"
            {...form.getInputProps("taxpercent")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 3, 100);
              form.setFieldValue("taxpercent", val);
            }}
          />
          <TextInput
            type="date"
            disabled={readonly}
            withAsterisk
            label="Last Buying Date"
            placeholder="Last Buying Date"
            {...form.getInputProps("lastbuyingdate")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("lastbuyingdate", event.currentTarget.value);
            }}
          />
          <TextInput
            type="date"
            disabled={readonly}
            withAsterisk
            label="Last Access Date"
            placeholder="Last Access Date"
            {...form.getInputProps("lastaccessdate")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("lastaccessdate", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Seq Number"
            placeholder="Seq Number"
            {...form.getInputProps("seqnumber")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 3);
              form.setFieldValue("seqnumber", val);
            }}
          />
          <FileInput
            disabled={readonly}
            withAsterisk
            label="Resource File"
            placeholder="Resource File"
            {...form.getInputProps("resourcefileurl")}
            w={"100%"}
            mt={"md"}
            size="md"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              form.setFieldValue("resourcefileurl", event);
            }}
          />

          {formValues?.resourcefileurl && (
            <div className="m-3">
              {typeof formValues?.resourcefileurl === "object" ? (
                <img style={{ height: "150px" }} src={URL.createObjectURL(formValues?.resourcefileurl)} />
              ) : (
                <img style={{ height: "150px" }} src={formValues?.resourcefileurl} />
              )}
            </div>
          )}
          <FileInput
            disabled={readonly}
            withAsterisk
            label="image upload url "
            placeholder="image upload url "
            {...form.getInputProps("imageuploadurl")}
            w={"100%"}
            mt={"md"}
            size="md"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              form.setFieldValue("imageuploadurl", event);
            }}
          />

          {formValues?.imageuploadurl && (
            <div className="m-3">
              {typeof formValues?.imageuploadurl === "object" ? (
                <img style={{ height: "150px" }} src={URL.createObjectURL(formValues?.imageuploadurl)} />
              ) : (
                <img style={{ height: "150px" }} src={formValues?.imageuploadurl} />
              )}
            </div>
          )}

          <Checkbox
            checked={!!formValues?.showfront}
            disabled={readonly}
            label="Show Front"
            placeholder="Show Front"
            {...form.getInputProps("showfront")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("showfront", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.showinaccount}
            disabled={readonly}
            label="Show Inaccount"
            placeholder="Show Inaccount"
            {...form.getInputProps("showinaccount")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("showinaccount", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.associatedwithboard}
            disabled={readonly}
            label="Associated With Board"
            placeholder="Associated With Board"
            {...form.getInputProps("associatedwithboard")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("associatedwithboard", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.loginrequired}
            disabled={readonly}
            label="Login Required"
            placeholder="Login Required"
            {...form.getInputProps("loginrequired")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("loginrequired", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.showtoeligible}
            disabled={readonly}
            label="Show To Eligible"
            placeholder="Show To Eligible"
            {...form.getInputProps("showtoeligible")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("showtoeligible", event.target.checked);
            }}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type="submit">
            Submit
          </Button>
          <Loader show={loader} />
        </Group>
      </form>
    </Box>
  );
}

export { ProductForm };
