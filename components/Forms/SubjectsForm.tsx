import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MatrixDataType, MatrixRowType } from '../Matrix';
import { createSubject, readSubjects, updateSubject } from '@/utilities/API';
import { notifications } from '@mantine/notifications';

function SubjectsForm({
  open,
  close,
  setData,
  setRowData,
  rowData,
  setFormTitle,
  readonly,
}: {
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: MatrixRowType;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add Subject`);
    }
  }, []);

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? '',
      code: rowData?.code ?? '',
      status: rowData?.status ?? '',
    },
    validate: {
      name: (value) =>
        value.length < 2 ? 'Name must have at least 2 letters' : null,
      code: (value) =>
        value.length < 1 ? 'Code must have at least 1 letters' : null,
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isSubjectUpdated = await updateSubject(rowData._id, {
        ...rowData,
        name: values?.name ?? '',
        code: values?.code ?? '',
      });
      if (isSubjectUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const subjects = await readSubjects();
        setData(subjects);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Subject ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isSubjectCreated = await createSubject(values as MatrixRowType);
      if (isSubjectCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const subjects = await readSubjects();
        setData(subjects);
        setOLoader(false);
        notifications.show({
          title: `Subject created!`,
          message: `A new subject has been created.`,
          color: 'green',
        });
      } else if (isSubjectCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS') {
        setOLoader(false);
        notifications.show({
          title: `Subject already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: 'orange',
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: '',
      code: '',
      status: true,
    });
    close();
  };

  return (
    <Box maw={'100%'} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex
          direction={'column'}
          justify={'center'}
          align={'flex-start'}
          w={'100%'}
        >
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Subject Name"
            placeholder="Maths"
            {...form.getInputProps('name')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('name', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Code"
            placeholder="Code 123"
            {...form.getInputProps('code')}
            w={'100%'}
            mt={'md'}
            size="md"
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export { SubjectsForm };
