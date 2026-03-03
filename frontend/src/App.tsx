import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { AppShell, Container, Title } from "@mantine/core";

export default function App() {
  return (
    <AppShell padding="md">
      <AppShell.Header p="md">
        <Title order={4}>Restaurant Booking</Title>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="md"></Container>
      </AppShell.Main>
    </AppShell>
  );
}
