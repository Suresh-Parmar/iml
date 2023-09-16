"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readStates } from "@/utilities/API";
import { useSelector } from "react-redux";

const formTypeData = {
  Name: true,
  Country: true,
  status: false,
  actions: true,
};

export default function States() {
  const [data, setData] = useState<MatrixDataType>([]);
  const country_selected: any = useSelector((state) => state);

  useEffect(() => {
    async function readData() {
      const users = await readStates();
      setData(users);
    }
    readData();
  }, [country_selected?.client?.selectedCountry?.name]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm
        formType={"State"}
        formTypeData={formTypeData}
      />
    </Container>
  );
}
