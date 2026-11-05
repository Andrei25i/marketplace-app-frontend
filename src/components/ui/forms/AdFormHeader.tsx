import { Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";

type AdFormHeaderProps = {
  heading: string;
  subheading: string;
};

const AdFormHeader = ({ heading, subheading }: AdFormHeaderProps) => (
  <Stack align="center" mb={40} gap="xs">
    <ThemeIcon size={64} mb="xs">
      <IconSpeakerphone size={32} />
    </ThemeIcon>

    <Title ta="center" order={1} size="h3">
      {heading}
    </Title>

    <Text ta="center" c="dimmed" size="sm">
      {subheading}
    </Text>
  </Stack>
);

export default AdFormHeader;
