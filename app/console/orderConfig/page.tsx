"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readOrderConfigs } from "@/utilities/API";

const formTypeData = {
  _id: false,
  country: false,
  created_at: false,
  name: true,
  status: false,
  orderstartingno: true,
  invoicestartingno: true,
  paymentsuccessfulmsg: true,
  paymentpendingmsg: true,
  paymentdeclinedmsg: true,
  discountsuccessmsg: true,
  discounterrmsg: true,
};

export default function OrderConfigs() {
  const [data, setData] = useState<MatrixDataType>([]);

  useEffect(() => {
    async function readData() {
      const orderConfigs = await readOrderConfigs();
      setData(orderConfigs);
    }
    readData();
  }, []);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="OrderConfigs"
        formTypeData={formTypeData}
      />
    </Container>
  );
}
