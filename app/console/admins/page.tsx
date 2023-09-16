'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readAdmins } from '@/utilities/API';

export default function Admins() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const admins = await readAdmins();
      setData(admins);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="Admins"
      />
    </Container>
  );
}
