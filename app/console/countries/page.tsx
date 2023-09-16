'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readCountries } from '@/utilities/API';

const formTypeData = {
  Name: true,
  Capital: true,
  'ISD Code': true,
  'ISO Alpha-3 Code': false,
  'ISO Alpha-2 Code': true,
  'Currency Name': false,
  'Currency Short Name': true,
  'Currency Symbol': false,
  status: false,
  actions: true,
};

export default function Countries() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const users = await readCountries();
      setData(users);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm
        formType={'Country'}
        formTypeData={formTypeData}
      />
    </Container>
  );
}
