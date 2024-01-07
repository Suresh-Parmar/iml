import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readExamCentersMapping } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";

export default function ExamCenterMappings() {
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

  const [pagiData, setPagiData] = useState<any>({ page: 1, limit: savedPageSize || 25 });
  const [totalrecords, setTotalrecords] = useState<any>({ totalPages: 1, pageSize: savedPageSize });

  let selectedCountry = userData?.selectedCountry?.label;

  let payloadData = {
    collection_name: "exam_center_mapping",
    op_name: "find_many",
    ...pagiData,
    filter_var: {
      country: selectedCountry,
    },
  };

  useEffect(() => {
    setLoader(true);
    async function readData() {
      const examCenterMappings = await readExamCentersMapping(undefined, undefined, payloadData, true);
      let limits = {
        total_count: examCenterMappings?.data?.total_count,
        total_pages: examCenterMappings?.data?.total_pages,
      };

      setTotalrecords(limits);
      setData(examCenterMappings?.data?.response);
      setLoader(false);
    }
    readData();
  }, [selectedCountry, pagiData.page, pagiData.limit]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        totalrecords={totalrecords}
        setPagiData={setPagiData}
        pagiData={pagiData}
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        showApiSearch
        formType={"Exam Center Mappings"}
      />
      <Loader show={loader} />
    </Container>
  );
}
