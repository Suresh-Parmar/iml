import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MatrixDataType, MatrixRowType } from '../Matrix';
import {
  createSiteConfig,
  readSiteConfigs,
  updateSiteConfig,
} from '@/utilities/API';
import { notifications } from '@mantine/notifications';

function SiteForm({
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
      setFormTitle(`Add Site Config`);
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
      const isSiteUpdated = await updateSiteConfig(rowData._id, {
        ...values,
      });
      if (isSiteUpdated.toUpperCase() === 'DOCUMENT UPDATED') {
        const siteConfigs = await readSiteConfigs();
        setData(siteConfigs);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Site Config ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: 'blue',
      });
    } else {
      const isSiteCreated = await createSiteConfig(values as MatrixRowType);
      if (isSiteCreated.toUpperCase() === 'DOCUMENT CREATED') {
        const siteConfigs = await readSiteConfigs();
        setData(siteConfigs);
        setOLoader(false);
        notifications.show({
          title: `Site Config created!`,
          message: `A new site config has been created.`,
          color: 'green',
        });
      } else if (isSiteCreated.toUpperCase() === 'DOCUMENT ALREADY EXISTS') {
        setOLoader(false);
        notifications.show({
          title: `Site Config already exists!`,
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
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            disabled={readonly }
            withAsterisk
            label="Name"
            placeholder="Name"
            {...form.getInputProps("name")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("name", event.currentTarget.value);
            }}
          />
          <Select
            disabled={readonly}
            withAsterisk
            w={"100%"}
            mt={"md"}
            size="md"
            label="Default Rows"
            placeholder="Default Rows"
            data={[10, 20, 30, 40, 50].map((pageSize) => `${pageSize}`)}
            {...form.getInputProps("defaultrows")}
            onChange={(value) => {
              form.setFieldValue("defaultrows", Number(value));
            }}
            value={`${form.values.defaultrows}`}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Google Analytics Code"
            placeholder="Google Analytics Code"
            {...form.getInputProps("googleanalyticscode")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("googleanalyticscode", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Contact Number"
            placeholder="Contact Number"
            {...form.getInputProps("contactnumber")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("contactnumber", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Address"
            placeholder="Address"
            {...form.getInputProps("address")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("address", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Pan Number"
            placeholder="Pan Number"
            {...form.getInputProps("pannumber")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("pannumber", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Gst Number"
            placeholder="Gst Number"
            {...form.getInputProps("gstnumber")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("gstnumber", event.currentTarget.value);
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

export { SiteForm };
