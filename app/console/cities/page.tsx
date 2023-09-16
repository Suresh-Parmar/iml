"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readCities } from "@/utilities/API";
import { useSelector } from "react-redux";

export default function Cities() {
  const [data, setData] = useState<MatrixDataType>([]);
  const country_selected: any = useSelector((state) => state);

  useEffect(() => {
    async function readData() {
      const users = await readCities();
      setData(users);
    }
    readData();
  }, [country_selected?.client?.selectedCountry?.name]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm formType={"City"} />
    </Container>
  );
}
