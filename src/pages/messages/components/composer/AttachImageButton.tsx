import { ACCEPTED_IMAGE_TYPES } from "@/utils/chat.util";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { useRef } from "react";

type AttachImageButtonProps = {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
};

const AttachImageButton = ({ disabled, onFiles }: AttachImageButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Tooltip label="Atașează imagini" openDelay={400}>
        <ActionIcon
          size={28}
          radius="xl"
          variant="subtle"
          color="gray"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          aria-label="Atașează imagini"
        >
          <IconPhoto size={18} />
        </ActionIcon>
      </Tooltip>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={(event) => {
          onFiles(Array.from(event.currentTarget.files ?? []));
          event.currentTarget.value = "";
        }}
      />
    </>
  );
};

export default AttachImageButton;
