import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import NotFound from "../pages/notFound/NotFound";
import Categories from "@/pages/categories/Categories";
import Home from "@/pages/home/Home";
import Search from "@/pages/search/Search";
import AdDetails from "@/pages/adDetails/AdDetails";
import MyProfile from "@/pages/profile/MyProfile";
import PublicUserProfile from "@/pages/profile/PublicUserProfile";

const Post = () => <div>Post</div>;

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
        path: "categories",
        element: <Categories />,
      },
      {
        path: "ads/:id",
        element: <AdDetails />,
      },
      {
        path: "/user/:id",
        element: <PublicUserProfile />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "post",
            element: <Post />,
          },
          {
            path: "profile",
            element: <MyProfile />,
          },
        ],
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
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
