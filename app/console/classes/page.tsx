'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readClasses } from '@/utilities/API';

export default function Classes() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const classes = await readClasses();
      setData(classes);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType={'Class'}
      />
    </Container>
  );
}
