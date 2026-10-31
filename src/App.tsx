import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import router from "./routes/router";
import { bootstrapSession } from "./auth/bootstrapSession";
import useSocketConnection from "./realtime/useSocketConnection";
import useChatSocketSync from "./realtime/useChatSocketSync";

function App() {
  useSocketConnection();
  useChatSocketSync();

  useEffect(() => {
    bootstrapSession();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
