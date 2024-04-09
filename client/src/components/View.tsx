import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";

export default function View() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<SignUp />}></Route>
      <Route path="/*" element={<Login />}></Route>
    </Routes>
  );
}
