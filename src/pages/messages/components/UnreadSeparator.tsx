import { Divider, Text } from "@mantine/core";

type UnreadSeparatorProps = {
  count: number;
};

const formatUnreadLabel = (count: number) => {
  if (count === 1) return "1 mesaj necitit";
  const needsDe = count % 100 === 0 || count % 100 >= 20;
  return `${count} ${needsDe ? "de " : ""}mesaje necitite`;
};

const UnreadSeparator = ({ count }: UnreadSeparatorProps) => (
  <Divider
    data-unread-marker
    my="sm"
    color="primary.3"
    labelPosition="center"
    label={
      <Text size="xs" fw={600} c="primary">
        {formatUnreadLabel(count)}
      </Text>
    }
  />
);

export default UnreadSeparator;
