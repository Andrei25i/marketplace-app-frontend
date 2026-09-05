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
import AuthLayout from "@/layouts/AuthLayout";
import EditProfile from "@/pages/profile/EditProfile";
import UserAds from "@/pages/profile/UserAds";
import FavoriteAds from "@/pages/profile/FavoriteAds";

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
        path: "user/:id",
        element: <PublicUserProfile />,
      },
      {
        path: "user/:id/ads",
        element: <UserAds />,
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
          {
            path: "profile/edit",
            element: <EditProfile />,
          },
          {
            path: "profile/favorites",
            element: <FavoriteAds />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
