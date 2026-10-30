import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  mb?: string | number;
};

const BackButton = ({ mb = "lg" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      aria-label="Înapoi"
      onClick={() => navigate(-1)}
      mb={mb}
      size="lg"
      radius="md"
    >
      <IconArrowLeft size={18} />
    </ActionIcon>
  );
};
export default BackButton;
