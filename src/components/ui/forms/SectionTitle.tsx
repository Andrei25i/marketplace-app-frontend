import { Divider, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <Stack gap={6}>
      <Text c="primary" fw={700} fz={12} tt="uppercase">
        {children}
      </Text>

      <Divider color="gray.3" />
    </Stack>
  );
};

export default SectionTitle;
