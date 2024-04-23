import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ChatContext = createContext<unknown>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo: string | null = JSON.parse(localStorage.getItem("userInfo") ?? 'null');
    if (userInfo) {
      setUser(userInfo);
    } else {
      navigate("/");
    }
  }, [navigate])

    return (
      <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
          {children}
      </ChatContext.Provider>
    );
}

export const ChatState = () => {
  return useContext(ChatContext);
}

export default ChatProvider;