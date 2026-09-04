import LocationSelector from "@/components/ui/forms/LocationSelector";
import { useRegisterForm } from "@/hooks/auth/useRegisterForm";
import {
  Alert,
  Button,
  Center,
  Flex,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconIdBadge2,
  IconLock,
  IconMail,
  IconPhone,
  IconUserPlus,
} from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const Register = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    handlePhoneChange,
    county,
    setCounty,
    city,
    setCity,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  } = useRegisterForm();

  return (
    <Center mih={{ base: "auto", sm: "100vh" }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "xl", lg: 48 }}
        w="100%"
        maw={570}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon size={64} mb="sm">
            <IconUserPlus size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Creează un cont nou
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Creează un cont nou pentru a începe
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Flex gap="md" wrap="wrap">
              <TextInput
                label="Nume"
                autoCapitalize="words"
                placeholder="Popescu"
                style={{ flex: "1 1 140px" }}
                leftSection={<IconIdBadge2 size={18} />}
                withAsterisk
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
              />
              <TextInput
                label="Prenume"
                autoCapitalize="words"
                placeholder="Andrei"
                style={{ flex: "1 1 140px" }}
                leftSection={<IconIdBadge2 size={18} />}
                withAsterisk
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
              />
            </Flex>

            <TextInput
              label="Telefon"
              placeholder="07xx xxx xxx"
              leftSection={<IconPhone size={18} />}
              withAsterisk
              value={phone}
              onChange={handlePhoneChange}
            />

            <LocationSelector
              selectedCounty={county}
              selectedCity={city}
              onCountyChange={setCounty}
              onCityChange={setCity}
            />

            <TextInput
              label="Adresă de email"
              placeholder="nume@exemplu.ro"
              leftSection={<IconMail size={18} />}
              type="email"
              withAsterisk
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />

            <SimpleGrid cols={{ base: 1, xs: 2 }}>
              <PasswordInput
                label="Parolă"
                placeholder="••••••••"
                leftSection={<IconLock size={18} />}
                withAsterisk
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <PasswordInput
                label="Confirmare parolă"
                placeholder="••••••••"
                leftSection={<IconLock size={18} />}
                withAsterisk
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              />
            </SimpleGrid>

            {error && (
              <Alert
                variant="light"
                color="red"
                radius="md"
                icon={<IconAlertCircle size={18} />}
                mt="sm"
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              radius="md"
              fullWidth
              mt="xl"
              loading={isLoading}
            >
              Creează cont
            </Button>

            <Text c={"dimmed"} ta="center" size="sm" mt="xs">
              Ai deja un cont?{" "}
              <Text component={Link} to={"/login"} c="primary" fw={600}>
                Conectează-te
              </Text>
            </Text>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
};

export default Register;
