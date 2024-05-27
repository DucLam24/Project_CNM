import { ProtectAuthRoutes } from "#/components/ProtectRoute";
import AppLayout from "#/components/Layouts";
import App from "#/pages/App";
import Login from "#/pages/Login";
import Register from "#/pages/Register";
import NotFound from "#/pages/404";
import ListFriend from "#/pages/ListFriend";
import ListGroup from "#/pages/ListGroup";
import FriendRequest from "#/pages/FriendRequest";
import NotificationList from "#/pages/NotificationList";
import RegisterSuccess from "#/pages/Register/RegisterSuccess";
import SentedFriendRequest from "#/pages/SendtedFriendRequest";
import ForgotPassword from "#/pages/ForgotPassword";
import CallPage from "#/pages/CallPage";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "/call/:conversationId",
        element: <CallPage />,
      },
      {
        path: "/list-friend",
        element: <ListFriend />,
      },
      {
        path: "/list-group",
        element: <ListGroup />,
      },
      {
        path: "/list-friend-request",
        element: <FriendRequest />,
      },
      {
        path: "/list-sented-friend",
        element: <SentedFriendRequest />,
      },
      {
        path: "/notification",
        element: <NotificationList />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectAuthRoutes redirectPath="/">
        <Login />
      </ProtectAuthRoutes>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectAuthRoutes redirectPath="/">
        <Register />
      </ProtectAuthRoutes>
    ),
  },
  {
    path: "/register-success",
    element: (
      <ProtectAuthRoutes redirectPath="/">
        <RegisterSuccess />
      </ProtectAuthRoutes>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectAuthRoutes redirectPath="/">
        <ForgotPassword />
      </ProtectAuthRoutes>
    ),
  },
];
