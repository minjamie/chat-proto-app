import ChatBox from "@/components/chat/ChatBox";
import MyChats from "@/components/chat/MyChats";
import SideDrawer from "@/components/side/SideDrawer";
import { ChatState } from "@/context/chatProvider";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

export default function ChatPage() {
  const { user, setUSer } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
  <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" gap="10px" w="100%" h="91.5vh" paddingTop={"10px"}>
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>  );
}
