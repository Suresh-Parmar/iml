'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readTeachers } from '@/utilities/API';

export default function Teachers() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const teachers = await readTeachers();
      setData(teachers);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="Teachers"
      />
    </Container>
  );
}
