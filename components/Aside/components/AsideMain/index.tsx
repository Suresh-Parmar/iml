import { Aside, Card, Text, Group, Badge, Button, ScrollArea } from '@mantine/core';
import { AsideMainPropsType } from './types';
import Link from 'next/link';

const AsideMainItem = (dataPoint: {
  id: string;
  value: string;
}) => {
  const statusBadgeColorMapper: Record<string, string> = {
    "success": "green",
    "fail": "red",
    "in-progress": "blue",
  }
  return (
    <Link href={`/console/scanners/${dataPoint.id}`}>
    <Card shadow="xs" padding="xs" radius="md" withBorder my={"xs"}>
      <Group position="apart">
        <Text ff={"monospace"} weight={500}>{dataPoint.value}</Text>
        {/* <Badge color={statusBadgeColorMapper[dataPoint.]} variant="light">
          {status}
        </Badge> */}
      </Group>
      {/* <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Details
      </Button> */}
    </Card>
    </Link>
  );
}

function AsideMain({ form }: AsideMainPropsType) {
  return (
    <Aside.Section grow component={ScrollArea}>
        {
          form !== undefined
          ? form
          : <></>
        }
    </Aside.Section>
  );
}

export default AsideMain;