"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readProducts } from "@/utilities/API";

const formTypeData = {
  Name: true,
  "Product Type": true,
  Amount: true,
  Quantity: true,
  "Image Url": false,
  "Display On Front": false,
  Board: false,
  Class: false,
  "HSN Code": false,
  "Display On Account": false,
  Bundle: false,
  Country: false,
  status: false,
  actions: true,
};

export default function Products() {
  const [data, setData] = useState<MatrixDataType>([]);

  async function readData() {
    const products = await readProducts();
    setData(products);
  }

  useEffect(() => {
    readData();
  }, []);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="Products"
        formTypeData={formTypeData}
      />
    </Container>
  );
}
