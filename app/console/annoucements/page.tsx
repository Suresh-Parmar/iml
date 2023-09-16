'use client';

import { Container } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readAnnoucementsAdmin } from '@/utilities/API';

export default function Annoucements() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const Annoucements = await readAnnoucementsAdmin();
      setData(Annoucements);
    }
    readData();
  }, []);
  return (
    <Container h={'100%'} fluid p={0}>
      {/* <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm
        formType={'Annoucements'}
      /> */}
    </Container>
  );
}
