import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

const Home = () => <div>Home</div>;
const Search = () => <div>Search</div>;
const Post = () => <div>Post</div>;
const Profile = () => <div>Profile</div>;
const Login = () => <div>Login</div>;
const Register = () => <div>Register</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "post",
        element: <Post />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
