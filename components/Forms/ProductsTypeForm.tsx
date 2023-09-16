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
  createProductType,
  readProductCategories,
  updateProductType,
} from '@/utilities/API';
import { notifications } from '@mantine/notifications';

function ProductTypeForm({
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
      setFormTitle(`Add Product Type`);
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
      const isProductTypeUpdated = await updateProductType(rowData._id, {
        ...values,
      });
      if (isProductTypeUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const productTypes = await readProductCategories();
        setData(productTypes);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Product Type ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isProductTypeCreated = await createProductType(
        values as MatrixRowType
      );
      if (isProductTypeCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const productTypes = await readProductCategories();
        setData(productTypes);
        setOLoader(false);
        notifications.show({
          title: `Product Type created!`,
          message: `A new product type has been created.`,
          color: 'green',
        });
      } else if (
        isProductTypeCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS'
      ) {
        setOLoader(false);
        notifications.show({
          title: `Product type already exists!`,
          message: `${values.name} already exists.`,
          color: 'orange',
        });
      } else {
        setOLoader(false);
      }
    }
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
            label="Code"
            placeholder="Code"
            {...form.getInputProps('code')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('code', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Tax Name"
            placeholder="Tax Name"
            {...form.getInputProps('taxname')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('taxname', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Tax Percent"
            placeholder="Tax Percent"
            {...form.getInputProps('taxpercent')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('taxpercent', event.currentTarget.value);
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

export { ProductTypeForm };
