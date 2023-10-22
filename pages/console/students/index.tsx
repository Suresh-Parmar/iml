import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readStudents } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

export default function Students() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    async function readData() {
      setLoader(true);
      const students = await readStudents();
      setData(students);
      setLoader(false);
    }
    readData();
  }, [selectedCountry]);
  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm={true} formType="Students" />
      <Loader show={loader} />
    </Container>
  );
}
