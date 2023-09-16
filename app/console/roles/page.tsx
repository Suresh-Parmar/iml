"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readAnnoucements } from "@/utilities/API";
import { RoleMatrix } from "@/components/permissions";

export default function Announcements() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const newData = await readAnnoucements();
      setData(newData);
    }
    readData();
  }, []);

  return (
    <Container h={"100%"} fluid p={0}>
      <RoleMatrix />
    </Container>
  );
}
