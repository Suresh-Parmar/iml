import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Flex,
  Textarea,
  Select,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MatrixDataType, MatrixRowType } from '../Matrix';
import {
  createExamCenterMapping,
  readCities,
  readClasses,
  readCompetitions,
  readCountries,
  readCountriesWithFlags,
  readExamCenters,
  readExamCentersMapping,
  readSchools,
  updateExamCenterMapping,
  updateUser,
} from '@/utilities/API';
import { notifications } from '@mantine/notifications';

function ExamCenterMappingForm({
  readonly,
  examCenterCode,
  setData,
  open,
  close,
  rowData,
  setRowData,
  setFormTitle,
}: {
  examCenterCode: string;
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: MatrixRowType;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [citiesData, setCitiesData] = useState<string[]>([]);
  const [statesData, setStatesData] = useState<string[]>([]);
  const [countriesData, setCountriesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [schoolsData, setSchoolsData] = useState<string[]>([]);
  const [examCentersData, setExamCentersData] = useState<string[]>([]);
  const [comeptitionsData, setCompetitionsData] = useState<string[]>([]);
  const [classesData, setClassesData] = useState<string[]>([]);
  const [rawData, setRawData] = useState<{
    countries: MatrixDataType;
    states: MatrixDataType;
    cities: MatrixDataType;
    schools: MatrixDataType;
    examCenters: MatrixDataType;
    competitions: MatrixDataType;
    classes: MatrixDataType;
  }>({
    countries: [],
    states: [],
    cities: [],
    schools: [],
    examCenters: [],
    competitions: [],
    classes: [],
  });
  async function readSchoolsData(
    filterBy?: 'name' | 'city',
    filterQuery?: string | number
  ) {
    let schools: MatrixDataType;
    if (filterBy && filterQuery) {
      schools = await readSchools(filterBy, filterQuery);
    } else {
      schools = await readSchools();
    }
    setRawData((previousData) => {
      return {
        ...previousData,
        schools: schools,
      };
    });
    const schoolNames = schools.map((school) => {
      return school.name;
    });
    setSchoolsData(schoolNames);
  }
  async function readCitiesData(
    filterBy?: 'state',
    filterQuery?: string | number
  ) {
    let cities: MatrixDataType;
    if (filterBy && filterQuery) {
      cities = await readCities(filterBy, filterQuery);
    } else {
      cities = await readCities();
    }
    setRawData((previousData) => {
      return {
        ...previousData,
        cities: cities,
      };
    });
    const cityNames = cities.map((city) => {
      return city.name;
    });
    setCitiesData(cityNames);
    // setSelectedCity(cityNames.at(0) || "");
  }
  async function readCountriesData(
    filterBy?: 'name' | 'status',
    filterQuery?: string | number
  ) {
    const countries = await readCountries('status', true);
    setRawData((previousData) => {
      return {
        ...previousData,
        countries: countries,
      };
    });
    const countriesWithFlags = await readCountriesWithFlags();
    setCountriesData(countriesWithFlags);
    return countriesWithFlags;
    // setSelectedCountry(countriesWithFlags.at(0) || "🇮🇳 India");
  }
  async function readExamCentersData(
    filterBy?: 'name' | 'status',
    filterQuery?: string | number
  ) {
    const examCenters = await readExamCenters();
    setRawData((previousData) => {
      return {
        ...previousData,
        examCenters: examCenters,
      };
    });
    const examCentersNames = examCenters.map(
      (ec) => `${ec.name} (ID: ${ec._id})`
    );
    setExamCentersData(examCentersNames);
    // setSelectedCountry(countriesWithFlags.at(0) || "🇮🇳 India");
  }
  async function readCompetitionsData(
    filterBy?: 'name' | 'status',
    filterQuery?: string | number
  ) {
    const competitions = await readCompetitions();
    setRawData((previousData) => {
      return {
        ...previousData,
        competitions: competitions,
      };
    });
    const competitionsNames = competitions.map((c) => c.name);
    setCompetitionsData(competitionsNames);
    // setSelectedCountry(countriesWithFlags.at(0) || "🇮🇳 India");
  }
  async function readClassesData(
    filterBy?: 'name' | 'status',
    filterQuery?: string | number
  ) {
    const classes = await readClasses();
    setRawData((previousData) => {
      return {
        ...previousData,
        classes: classes,
      };
    });
    const classesNames = classes.map((c) => c.name);
    setClassesData(classesNames);
    // setSelectedCountry(countriesWithFlags.at(0) || "🇮🇳 India");
  }
  useEffect(() => {
    readCountriesData();
    readCitiesData();
    readSchoolsData();
    readExamCentersData();
    readCompetitionsData();
    readClassesData();
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name} ${rowData.code}`);
      else setFormTitle(`Update ${rowData.name} ${rowData.code}`);
    } else {
      setFormTitle(`Add exam center mapping`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      registration_number: rowData?.registration_number || '',
      status: rowData?.status || true,
      seat_number: rowData?.seat_number || '',
      exam_center_code: examCenterCode || '', // rawData.examCenters.find((ec) => ec._id === rowData?.exam_center_code)?.name || "",
      competition_code: rowData?.competition_code || '',
      class_code: rowData?.class_code || '',
    },
    validate: {},
  });
  // email_2: (value) => (value.length > 0 ? /^\S+@\S+$/.test(value) ? null : 'Invalid alternate email' : 'Invalid alternate email'),
  // mobile_2: (value) => (value.length > 0 && /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) ? null : "Invalid alternate mobile number"),
  const [oLoader, setOLoader] = useState<boolean>(false);
  const [examCenterID, setExamCenterID] = useState<string>('');
  const [classID, setClassID] = useState<string>('');
  const [classCode, setClassCode] = useState<string>('');
  const [competitionCode, setCompetitionCode] = useState<string>('');
  return (
    <Box maw={'100%'} mx="auto">
      <form
        onSubmit={form.onSubmit(async (values) => {
          setOLoader(true);
          if (rowData !== undefined) {
            const formValues = {
              ...values,
              exam_center_code: examCenterID,
              class_code: classCode,
              competition_code: competitionCode,
            };
            const isExamCenterMappingUpdated = await updateExamCenterMapping(
              rowData._id,
              formValues
            );
            if (
              isExamCenterMappingUpdated.toUpperCase() === 'DOCUMENT UPDATED'
            ) {
              const examCenterMapping = await readExamCentersMapping();
              setData(examCenterMapping);
              setOLoader(false);
            } else {
              setOLoader(false);
            }
            setRowData(undefined);
            notifications.show({
              title: `Exam Center Mapping ${rowData.name} ${rowData.code} updated!`,
              message: `The above exam center mapping has been updated with new information.`,
              color: 'blue',
            });
          } else {
            const formValues = {
              ...values,
              exam_center_code: examCenterID,
              class_code: classCode,
              competition_code: competitionCode,
            };
            const isExamCenterMappingCreated = await createExamCenterMapping(
              formValues as MatrixRowType
            );
            if (
              isExamCenterMappingCreated.toUpperCase() === 'DOCUMENT CREATED'
            ) {
              const examCenterMapping = await readExamCentersMapping();
              setData(examCenterMapping);
              setOLoader(false);
            } else if (
              isExamCenterMappingCreated.toUpperCase() ===
              'DOCUMENT ALREADY EXISTS'
            ) {
              setOLoader(false);
              notifications.show({
                title: `Exam Center Mapping already exists!`,
                message: `Exam Center Mapping already exists.`,
                color: 'orange',
              });
            } else {
              setOLoader(false);
            }
            notifications.show({
              title: `Exam Center Mapping created!`,
              message: `A new exam center mapping has been created.`,
              color: 'green',
            });
          }
          form.setValues({
            registration_number: '',
            status: true,
            seat_number: '',
            exam_center_code: '',
            competition_code: '',
            class_code: '',
          });
          close();
        })}
      >
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex
          gap={'md'}
          direction={'column'}
          justify={'center'}
          align={'flex-start'}
          w={'100%'}
        >
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Registration Number"
            placeholder="123456789"
            {...form.getInputProps('registration_number')}
            w={'100%'}
            mt={'md'}
            size="md"
          />
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={examCentersData}
            label={'Exam Center'}
            name="Exam Center"
            mt={'md'}
            size="md"
            withAsterisk
            {...form.getInputProps('exam_center_code')}
            onChange={async (event) => {
              const iExamCenter = rawData.examCenters.find(
                (i) => i.name === event?.split(' ').slice(0, 2).join(' ')
              );
              setExamCenterID(iExamCenter?._id || '');
              form.setFieldValue('exam_center_code', event || '');
            }}
            w={'100%'}
          />
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={comeptitionsData}
            label={'Competition'}
            name="Competition"
            mt={'md'}
            size="md"
            withAsterisk
            {...form.getInputProps('competition_code')}
            onChange={async (event) => {
              const iComp = rawData.competitions.find((i) => i.name === event);
              setCompetitionCode(iComp?.code || '');
              form.setFieldValue('competition_code', event || '');
            }}
            w={'100%'}
          />
          <Select
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={classesData}
            label={'Class'}
            name="Class"
            mt={'md'}
            size="md"
            withAsterisk
            {...form.getInputProps('class_code')}
            onChange={async (event) => {
              const iClass = rawData.classes.find((i) => i.name === event);
              setClassCode(iClass?.code || '');
              setClassID(iClass?._id || '');
              form.setFieldValue('class_code', event || '');
            }}
            w={'100%'}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type={'submit'}>
            {rowData !== undefined ? 'Update' : 'Add'}
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export { ExamCenterMappingForm };
