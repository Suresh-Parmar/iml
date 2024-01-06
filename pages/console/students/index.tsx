import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readStudents } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";

export default function Students() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let savedPageSize = setGetData("pagesize");
  if (savedPageSize) {
    if (!isNaN(savedPageSize)) {
      savedPageSize = Number(savedPageSize);
    } else {
      savedPageSize = 25;
    }
  }

  const [totalrecords, setTotalrecords] = useState<any>({ totalPages: 1, pageSize: savedPageSize });
  const [pagiData, setPagiData] = useState<any>({ page: 1, limit: savedPageSize || 25 });

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
    const students = await readStudents(payload, true);
    let limits = { total_count: students?.data?.total_count, total_pages: students?.data?.total_pages };
    setTotalrecords(limits);
    setData(students?.data?.response || []);
    setLoader(false);
  }

  useEffect(() => {
    readData();
  }, [selectedCountry, Number(pagiData.page), Number(pagiData.limit)]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        totalrecords={totalrecords}
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
