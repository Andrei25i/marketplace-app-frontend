import { formatDayLabel } from "@/utils/chatTime.util";
import { Divider, Text } from "@mantine/core";

type DaySeparatorProps = {
  date: string;
};

const DaySeparator = ({ date }: DaySeparatorProps) => {
  return (
    <Divider
      my="sm"
      labelPosition="center"
      label={
        <Text size="xs" c="dimmed" fw={500}>
          {formatDayLabel(date)}
        </Text>
      }
    />
  );
};

export default DaySeparator;
