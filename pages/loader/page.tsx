import ApplicationShell from "@/components/ApplicationShell";
import { Container, Loader as MantineLoader } from "@mantine/core";

export default function Loader() {
  return (
    <ApplicationShell>
      <Container>
        <MantineLoader size="xl" variant="dots" />
      </Container>
    </ApplicationShell>
  );
}
