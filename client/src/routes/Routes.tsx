import SignIn from "@/components/sign/SignInComponent";
import SignUp from "@/components/sign/SignUpComponent";
import ChatPage from "@/pages/ChatPage";
import HomePage from "@/pages/HomePage";
import { Route, Routes } from "react-router-dom";

export default function View() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/sign-up" element={<SignIn />}></Route>
      <Route path="/sign-in" element={<SignUp />}></Route>
      <Route path="/chats" element={<ChatPage />}></Route>
    </Routes>
  );
}
