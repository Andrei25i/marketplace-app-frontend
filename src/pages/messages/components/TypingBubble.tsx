import { Box, Group } from "@mantine/core";
import classes from "../Messages.module.css";

const TypingBubble = () => (
  <Group justify="flex-start" mt="xs">
    <Box
      className={`${classes.bubble} ${classes.typingBubble}`}
      data-tail
      role="status"
      aria-label="Scrie un mesaj"
    >
      <span className={classes.typingDots}>
        <span />
        <span />
        <span />
      </span>
    </Box>
  </Group>
);

export default TypingBubble;
