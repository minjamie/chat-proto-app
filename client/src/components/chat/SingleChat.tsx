import { getSender } from "@/common/chatLogics";
import { ChatState } from "@/context/chatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";

export default function SingleChat({fetchAgain, setFetchAgain}) {
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
      ChatState();
  
  return (
    <>{selectedChat ?
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          display="flex"
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")} aria-label={""} />
         {!selectedChat.isGroupChat
          ? 
          <>
            {getSender(user, selectedChat.users)}
            {/* <ProfileModal
              user={user}
            /> */}
          </> : (
            <>{selectedChat.chatName.toUpperCase()}</>
          )
          }
      </Text>
      
      :
      <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          유저를 클릭해서 채팅을 시작
        </Text>
      </Box>
}</>
  )
}
