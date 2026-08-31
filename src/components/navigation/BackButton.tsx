import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <ActionIcon
      variant="subtle"
      aria-label="Înapoi"
      onClick={() => navigate(-1)}
      mb="lg"
      size="lg"
      color="primary"
      c="dark"
      radius="md"
    >
      <IconArrowLeft size={18} />
    </ActionIcon>
  );
};

export default BackButton;
