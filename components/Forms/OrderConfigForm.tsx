import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  LoadingOverlay,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MatrixDataType, MatrixRowType } from '../Matrix';
import {
  createOrderConfig,
  readOrderConfigs,
  updateOrderConfig,
} from '@/utilities/API';
import { notifications } from '@mantine/notifications';

function OrderConfigForm({
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
      setFormTitle(`Add Order Config`);
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
      const isOrderConfigUpdated = await updateOrderConfig(rowData._id, {
        ...values,
      });
      if (isOrderConfigUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const orderConfigs = await readOrderConfigs();
        setData(orderConfigs);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Order Config ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isOrderConfigCreated = await createOrderConfig(
        values as MatrixRowType
      );
      if (isOrderConfigCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const orderConfigs = await readOrderConfigs();
        setData(orderConfigs);
        setOLoader(false);
        notifications.show({
          title: `Order Config created!`,
          message: `A new order config has been created.`,
          color: 'green',
        });
      } else if (
        isOrderConfigCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS'
      ) {
        setOLoader(false);
        notifications.show({
          title: `Order Config already exists!`,
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
            label="Invoice Starting No"
            placeholder="Invoice Starting No"
            {...form.getInputProps('invoicestartingno')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue(
                'invoicestartingno',
                event.currentTarget.value
              );
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Order Starting No"
            placeholder="Order Starting No"
            {...form.getInputProps('orderstartingno')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('orderstartingno', event.currentTarget.value);
            }}
          />
          <Textarea
            disabled={readonly}
            withAsterisk
            label="Discount Error Msg"
            placeholder="Discount Error Msg"
            {...form.getInputProps('discounterrmsg')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('discounterrmsg', event.currentTarget.value);
            }}
            minRows={2}
            maxRows={4}
          />
          <Textarea
            disabled={readonly}
            withAsterisk
            label="Discount Success Msg"
            placeholder="Discount Success Msg"
            {...form.getInputProps('discountsuccessmsg')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue(
                'discountsuccessmsg',
                event.currentTarget.value
              );
            }}
            minRows={2}
            maxRows={4}
          />
          <Textarea
            disabled={readonly}
            withAsterisk
            label="Payment Declined Msg"
            placeholder="Payment Declined Msg"
            {...form.getInputProps('paymentdeclinedmsg')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue(
                'paymentdeclinedmsg',
                event.currentTarget.value
              );
            }}
            minRows={2}
            maxRows={4}
          />
          <Textarea
            disabled={readonly}
            withAsterisk
            label="Payment Pending Msg"
            placeholder="Payment Pending Msg"
            {...form.getInputProps('paymentpendingmsg')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue(
                'paymentpendingmsg',
                event.currentTarget.value
              );
            }}
            minRows={2}
            maxRows={4}
          />
          <Textarea
            disabled={readonly}
            withAsterisk
            label="Payment Success Msg"
            placeholder="Payment Success Msg"
            {...form.getInputProps('paymentsuccessfulmsg')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue(
                'paymentsuccessfulmsg',
                event.currentTarget.value
              );
            }}
            minRows={2}
            maxRows={4}
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

export { OrderConfigForm };
