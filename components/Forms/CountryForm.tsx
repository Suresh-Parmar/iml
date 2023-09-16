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
  createClass,
  createCompetition,
  createSchool,
  readBoards,
  readCities,
  readClasses,
  readCountries,
  readCountriesWithFlags,
  readSchools,
  readStates,
  updateClass,
  updateCountry,
} from '@/utilities/API';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';

function CountryForm({
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
      setFormTitle(`Add Country`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name ?? '',
      Capital: rowData?.Capital ?? '',
      'ISD Code': rowData?.['ISD Code'] ?? '',
      'ISO Alpha-3 Code': rowData?.['ISO Alpha-3 Code'] ?? '',
      'ISO Alpha-2 Code': rowData?.['ISO Alpha-2 Code'] ?? '',
      'Currency Name': rowData?.['Currency Name'] ?? '',
      'Currency Short Name': rowData?.['Currency Short Name'] ?? '',
      'Currency Symbol': rowData?.['Currency Symbol'] ?? '',
      status: rowData?.['status'] ?? '',
    },
    validate: {
      name: (value) =>
        value.length < 2 ? 'Name must have at least 2 letters' : null,
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isCountryUpdated = await updateCountry(rowData._id, values);
      if (isCountryUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const countries = await readCountries();
        setData(countries);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Country ${rowData.name} updated!`,
        message: `The above country has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isCountryCreated = await createClass(values as MatrixRowType);
      if (isCountryCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const countries = await readCountries();
        setData(countries);
        setOLoader(false);
        notifications.show({
          title: `Country created!`,
          message: `A new country has been created.`,
          color: 'green',
        });
      } else if (isCountryCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS') {
        setOLoader(false);
        notifications.show({
          title: `Country already exists!`,
          message: `${values.name} already exists.`,
          color: 'orange',
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: '',
      Capital: '',
      'ISD Code': '',
      'ISO Alpha-3 Code': '',
      'ISO Alpha-2 Code': '',
      'Currency Name': '',
      'Currency Short Name': '',
      'Currency Symbol': '',
      status: true,
    });
    close();
  };

  return (
    <Box maw={'100%'} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
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
              withAsterisk
              label="Name"
              placeholder="Transylvania"
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
              label="Capital"
              placeholder="Vampireville"
              {...form.getInputProps('Capital')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue('Capital', event.currentTarget.value);
              }}
            />
            <TextInput
              disabled={readonly}
              label="ISO Alpha-2 Code"
              placeholder="IN"
              {...form.getInputProps('ISO Alpha-2 Code')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue(
                  'ISO Alpha-2 Code',
                  event.currentTarget.value
                );
              }}
            />
            <TextInput
              disabled={readonly}
              label="ISO Alpha-3 Code"
              placeholder="IND"
              {...form.getInputProps('ISO Alpha-3 Code')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue(
                  'ISO Alpha-3 Code',
                  event.currentTarget.value
                );
              }}
            />
          </Flex>
          <Flex
            direction={'column'}
            justify={'center'}
            align={'flex-start'}
            w={'100%'}
          >
            <TextInput
              disabled={readonly}
              label="ISD Code"
              placeholder="91"
              {...form.getInputProps('ISD Code')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue('ISD Code', event.currentTarget.value);
              }}
            />
            <TextInput
              disabled={readonly}
              label="Currency Name"
              placeholder="Indian Rupee"
              {...form.getInputProps('Currency Name')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue('Currency Name', event.currentTarget.value);
              }}
            />
            <TextInput
              disabled={readonly}
              label="Currency Short Name"
              placeholder="INR"
              {...form.getInputProps('Currency Short Name')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue(
                  'Currency Short Name',
                  event.currentTarget.value
                );
              }}
            />
            <TextInput
              disabled={readonly}
              label="Currency Symbol"
              placeholder="₹"
              {...form.getInputProps('Currency Symbol')}
              w={'100%'}
              mt={'md'}
              size="md"
              onChange={(event) => {
                form.setFieldValue(
                  'Currency Symbol',
                  event.currentTarget.value
                );
              }}
            />
          </Flex>
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

export { CountryForm };
