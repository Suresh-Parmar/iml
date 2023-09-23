"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, Flex, Overlay, Select, Text } from "@mantine/core";

import { readBoardsLanding, readClassesLanding, readProductsLanding } from "@/utilities/API";
import { MatrixDataType } from "@/components/Matrix";
import { CardImageUrl } from "./utils";
import { filterDataSingle } from "@/helpers/dropDownData";

type FirstFormProps = {
  form: any;
  onClickNext: () => void;
  setInvoiceBreakdown: (arg: any) => void;
};

export default function FirstForm({ form, onClickNext, setInvoiceBreakdown }: FirstFormProps) {
  const [classesData, setClassesData] = useState<MatrixDataType>([]);
  const [products, setProducts] = useState<MatrixDataType>([]);
  const [boards, setBoards] = useState<MatrixDataType>([]);

  useEffect(() => {
    readBoardsData();
  }, []);

  async function readClassesData() {
    const classes = await readClassesLanding();
    setClassesData(classes);
  }

  async function readBoardsData() {
    const boardsData = await readBoardsLanding();
    setBoards(boardsData);
  }

  async function readProductsLandingData(className: string, boardName: string) {
    const productsData = await readProductsLanding(className, boardName);
    setProducts(productsData);
  }

  const onClickSubmitCompetition = (comp: string, prod: any) => {
    setInvoiceBreakdown(prod);
    form.setFieldValue("competition", comp || "");
    const iComp = products.find((i) => i.name === comp);
    form.setFieldValue("competition_code", iComp?.code ?? "");
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
    readProductsLandingData(iClass?.code ?? "", form.values.board);
  };

  const onChangeBoard = (event: any) => {
    form.setFieldValue("board", event ?? "");
    readClassesData();
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
        {products.map((product) => {
          return (
            <Card
              w={"30%"}
              key={`product-${product._id}`}
              shadow={form.values.competition === product ? "xl" : "none"}
              padding="lg"
              radius="md"
              withBorder={form.values.competition === product.name}
            >
              {form.values.class_id === "" && <Overlay blur={15} center color="#ffffff" />}
              <Card.Section>
                <Image src={CardImageUrl} height={262.5} width={350} alt="Norway" />
                <Flex direction={"row"} justify={"center"} align={"center"} w={"100%"}>
                  <Text align={"center"} mx={"md"} my={"md"} fw={"bold"} fz={"md"}>
                    {product.name}
                  </Text>
                </Flex>
              </Card.Section>
              <Flex mt={"sm"} w={"100%"} justify={"center"}>
                <Button color="blue" variant="light" onClick={() => onClickSubmitCompetition(product.name, product)}>
                  {`₹ ${Number(product.amount).toFixed(2)}`}
                </Button>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Flex>
  );
}
