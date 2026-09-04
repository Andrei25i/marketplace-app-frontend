import { Paper, Title, Spoiler, Text } from "@mantine/core";

interface ExpandableTextProps {
  title?: string;
  text: string;
}

export default function ExpandableText({
  title = "Descriere",
  text,
}: ExpandableTextProps) {
  return (
    <Paper
      p="md"
      withBorder
      style={{ borderLeft: "4px solid var(--mantine-color-primary-6)" }}
    >
      <Title order={3} size="sm" tt="uppercase" lts={2} mb="md">
        {title}
      </Title>

      <Spoiler
        maxHeight={125}
        showLabel="Vezi mai mult"
        hideLabel="Vezi mai puțin"
        styles={{
          control: {
            color: "var(--mantine-color-primary-6)",
            fontWeight: 600,
            marginTop: "10px",
            fontSize: "14px",
          },
        }}
      >
        <Text c="dimmed" lh="relaxed" style={{ whiteSpace: "pre-wrap" }}>
          {text}
        </Text>
      </Spoiler>
    </Paper>
  );
}
