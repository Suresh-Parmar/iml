"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readExamCenters } from "@/utilities/API";

const formTypeData = {
  Name: true,
  "Exam Date": true,
  Time: true,
  "Result Date": false,
  "Verification Start Date": false,
  "Verification End Date": false,
  "Paper Code": false,
  Mode: true,
  Competition: true,
  status: false,
  actions: true,
};

export default function ExamCenters() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const examCenters = await readExamCenters();
      setData(examCenters);
    }
    readData();
  }, []);
  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType={"Exam Center"}
        formTypeData={formTypeData}
      />
    </Container>
  );
}
