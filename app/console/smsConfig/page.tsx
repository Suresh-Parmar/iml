"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readSMSConfigs } from "@/utilities/API";

const formTypeData = {
  name: true,
  country: true,
  smpphost: true,
  username: true,
  password: false,
  status: false,
  actions: true,
};

export default function SMSConfigs() {
  const [data, setData] = useState<MatrixDataType>([]);

  useEffect(() => {
    async function readData() {
      const smsConfigs = await readSMSConfigs();
      setData(smsConfigs);
    }
    readData();
  }, []);
  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="SMSConfigs"
        formTypeData={formTypeData}
      />
    </Container>
  );
}
