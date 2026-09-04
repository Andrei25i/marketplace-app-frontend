import LocationSelector from "@/components/ui/forms/LocationSelector";
import { useEditProfileForm } from "@/hooks/auth/useEditProfileForm";
import {
  Alert,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDeviceFloppy,
  IconMail,
  IconPhone,
  IconUser,
  IconUserEdit,
} from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const EditProfile = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    handlePhoneChange,
    email,
    setEmail,
    county,
    setCounty,
    city,
    setCity,
    error,
    isLoading,
    handleSubmit,
  } = useEditProfileForm();

  return (
    <Center mih={{ base: "auto", sm: "100vh" }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "md", md: "xl" }}
        w="100%"
        maw={570}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon size={64} mb="sm">
            <IconUserEdit size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Editează Profil
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Actualizează-ți detaliile personale și informațiile de contact.
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <Stack gap="xl">
            <Stack gap="md">
              <SectionTitle>Detalii personale</SectionTitle>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <TextInput
                  label="Nume"
                  placeholder="Popescu"
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  withAsterisk
                />

                <TextInput
                  label="Prenume"
                  placeholder="Andrei"
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  withAsterisk
                />
              </SimpleGrid>
            </Stack>

            <Stack gap="md">
              <SectionTitle>Informații de contact</SectionTitle>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <TextInput
                  label="Adresă de email"
                  placeholder="nume@exemplu.ro"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  leftSection={<IconMail size={18} />}
                  withAsterisk
                />

                <TextInput
                  label="Telefon"
                  placeholder="07xxxxxxxx"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  leftSection={<IconPhone size={18} />}
                  withAsterisk
                />
              </SimpleGrid>
            </Stack>

            <Stack gap="md">
              <SectionTitle>Locație</SectionTitle>

              <LocationSelector
                selectedCounty={county}
                selectedCity={city}
                onCountyChange={setCounty}
                onCityChange={setCity}
              />
            </Stack>

            {error && (
              <Alert
                color="red"
                icon={<IconAlertCircle size={18} />}
                radius="md"
              >
                {error}
              </Alert>
            )}

            <Group justify="flex-end" gap="sm" mt="sm">
              <Button
                component={Link}
                to="/profile"
                variant="subtle"
                color="gray"
                disabled={isLoading}
              >
                Anulează
              </Button>

              <Button
                type="submit"
                color="primary"
                leftSection={<IconDeviceFloppy size={18} />}
                loading={isLoading}
              >
                Salvează
              </Button>
            </Group>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Stack gap={6}>
    <Text c="primary" fw={700} fz={12} tt="uppercase">
      {children}
    </Text>
    <Divider color="gray.3" />
  </Stack>
);

export default EditProfile;
