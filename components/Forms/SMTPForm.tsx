import { TextInput, Button, Group, Box, Flex, LoadingOverlay, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createSMTP, readSMTPConfigs, updateSMTPConfig } from "@/utilities/API";
import { notifications } from "@mantine/notifications";

function SMTPForm({
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
      setFormTitle(`Add SMTP Config`);
    }
  }, []);

  const form = useForm({
    initialValues: {
      ...rowData,
      is_default: rowData?.is_default === "yes" ? true : false,
      name: rowData?.name ?? "",
    },
    validate: {
      name: (value) => (value?.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);

    if (rowData !== undefined) {
      const isSmtpUpdated = await updateSMTPConfig(rowData._id, {
        ...values,
        is_default: values?.is_default ? "yes" : "no",
      });
      if (isSmtpUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const smtpConfigs = await readSMTPConfigs();
        setData(smtpConfigs);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `SMTP Config ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isSmtpCreated = await createSMTP({
        ...values,
        is_default: values?.is_default ? "yes" : "no",
      } as MatrixRowType);
      if (isSmtpCreated.toUpperCase() === "DOCUMENT CREATED") {
        const smtpConfigs = await readSMTPConfigs();
        setData(smtpConfigs);
        setOLoader(false);
        notifications.show({
          title: `SMTP created!`,
          message: `A new subject has been created.`,
          color: "green",
        });
      } else if (isSmtpCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `SMTP already exists!`,
          message: `${values.name} already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: "",
      status: true,
    });
    close();
  };

  /**
  
  
  
*/

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            disabled={readonly || !!rowData}
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
          <TextInput
            disabled={readonly}
            withAsterisk
            label="SMTP Host"
            placeholder="SMTP Host"
            {...form.getInputProps("smtp_host")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("smtp_host", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Send Protocal"
            placeholder="Protocal"
            {...form.getInputProps("send_protocol")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("send_protocol", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="SMTP User"
            placeholder="SMTP User"
            {...form.getInputProps("smtp_user")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("smtp_user", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="SMTP Password"
            placeholder="SMTP Password"
            {...form.getInputProps("smtp_password")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("smtp_password", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="SMTP Port"
            placeholder="SMTP Port"
            {...form.getInputProps("smtp_port")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("smtp_port", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="From Email"
            placeholder="Email"
            {...form.getInputProps("from_email")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("from_email", event.currentTarget.value);
            }}
          />
          <Checkbox
            disabled={readonly}
            mt="md"
            label="Default Yes / No"
            {...form.getInputProps("is_default", { type: "checkbox" })}
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

export { SMTPForm };
