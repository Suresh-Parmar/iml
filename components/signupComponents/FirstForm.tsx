import { useEffect, useState } from "react";
import { Flex, Select } from "@mantine/core";

import { readBoardsLanding, readClassesLanding, readProductsLanding } from "@/utilities/API";
import { MatrixDataType } from "@/components/Matrix";
import { filterDataSingle } from "@/helpers/dropDownData";
import { useSelector } from "react-redux";
import { filterData } from "@/helpers/filterData";
import { ProductView } from "../common";

type FirstFormProps = {
  form: any;
  onClickNext: () => void;
  setInvoiceBreakdown: (arg: any) => void;
  setOtherValues?: any;
  otherValues?: any;
};

export default function FirstForm({
  form,
  onClickNext,
  setInvoiceBreakdown,
  setOtherValues,
  otherValues,
}: FirstFormProps) {
  const [classesData, setClassesData] = useState<MatrixDataType>([]);
  const [products, setProducts] = useState<MatrixDataType>([]);
  const [boards, setBoards] = useState<MatrixDataType>([]);
  const selectedCountry: any = useSelector((state: any) => state?.data?.selectedCountry);

  useEffect(() => {
    readBoardsData();
  }, [selectedCountry?.value]);

  useEffect(() => {
    form.values.class_id && form.values.board_id && readProductsLandingData(form.values.class_id, form.values.board_id);
    form.values.board_id && readClassesData();
  }, [selectedCountry?.value, form.values.board_id]);

  async function readClassesData() {
    let classes: any = await readClassesLanding();
    classes = filterData(classes, "label", "value", "_id", true, "order_code", undefined, true);
    setClassesData(classes);
  }

  async function readBoardsData() {
    let boardsData = await readBoardsLanding();
    boardsData = filterData(boardsData, "label", "value");
    setBoards(boardsData);
  }

  async function readProductsLandingData(className: string, boardName: string) {
    let customData = { showfront: true };
    const productsData = await readProductsLanding(className, boardName, customData);
    setProducts(productsData);
  }

  const onClickSubmitCompetition = (comp: string, prod: any) => {
    setInvoiceBreakdown(prod);
    const iComp: any = products.find((i) => i.name === comp);
    form.setFieldValue("competition_id", iComp.competition_id || "");
    form.setFieldValue("myproducts", [iComp.sku_code]);
    form.setFieldValue("product_name", iComp.name);

    if (setOtherValues && otherValues) {
      otherValues.competition = iComp.competition;
    }

    // form.setFieldValue("competition_code", iComp?.code ?? "");
    onClickNext();
  };

  const boardsOptions = filterData(boards, "label", "value", "_id");

  const onChangeClasses = (event: any) => {
    form.setFieldValue("class_id", event ?? "");
    const iClass = classesData.find((i) => i._id === event);
    form.setFieldValue("class_code", iClass?.code ?? "");
    readProductsLandingData(iClass?.name ?? "", form.values.board_id);
  };

  const onChangeBoard = (event: any) => {
    form.setFieldValue("board_id", event ?? "");
    form.setFieldValue("class_code", "");
    form.setFieldValue("class_id", "");
    // readClassesData();
  };

  return (
    <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
      <Select
        clearable
        searchable
        nothingFound="No options"
        data={boardsOptions}
        label={"Boards"}
        name="Boards"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("board_id")}
        onChange={onChangeBoard}
        w={"100%"}
      />
      <Select
        clearable
        searchable
        nothingFound="No options"
        data={classesData}
        label={"Class"}
        name="Class"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("class_id")}
        onChange={onChangeClasses}
        w={"100%"}
      />
      <Flex w={"100%"} mt="xs" gap={"xs"} wrap={"wrap"} direction={"row"} justify={"center"} align={"stretch"}>
        {products.map((product: any, index: any) => {
          return (
            <ProductView key={index} item={product} onClick={() => onClickSubmitCompetition(product.name, product)} />
          );
        })}
      </Flex>
    </Flex>
  );
}
