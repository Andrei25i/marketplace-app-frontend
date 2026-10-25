import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import router from "./routes/router";
import { bootstrapSession } from "./auth/bootstrapSession";

function App() {
  useEffect(() => {
    bootstrapSession();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
