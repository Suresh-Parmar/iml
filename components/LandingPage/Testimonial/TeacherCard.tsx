import { setGetData } from "@/helpers/getLocalStorage";
import { createStyles, Card, Image, Avatar, Text, Group } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: "transparent",
    border: "none !important",
  },

  desc: {
    fontWeight: 400,
    fontSize: "14px",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.35,
    color: "#495057",
  },

  body: {
    padding: theme.spacing.md,
  },

  teacherImage: {
    width: "5.75rem",
    height: "5.75rem",
    position: "absolute",
    right: "12px",
    top: "-4px",
  },
  group: {
    border: "0.0625rem solid #dee2e6",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    margin: "20px 0 0 12px",
    borderRadius: "0.5rem",
  },
  image: {
    borderRadius: "50%",
    width: "140px",
    height: "140px",
  },
  placeholderIcon: {
    width: "140px !important",
    height: "140px !important",
    color: "#b5b7bc",
  },
  placeholder: {
    color: "#b5b7bc",
  },
}));

interface ArticleCardVerticalProps {
  image: string;
  category: string;
  title: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface TestimonialResponse {
  _id: string;
  name: string;
  school: string;
  description: string;
  startdate: string;
  enddate: string;
  thumbnail: string;
  country: string;
  status: string;
  created_at: string;
}

export function TeacherCard({ thumbnail, name, description, startdate, school }: TestimonialResponse) {
  let isDarkThem = setGetData("colorScheme");

  const { classes } = useStyles(isDarkThem);
  return (
    <Card radius="md" p={0} className={classes.card}>
      <Group noWrap className={classes.group} spacing={0}>
        {/* <Image classNames={{root: classes.teacherImage, image:classes.image}} src={thumbnail} alt="" height={140} width={140} /> */}
        <Avatar
          src={null}
          radius={"50%"}
          classNames={{
            root: classes.teacherImage,
            image: classes.image,
            placeholder: classes.placeholder,
            placeholderIcon: classes.placeholderIcon,
          }}
          alt="no image here"
          color="#b5b7bc"
        />
        <div className={classes.body}>
          <Text transform="uppercase" w={"70%"} weight={700} size="xs">
            {school}
          </Text>
          <Text className={classes.desc} mt="1.4rem" mb="md">
            {description}
          </Text>
          <Group noWrap spacing="xs">
            <Group spacing="xs" noWrap>
              {/* <Avatar size={20} src={"author.avatar"} /> */}~<Text size="xs">{name}</Text>
            </Group>
            <Text size="xs" color="dimmed">
              •
            </Text>
            <Text size="xs" color="dimmed">
              {startdate}
            </Text>
          </Group>
        </div>
      </Group>
    </Card>
  );
}
