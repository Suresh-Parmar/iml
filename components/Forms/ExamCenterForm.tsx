import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  Select,
  LoadingOverlay,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MatrixDataType, MatrixRowType } from '../Matrix';
import {
  createExamCenter,
  readCompetitions,
  readExamCenters,
  updateExamCenter,
} from '@/utilities/API';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';

function ExamCenterForm({
  readonly,
  setData,
  open,
  close,
  rowData,
  setRowData,
  setFormTitle,
}: {
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: MatrixRowType;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [comeptitionsData, setCompetitionsData] = useState<MatrixDataType>([]);

  async function readCompetitionsData() {
    const competitions = await readCompetitions('status', true);
    setCompetitionsData(competitions);
  }

  useEffect(() => {
    readCompetitionsData();
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add exam center`);
    }
  }, []);

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? '',
      competition: rowData?.competition,
      status: rowData?.status ?? '',
      examdate: rowData?.examdate ? new Date(rowData?.examdate) : new Date(),
      time: rowData?.time ?? '',
      result_date: rowData?.result_date
        ? new Date(rowData?.result_date)
        : new Date(),
      verification_start_date: rowData?.verification_start_date
        ? new Date(rowData?.verification_start_date)
        : new Date(),
      verification_end_date: rowData?.verification_end_date
        ? new Date(rowData?.verification_end_date)
        : new Date(),
      paper_code: rowData?.paper_code ?? '',
      mode: rowData?.mode ?? '',
    },
    validate: {
      name: (value) =>
        value.length < 2 ? 'Name must have at least 2 letters' : null,
      examdate: (value) =>
        value.toString()?.length === 0 ? 'Exam date must be selected' : null,
      verification_start_date: (value) =>
        value.toString()?.length === 0
          ? 'Verification start date must be selected'
          : null,
      verification_end_date: (value) =>
        value.toString()?.length === 0
          ? 'Verification end date must be selected'
          : null,
      result_date: (value) =>
        value.toString()?.length === 0 ? 'Result date must be selected' : null,
      time: (value) => (value.length === 0 ? 'Time must be entered' : null),
      mode: (value) => (value.length === 0 ? 'Mode must be selected' : null),
      competition: (value) =>
        value?.length === 0 ? 'Competition must be selected' : null,
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);

  const onChangeCompetitions = async (event: string) => {
    form.setFieldValue('competition', event ?? '');
  };

  const onHandleSubmit = async (values: any) => {
    values = {
      ...values,
    };
    setOLoader(true);
    if (rowData !== undefined) {
      const formValues = {
        ...values,
        examdate: new Date(values.examdate || Date()).toDateString(),
        result_date: new Date(values.result_date || Date()).toDateString(),
        verification_start_date: new Date(
          values.verification_start_date || Date()
        ).toDateString(),
        verification_end_date: new Date(
          values.verification_end_date || Date()
        ).toDateString(),
      };
      const isExamCenterUpdated = await updateExamCenter(
        rowData._id,
        formValues
      );
      if (isExamCenterUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const examCenters = await readExamCenters();
        setData(examCenters);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Exam Center ${rowData.name} updated!`,
        message: `The above exam center has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const formValues = {
        ...values,
        examdate: new Date(values.examdate || Date()).toDateString(),
        result_date: new Date(values.result_date || Date()).toDateString(),
        verification_start_date: new Date(
          values.verification_start_date || Date()
        ).toDateString(),
        verification_end_date: new Date(
          values.verification_end_date || Date()
        ).toDateString(),
      };
      const isExamCenterCreated = await createExamCenter(
        formValues as MatrixRowType
      );
      if (isExamCenterCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const examCenters = await readExamCenters();
        setData(examCenters);
        setOLoader(false);
      } else if (
        isExamCenterCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS'
      ) {
        setOLoader(false);
        notifications.show({
          title: `Exam Center already exists!`,
          message: `${values.name} already exists.`,
          color: 'orange',
        });
      } else {
        setOLoader(false);
      }
      notifications.show({
        title: `Exam Center created!`,
        message: `A new exam center has been created.`,
        color: 'green',
      });
    }
    form.setValues({
      name: '',
      competition: '',
      status: true,
      examdate: new Date(),
      time: '',
      result_date: new Date(),
      verification_start_date: new Date(),
      verification_end_date: new Date(),
      paper_code: '',
      mode: '',
    });
    close();
  };

  const competitionsNames = comeptitionsData
    .filter((c) => Boolean(c.status))
    .map((c) => ({
      value: c.code,
      label: c.name,
    }));

  return (
    <Box maw={'100%'} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <ScrollArea>
          <LoadingOverlay visible={oLoader} overlayBlur={2} />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Name"
            name="Name"
            placeholder="John Doe"
            {...form.getInputProps('name')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('name', event.currentTarget.value);
            }}
          />
          <Flex
            gap={'md'}
            direction={'row'}
            justify={'center'}
            align={'flex-start'}
            w={'100%'}
          >
            <Flex
              direction={'column'}
              justify={'center'}
              align={'flex-start'}
              w={'100%'}
            >
              <TextInput
                disabled={readonly}
                label="Paper Code"
                placeholder="Code 123"
                {...form.getInputProps('paper_code')}
                w={'100%'}
                mt={'md'}
                size="md"
              />
              <Select
                disabled={readonly}
                searchable
                nothingFound="No options"
                data={['Online', 'Offline', 'Both']}
                label={'Mode'}
                name="mode"
                mt={'md'}
                size="md"
                withAsterisk
                {...form.getInputProps('mode')}
                onChange={async (event) => {
                  form.setFieldValue('mode', event ?? '');
                }}
                w={'100%'}
              />
              <Select
                disabled={readonly}
                searchable
                nothingFound="No options"
                data={competitionsNames}
                label={'Competition'}
                name="competition"
                mt={'md'}
                size="md"
                withAsterisk
                {...form.getInputProps('competition')}
                onChange={onChangeCompetitions}
                w={'100%'}
              />
              <TextInput
                disabled={readonly}
                name="Time"
                label="Time"
                withAsterisk
                {...form.getInputProps('time')}
                w={'100%'}
                mt={'md'}
                size="md"
              />
            </Flex>
            <Flex
              direction={'column'}
              justify={'center'}
              align={'flex-start'}
              w={'100%'}
            >
              <DatePickerInput
                popoverProps={{
                  withinPortal: true,
                }}
                disabled={readonly}
                withAsterisk
                valueFormat="ddd MMM DD YYYY"
                name="Exam Date"
                label="Exam Date"
                placeholder={`${new Date(Date.now()).toDateString()}`}
                {...form.getInputProps('examdate')}
                w={'100%'}
                mt={'md'}
                size="md"
                minDate={new Date()}
              />
              <DatePickerInput
                popoverProps={{
                  withinPortal: true,
                }}
                disabled={readonly || !Boolean(form.values.examdate)}
                withAsterisk
                valueFormat="ddd MMM DD YYYY"
                name="Result Date"
                label="Result Date"
                placeholder={`${new Date(Date.now()).toDateString()}`}
                {...form.getInputProps('result_date')}
                w={'100%'}
                mt={'md'}
                size="md"
                minDate={form.values.examdate}
              />
              <DatePickerInput
                popoverProps={{
                  withinPortal: true,
                }}
                disabled={readonly || !Boolean(form.values.result_date)}
                withAsterisk
                valueFormat="ddd MMM DD YYYY"
                name="Verification Start Date"
                label="Verification Start Date"
                placeholder={`${new Date(Date.now()).toDateString()}`}
                {...form.getInputProps('verification_start_date')}
                w={'100%'}
                mt={'md'}
                size="md"
                minDate={form.values.result_date}
              />
              <DatePickerInput
                popoverProps={{
                  withinPortal: true,
                }}
                disabled={
                  readonly || !Boolean(form.values.verification_start_date)
                }
                withAsterisk
                valueFormat="ddd MMM DD YYYY"
                name="Verification End Date"
                label="Verification End Date"
                placeholder={`${new Date(Date.now()).toDateString()}`}
                {...form.getInputProps('verification_end_date')}
                w={'100%'}
                mt={'md'}
                size="md"
                minDate={form.values.verification_start_date}
              />
            </Flex>
          </Flex>
          <Group position="right" mt="md">
            <Button disabled={readonly} type={'submit'}>
              {rowData !== undefined ? 'Update' : 'Add'}
            </Button>
          </Group>
        </ScrollArea>
      </form>
    </Box>
  );
}

export { ExamCenterForm };
