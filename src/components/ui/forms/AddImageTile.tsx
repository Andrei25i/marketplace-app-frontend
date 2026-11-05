import { Box, Center, Text, UnstyledButton } from "@mantine/core";
import { IconPhotoPlus } from "@tabler/icons-react";
import { useRef } from "react";

type AddImageTileProps = {
  onFiles: (files: FileList | null) => void;
};

const AddImageTile = ({ onFiles }: AddImageTileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onFiles(e.currentTarget.files);
          e.currentTarget.value = "";
        }}
      />

      <UnstyledButton
        w="100%"
        onClick={() => inputRef.current?.click()}
        style={{
          aspectRatio: "1/1",
          borderRadius: "var(--mantine-radius-md)",
          border: "1px dashed var(--mantine-color-gray-4)",
        }}
      >
        <Center h="100%">
          <Box ta="center" c="dimmed">
            <IconPhotoPlus size={20} color="var(--mantine-color-primary-6)" />
            <Text size="xs">Adaugă</Text>
          </Box>
        </Center>
      </UnstyledButton>
    </>
  );
};

export default AddImageTile;
