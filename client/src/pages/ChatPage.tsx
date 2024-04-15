import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatModel from "@/models/chatModel";

export default function ChatPage() {
  const [chats, setChats] = useState<ChatModel[]>([]);

  const fetchChats = async () => {
    const { data } = await axios.get("/api/chat");
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
}
