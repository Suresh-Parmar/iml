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
import { createTemplates, readTempates, updateTemplate } from '@/utilities/API';
import { notifications } from '@mantine/notifications';
import Editor from '../editor/editor';

function TemplatesForm({
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
      setFormTitle(`Add Templates Config`);
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
      const isTemplateUpdated = await updateTemplate(rowData._id, {
        ...values,
      });
      if (isTemplateUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const templates = await readTempates();
        setData(templates);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Template ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isTemplateCreated = await createTemplates(values as MatrixRowType);
      if (isTemplateCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const templates = await readTempates();
        setData(templates);
        setOLoader(false);
        notifications.show({
          title: `Template created!`,
          message: `A new template has been created.`,
          color: 'green',
        });
      } else if (
        isTemplateCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS'
      ) {
        setOLoader(false);
        notifications.show({
          title: `Template already exists!`,
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
            label="Short name"
            placeholder="Short name"
            {...form.getInputProps('shortname')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('shortname', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Subject"
            placeholder="Subject"
            {...form.getInputProps('subject')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('subject', event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Template Type"
            placeholder="Template Type"
            {...form.getInputProps('templatetype')}
            w={'100%'}
            mt={'md'}
            size="md"
            onChange={(event) => {
              form.setFieldValue('templatetype', event.currentTarget.value);
            }}
          />
          <Editor
            readOnly={readonly}
            placeholder="Add template content"
            label="Content"
            {...form.getInputProps('content')}/>
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

export { TemplatesForm };
