import { ChatState } from "@/context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

export default function ChatBox({fetchAgain, setFetchAgain}) {
  const { selectedChat } = ChatState();

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
