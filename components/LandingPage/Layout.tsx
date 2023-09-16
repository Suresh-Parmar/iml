import { Box } from "@mantine/core";
import Wrapper from "./Wrapper";

export function Layout() {
  return (
    <Box sx={{ scrollBehavior: "smooth" }}>
      <Wrapper />
    </Box>
  );
}
