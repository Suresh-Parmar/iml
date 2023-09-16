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
import {
  createSMSConfig,
  readSMSConfigs,
  updateSMSConfig,
} from '@/utilities/API';
import { notifications } from '@mantine/notifications';

function SMSForm({
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
      setFormTitle(`Add SMS Config`);
    }
  }, []);

  const form = useForm({
    initialValues: {
      ...rowData,
      name: rowData?.name ?? '',
    },
    validate: {
      name: (value) =>
        value?.length < 2 ? 'Name must have at least 2 letters' : null,
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);

    if (rowData !== undefined) {
      const isSmsUpdated = await updateSMSConfig(rowData._id, {
        ...values,
      });
      if (isSmsUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const smsConfigs = await readSMSConfigs();
        setData(smsConfigs);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `SMS Config ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isSmsCreated = await createSMSConfig(values as MatrixRowType);
      if (isSmsCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const smsConfigs = await readSMSConfigs();
        setData(smsConfigs);
        setOLoader(false);
        notifications.show({
          title: `SMS Config created!`,
          message: `A new sms config has been created.`,
          color: 'green',
        });
      } else if (isSmsCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS') {
        setOLoader(false);
        notifications.show({
          title: `SMS Config already exists!`,
          message: `${values.name} already exists.`,
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
            label="Name"
            placeholder="Name"
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
            label="Username"
            placeholder="Username"
            {...form.getInputProps('username')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('username', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Password"
            placeholder="Password"
            {...form.getInputProps('password')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('password', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="SMPP Host"
            placeholder="SMPP Host"
            {...form.getInputProps('smpphost')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('smpphost', event.currentTarget.value);
            }}
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

export { SMSForm };
