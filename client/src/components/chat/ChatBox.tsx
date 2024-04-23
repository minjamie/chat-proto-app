import { ChatState } from "@/context/chatProvider";
import { ChatStateType } from "@/models/context/ChatStateType";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

export default function ChatBox({fetchAgain, setFetchAgain} : {fetchAgain: boolean, setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>}) {
  const { selectedChat } = ChatState() as ChatStateType;

  return (
    <Box
      display={ selectedChat ? "flex" : ""}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );

}
