import LocationSelector from "@/components/ui/forms/LocationSelector";
import SectionTitle from "@/components/ui/forms/SectionTitle";
import { useEditProfileForm } from "@/hooks/auth/useEditProfileForm";
import {
  Alert,
  Button,
  Center,
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
    formRef,
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
    fieldErrors,
    generalError,
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

        <Form ref={formRef} onSubmit={handleSubmit} noValidate>
          <Stack gap="xl">
            <Stack gap="md">
              <SectionTitle>Detalii personale</SectionTitle>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <TextInput
                  label="Nume"
                  placeholder="Numele de familie"
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  withAsterisk
                  error={fieldErrors.last_name}
                />

                <TextInput
                  label="Prenume"
                  placeholder="Prenumele tău"
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  withAsterisk
                  error={fieldErrors.first_name}
                />
              </SimpleGrid>
            </Stack>

            <Stack gap="md">
              <SectionTitle>Informații de contact</SectionTitle>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <TextInput
                  label="Email"
                  placeholder="Adresa ta de email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  leftSection={<IconMail size={18} />}
                  withAsterisk
                  error={fieldErrors.email}
                />

                <TextInput
                  label="Telefon"
                  placeholder="Număr de mobil"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  leftSection={<IconPhone size={18} />}
                  withAsterisk
                  error={fieldErrors.phone_number}
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
                cityError={fieldErrors.city}
              />
            </Stack>

            {generalError && (
              <Alert
                color="red"
                icon={<IconAlertCircle size={18} />}
                radius="md"
                data-form-error
              >
                {generalError}
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

export default EditProfile;
