'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readSuperAdmins } from '@/utilities/API';

export default function SuperAdmins() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const sa = await readSuperAdmins();
      setData(sa);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={false}
        formType="Super Admins"
      />
    </Container>
  );
}
