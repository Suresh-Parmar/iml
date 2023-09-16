'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readExamCentersMapping } from '@/utilities/API';

export default function ExamCenterMappings() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const examCenterMappings = await readExamCentersMapping();
      setData(examCenterMappings);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={false}
        formType={'Exam Center Mappings'}
      />
    </Container>
  );
}
