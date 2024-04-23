import ChatBox from "@/components/chat/ChatBox";
import MyChats from "@/components/chat/MyChats";
import SideDrawer from "@/components/side/SideDrawer";
import { ChatState } from "@/context/chatProvider";
import { ChatStateType } from "@/models/context/ChatStateType";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

export default function ChatPage() {
  const { user } = ChatState() as ChatStateType
  const [fetchAgain, setFetchAgain] = useState<boolean>(false)
  return (
  <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" gap="10px" w="100%" h="91.5vh" paddingTop={"10px"}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>  );
}
