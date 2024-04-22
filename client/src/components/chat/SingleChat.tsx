import { getSender, getSenderFull } from "@/common/chatLogics";
import { ChatState } from "@/context/chatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import ProfileModal from "@components/modal/ProfileModal";
import UpdateGroupChatModal from "@components/modal/UpdateGroupChatModal";

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
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </>
          :
            (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </>
          )}
        {/* <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"

        >
        </Box> */}
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
