import { AppShell, Container, Title } from "@mantine/core";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <AppShell padding="md" header={{ height: 64 }}>
      <AppShell.Header p="md">
        <Title order={4}>Restaurant Booking</Title>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg" py="md">
          <AvailabilityPage />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
