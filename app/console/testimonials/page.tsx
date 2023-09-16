"use client";

import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readTestimonial } from "@/utilities/API";

export default function Testimonials() {
  const [data, setData] = useState<MatrixDataType>([]);
  useEffect(() => {
    async function readData() {
      const data = await readTestimonial();
      setData(data);
    }
    readData();
  }, []);

  let showData = {
    Name: true,
    School: true,
    Description: true,
    Country: true,
    Startdate: true,
    Enddate: true,
    Thumbnail: true,
    actions: true,
  };

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        formTypeData={showData}
        showCreateForm={true}
        formType="testimonials"
      />
    </Container>
  );
}
