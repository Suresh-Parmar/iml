import React from "react";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";

interface competitionType {
  code: string;
  country: string;
  created_at: string;
  message: string;
  mode_id: string;
  name: string;
  parent_competition_id: string;
  status: boolean;
  subject_id: string;
  tags: string;
  updated_at: string;
  _id: string;
}

interface data {
  _id: number;
  subject_id: string;
  name: string;
  // message:string,
}

function SingleCard({ name, subject_id }: data) {
  return (
    <Card shadow="sm" padding="lg" radius="md" h={"100%"} withBorder>
      <Card.Section component="a" href="">
        <Image src={"image"} height={160} alt="Norway" />
      </Card.Section>

      <Group position="apart" display={"grid"} mt="md" mb="xs">
        <Badge
          w={"fit-content"}
          color={subject_id === "Maths" ? "pink" : subject_id === "Science" ? "orange" : "yellow"}
          variant="light"
        >
          {subject_id}
        </Badge>
        <Text weight={600}>{name}</Text>
      </Group>

      {/* <Group position="apart" display={"flex"} color="lightgrey" fz={"sm"} mt="md" mb="xs">
        <Text weight={400}>12 Lessons</Text>
        <Text weight={400}>2 hr 30 min</Text>
      </Group> */}
      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Buy Online
      </Button>
    </Card>
  );
}

export default SingleCard;
