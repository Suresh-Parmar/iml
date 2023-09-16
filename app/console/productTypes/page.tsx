"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readProductCategories, readProducts } from "@/utilities/API";

const formTypeData = {
  name: true,
  code: true,
  taxname: true,
  taxpercent: true,
  country: false,
  status: false,
  actions: true,
};

export default function Products() {
  const [data, setData] = useState<MatrixDataType>([]);

  async function readData() {
    const productTypes = await readProductCategories();
    setData(productTypes);
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
        formType="ProductCategory"
        formTypeData={formTypeData}
      />
    </Container>
  );
}
