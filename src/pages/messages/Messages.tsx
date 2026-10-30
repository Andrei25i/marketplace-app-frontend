import { Box, Paper, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import classes from "./Messages.module.css";
import ConversationList from "./components/ConversationList";
import NoConversationsSelected from "./components/NoConversationsSelected";
import ConversationPanel from "./components/ConversationPanel";

const Messages = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm})`,
    true,
    { getInitialValueInEffect: false },
  );

  const showList = isDesktop || !conversationId;
  const showPanel = isDesktop || Boolean(conversationId);

  return (
    <Paper withBorder className={classes.container}>
      {showList && (
        <Box className={classes.sidebar}>
          <ConversationList activeId={conversationId} />
        </Box>
      )}

      {showPanel && (
        <Box className={classes.panel}>
          {conversationId ? (
            <ConversationPanel
              key={conversationId}
              conversationId={conversationId}
            />
          ) : (
            <NoConversationsSelected />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default Messages;
