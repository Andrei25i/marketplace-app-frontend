import LocationSelector from "@/components/ui/LocationSelector";
import { useRegisterForm } from "@/hooks/auth/useRegisterForm";
import {
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
    <Center mih={{ base: "auto", sm: "100vh" }} py={{ base: "xl", sm: 0 }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "xl", lg: 48 }}
        m={{ base: "lg", sm: "xl" }}
        w="100%"
        maw={570}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon
            size={64}
            radius="100%"
            color="primary.1"
            c="primary.6"
            mb="sm"
          >
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
                placeholder="Popescu"
                style={{ flex: "1 1 140px" }}
                leftSection={<IconIdBadge2 size={18} />}
                withAsterisk
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
              />
              <TextInput
                label="Prenume"
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
              <Text c="red" size="sm" ta="center" mt="sm" fw={500}>
                {error}
              </Text>
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
