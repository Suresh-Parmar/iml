"use client"

import { Center, Container, Loader, Title } from '@mantine/core';
import Matrix, { MatrixDataType } from '@/components/Matrix';
import { useEffect, useState } from 'react';
import { readCities, readCountries, readStates } from '@/utilities/API';

export default function Location() {
  const [activeTable, setActiveTable] = useState<"countries" | "states" | "cities">('countries');
  const [data, setData] = useState<MatrixDataType>([]);
  const fetchActiveTableData = async (activeTable: string) => {
    setActiveTable(activeTable as "countries" | "states" | "cities");
    switch (activeTable) {
      case "countries":
        setData(await readCountries());
        break;
      case "states":
        setData(await readStates());
        break;
      case "cities":
        setData(await readCities());
        break;
      default:
        setData([]);
        break;
    }
  }
  useEffect(() => {
    async function readData() {
      const countries = await readCountries();
      setData(countries);
    }
    readData();
  }, []);
  return (
    <Container h={"100%"} fluid p={0}>
      {
        data.length > 0
        ? <Matrix showCreateForm={true} formType={activeTable === "countries" ? "Country" : activeTable === "states" ? "State" : activeTable === "cities" ? "City" : "Country"} data={data} setData={setData} />
        : <Center h={"100%"} w={"100%"}><Loader variant={"dots"} /></Center>
      }
    </Container>
  )
}
