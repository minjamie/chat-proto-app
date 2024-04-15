import { Route, Routes } from "react-router-dom";
import SignIn from "@pages/SignIn";
import SignUp from "@pages/SignUp";
import ChatPage from "@/pages/ChatPage";
import Home from "@/pages/Home";

export default function View() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/sign-up" element={<SignIn />}></Route>
      <Route path="/sign-in" element={<SignUp />}></Route>
      <Route path="/chats" element={<ChatPage />}></Route>
    </Routes>
  );
}
