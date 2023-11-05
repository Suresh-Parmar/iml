import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, Flex, Overlay, Select, Text } from "@mantine/core";

import { readBoardsLanding, readClassesLanding, readProductsLanding } from "@/utilities/API";
import { MatrixDataType } from "@/components/Matrix";
import { CardImageUrl } from "../../pageComponents/utils";
import { filterDataSingle } from "@/helpers/dropDownData";
import { useSelector } from "react-redux";
import { filterData } from "@/helpers/filterData";
import { ProductView } from "../common";

type FirstFormProps = {
  form: any;
  onClickNext: () => void;
  setInvoiceBreakdown: (arg: any) => void;
};

export default function FirstForm({ form, onClickNext, setInvoiceBreakdown }: FirstFormProps) {
  const [classesData, setClassesData] = useState<MatrixDataType>([]);
  const [products, setProducts] = useState<MatrixDataType>([]);
  const [boards, setBoards] = useState<MatrixDataType>([]);
  const selectedCountry: any = useSelector((state: any) => state?.data?.selectedCountry);

  useEffect(() => {
    readBoardsData();
  }, [selectedCountry?.value]);

  useEffect(() => {
    form.values.class_id && form.values.board && readProductsLandingData(form.values.class_id, form.values.board);
    form.values.board && readClassesData();
  }, [selectedCountry?.value, form.values.board]);

  async function readClassesData() {
    let classes: any = await readClassesLanding();
    classes = filterData(classes, "label", "value", undefined, true, "code");
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
    form.setFieldValue("competition", iComp.competition || "");
    form.setFieldValue("myproducts", [iComp.name]);
    // form.setFieldValue("competition_code", iComp?.code ?? "");
    onClickNext();
  };

  let handleFilter = (arr: any[], key: string) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] && arr[i].status) {
        newArr.push(arr[i][key]);
      }
    }
    return newArr;
  };

  const classesNames = filterDataSingle(classesData, "name", "", "", false);
  const boardsOptions = filterDataSingle(boards, "code");

  const onChangeClasses = (event: any) => {
    form.setFieldValue("class_id", event ?? "");
    const iClass = classesData.find((i) => i.name === event);
    form.setFieldValue("class_code", iClass?.code ?? "");
    readProductsLandingData(iClass?.name ?? "", form.values.board);
  };

  const onChangeBoard = (event: any) => {
    form.setFieldValue("board", event ?? "");
    form.setFieldValue("class_code", "");
    form.setFieldValue("class_id", "");
    // readClassesData();
  };

  return (
    <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
      <Select
        searchable
        nothingFound="No options"
        data={boardsOptions}
        label={"Boards"}
        name="Boards"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("board")}
        onChange={onChangeBoard}
        w={"100%"}
      />
      <Select
        searchable
        nothingFound="No options"
        data={classesNames}
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
