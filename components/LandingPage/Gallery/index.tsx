import { Box, Center, Grid, Title } from "@mantine/core";
import { SingleCard } from "./SingleCard";
import './CssStyle.css'

const data = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "https://mantine.dev/",
    title: "Journey to Swiss Alps",
    author: "Robert Gluesticker",
    views: 7847,
    comments: 5,
  },
];

export function Gallery() {
  const card = data?.map((item) => (
    <Box className="cont" key={item.id}>
      <SingleCard {...item} />
    </Box>
  ));

  return (
    <Box pt={40} pb={70} sx={{ backgroundColor: "rgb(243 241 254)" }}>
      <Center py={30}>
        <Title>Gallery</Title>
      </Center>

      <Grid
        sx={{
          display: "flex",
          width: "80%",
          margin: "auto",
          flexWrap: "wrap",
        }}
        className="wrapper"
      >
        {card}
      </Grid>
    </Box>
  );
}
