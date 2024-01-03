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
  const [pagiData, setPagiData] = useState<any>({ page: 1, limit: 25 });

  let selectedCountry = userData?.selectedCountry?.label;

  let payload = {
    collection_name: "users",
    op_name: "find_many",
    ...pagiData,
    filter_var: {
      role: "student",
      country: selectedCountry,
    },
  };

  async function readData() {
    setLoader(true);
    const students = await readStudents(payload);
    setData(students);
    setLoader(false);
  }

  useEffect(() => {
    readData();
  }, [selectedCountry, pagiData.page, pagiData.limit]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        setPagiData={setPagiData}
        pagiData={pagiData}
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="Students"
      />
      <Loader show={loader} />
    </Container>
  );
}
