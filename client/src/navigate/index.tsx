import {BrowserRouter, Routes, Route, Navigate} from "react-router";
import { AuthPage } from "../pages";
import { useAuth } from "../hooks";
import HomePage from "@/pages/Home";
import ChatPage from "@/pages/Chat";
import NotificationPage from "@/pages/Notification";
import FriendPage from "@/pages/Friend";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/Search";

const anonymousRoute = [
  {
    key: '1',
    path: "/",
    element: <AuthPage />,
  },
];

const authRoute = [
  {
    key: '1',
    path: "/",
    element: <HomePage />,
  },
  {
    key: '2',
    path: "/chats",
    element: <ChatPage />,
  },
  {
    key: '3',
    path: "/notifications",
    element: <NotificationPage />,
  },
  {
    key: '4',
    path: "/friends",
    element: <FriendPage/>,
  },
  {
    key: '5',
    path: "/profile/:userId",
    element: <ProfilePage/>,
  },
  {
    key: '6',
    path: "/search",
    element: <SearchPage/>,
  },
];

const NavigateContainer = () => {
  const { isAuth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {isAuth
          ? authRoute.map((item) => (
              <Route key={item.key} path={item.path} element={item.element}/>
            ))
          : anonymousRoute.map((item) => (
              <Route key={item.key} path={item.path} element={item.element} />
            ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default NavigateContainer;
