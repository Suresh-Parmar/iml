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

function SingleCard(props: any) {
  console.log(props);
  const { item } = props;
  let { subject_id, name, imageuploadurl } = item;
  console.log(imageuploadurl);

  return (
    <Card
      shadow="sm"
      padding="0"
      radius="md"
      h={"100%"}
      className="d-flex flex-column justify-content-between"
      withBorder
    >
      <div>
        <Card.Section component="a" href="">
          <img
            src={imageuploadurl}
            alt={"Norway" + name}
            style={{
              width: "100%",
            }}
          />
        </Card.Section>

        <Group position="apart" display={"grid"} mt="md" style={{ padding: "0 15px" }} mb="xs">
          <Badge
            w={"fit-content"}
            color={subject_id === "Maths" ? "pink" : subject_id === "Science" ? "orange" : "yellow"}
            variant="light"
          >
            {subject_id}
          </Badge>
          <Text weight={600}>{name}</Text>
        </Group>
      </div>
      {/* <Group position="apart" display={"flex"} color="lightgrey" fz={"sm"} mt="md" mb="xs">
        <Text weight={400}>12 Lessons</Text>
        <Text weight={400}>2 hr 30 min</Text>
      </Group> */}
      <div style={{ margin: "15px" }}>
        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Buy Online
        </Button>
      </div>
    </Card>
  );
}

export default SingleCard;
