'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readPayments } from '@/utilities/API';

const formTypeData = {
  order_id: true,
  receipt_number: true,
  amount: true,
  currency: true,
  status: true,
  created_at: true,
  country: true,
  actions: false,
};

export default function Payments() {
  const [data, setData] = useState<MatrixDataType>([]);

  async function readData() {
    const payments = await readPayments();
    setData(payments);
  }

  useEffect(() => {
    readData();
  }, []);

  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={false}
        formType="Payments"
        formTypeData={formTypeData}
      />
    </Container>
  );
}
