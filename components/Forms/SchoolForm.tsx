import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  Textarea,
  Select,
  LoadingOverlay,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { MatrixDataType, MatrixRowType } from '../Matrix';
import {
  createSchool,
  readBoards,
  readCities,
  readSchools,
  readStates,
  updateSchool,
} from '@/utilities/API';
import { notifications } from '@mantine/notifications';
import { getReduxState } from '@/redux/hooks';
import { getInternationalDailingCode } from '@/utilities/countriesUtils';

function SchoolForm({
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
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [boardsData, setBoardsData] = useState<MatrixDataType>([]);

  const getSelectedCountry = () => {
    const state = getReduxState();
    return state.client.selectedCountry.name;
  };

  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add school`);
    }
  }, []);

  useEffect(() => {
    if (rowData?.state) {
      readCitiesData('state', rowData?.state);
    }
  }, [rowData?.state]);

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
    setCitiesData(cities);
  }

  async function readBoardsData(
    filterBy?: 'name',
    filterQuery?: string | number
  ) {
    let boards: MatrixDataType;
    if (filterBy && filterQuery) {
      boards = await readBoards();
    } else {
      boards = await readBoards();
    }
    setBoardsData(boards);
  }

  async function readStatesData(
    filterBy?: 'country',
    filterQuery?: string | number
  ) {
    let states: MatrixDataType;
    if (filterBy && filterQuery) {
      states = await readStates(filterBy, filterQuery);
    } else {
      states = await readStates();
    }
    setStatesData(states);
  }

  useEffect(() => {
    readStatesData();
    readBoardsData();
  }, []);

  const getMobileCode = () => {
    return `+${getInternationalDailingCode(getSelectedCountry())}`;
  };

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? '',
      board: rowData?.board ?? '',
      group: rowData?.group ?? '',
      type: rowData?.type ?? '',
      tags: rowData?.tags ?? '',
      code: rowData?.code ?? '',
      country: rowData?.country ?? '',
      state: rowData?.state ?? '',
      city: rowData?.city ?? '',
      address: rowData?.address ?? '',
      pincode: rowData?.pincode ?? '',
      label: rowData?.label ?? '',
      geo_address: rowData?.geo_address ?? '',
      contact_number:
        rowData?.contact_number?.replace(getMobileCode(), '').trim() ?? '',
      contact_email: rowData?.contact_email ?? '',
      status: rowData?.status ?? '',
    },

    validate: {
      name: (value) =>
        value.length < 2 ? 'Name must have at least 2 letters' : null,
      board: (value) => (value.length === 0 ? 'Board must be selected' : null),
      state: (value) => (value.length === 0 ? 'State must be selected' : null),
      city: (value) => (value.length === 0 ? 'City must be selected' : null),
      address: (value) =>
        value.length < 2 ? 'Address must have at least 50 letters' : null,
      pincode: (value) =>
        /^[1-9][0-9]{5}$/.test(value) ? null : 'Invalid pin-code', // ^[1-9][0-9]{5}$ // ^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$
      contact_number: (value) =>
        /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
          ? null
          : 'Invalid mobile number',
      contact_email: isEmail('Invalid email'),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      values = {
        ...values,
      };
      const isSchoolUpdated = await updateSchool(rowData._id, values);
      if (isSchoolUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const schools = await readSchools();
        setData(schools);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `School ${rowData.name} updated!`,
        message: `The above school has been updated with new information.`,
        color: 'blue',
      });
    } else {
      values = {
        ...values,
        contact_number: `${getMobileCode()}${values.contact_number}`,
        country: getSelectedCountry(),
      };
      const isSchoolCreated = await createSchool(values as MatrixRowType);
      if (isSchoolCreated.toLowerCase() === 'document created') {
        const schools = await readSchools();
        setData(schools);
        setOLoader(false);
        notifications.show({
          title: `School created!`,
          message: `A new school has been created.`,
          color: 'green',
        });
      } else if (isSchoolCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS') {
        setOLoader(false);
        notifications.show({
          title: `School already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: 'orange',
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: '',
      board: '',
      group: '',
      type: '',
      tags: '',
      code: '',
      country: '',
      state: '',
      city: '',
      address: '',
      pincode: '',
      label: '',
      geo_address: '',
    });
    close();
  };

  const onChangeState = async (event: any) => {
    form.setFieldValue('state', event || '');
    form.setFieldValue('city', '');
    await readCitiesData('state', event);
  };

  const cityNames = citiesData
    .filter((city) => Boolean(city.status))
    .map((city) => {
      return city.name;
    });

  const boardNames = boardsData
    .filter((board) => Boolean(board.status))
    .map((board) => {
      return board.name;
    });

  const stateNames = statesData
    .filter((state) => Boolean(state.status))
    .map((state) => {
      return state.name;
    });

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
              disabled={readonly || rowData !== undefined}
              withAsterisk
              label="Name"
              placeholder="John Doe"
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
              name="Contact E-Mail"
              label="Contact E-Mail"
              placeholder="john.doe@ignitedmindlab.com"
              {...form.getInputProps('contact_email')}
              w={'100%'}
              mt={'md'}
              size="md"
            />
            <TextInput
              disabled={readonly}
              withAsterisk
              name="Contact Mobile"
              label="Contact Mobile"
              placeholder="9876320145"
              {...form.getInputProps('contact_number')}
              type={'number'}
              w={'100%'}
              mt={'md'}
              size="md"
              icon={<div style={{ color: 'black' }}>{getMobileCode()}</div>}
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={boardNames}
              label={'Board'}
              mt={'md'}
              size="md"
              withAsterisk
              {...form.getInputProps('board')}
              w={'100%'}
            />
            <TextInput
              disabled={readonly}
              label="Group"
              placeholder="Group XYZ"
              {...form.getInputProps('group')}
              w={'100%'}
              mt={'md'}
              size="md"
            />
            <TextInput
              disabled={readonly}
              label="Type"
              placeholder="Type ABC"
              {...form.getInputProps('type')}
              w={'100%'}
              mt={'md'}
              size="md"
            />
            <TextInput
              disabled={readonly}
              label="Tags"
              placeholder="Tag1"
              {...form.getInputProps('tags')}
              w={'100%'}
              mt={'md'}
              size="md"
            />
            <TextInput
              disabled={readonly}
              label="Code"
              placeholder="Code 123"
              {...form.getInputProps('code')}
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
            <Textarea
              disabled={readonly}
              placeholder="23, Horizon Lane, Spring Creek Avenue, Paris, France - 780004"
              label="Address"
              {...form.getInputProps('address')}
              withAsterisk
              autosize
              minRows={4}
              w={'100%'}
              mt={'md'}
              size="md"
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={stateNames}
              label={'State'}
              name="State"
              mt={'md'}
              size="md"
              withAsterisk
              {...form.getInputProps('state')}
              onChange={onChangeState}
              w={'100%'}
            />
            <Select
              disabled={readonly || form.values.state === ''}
              searchable
              nothingFound="No options"
              data={cityNames}
              label={'City'}
              mt={'md'}
              size="md"
              withAsterisk
              {...form.getInputProps('city')}
              w={'100%'}
            />
            <TextInput
              disabled={readonly}
              withAsterisk
              label="Pin-Code"
              placeholder="780004"
              {...form.getInputProps('pincode')}
              w={'100%'}
              mt={'md'}
              size="md"
            />
            <TextInput
              disabled={readonly}
              label="Label"
              placeholder="Some Label"
              {...form.getInputProps('label')}
              w={'100%'}
              mt={'md'}
              size="md"
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

export { SchoolForm };
