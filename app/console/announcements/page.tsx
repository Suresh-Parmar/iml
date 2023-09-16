"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readAnnoucements } from "@/utilities/API";

export default function Announcements() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const newData = await readAnnoucements();
      setData(newData);
    }
    readData();
  }, []);

  let showData = {
    Name: true,
    Whatsnew: true,
    Enddate: true,
    Country: true,
    role: true,
    actions: true,
  };

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formTypeData={showData}
        formType="announcements"
      />
    </Container>
  );
}
