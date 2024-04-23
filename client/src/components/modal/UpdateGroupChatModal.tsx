

import { ChatState } from "@/context/chatProvider";
import { ChatStateType } from "@/models/context/ChatStateType";
import UserModel from "@/models/userModel";
import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import UserBadgeItem from "@components/user/UserBadgeItem";
import UserListItem from "@components/user/UserListItem";
import axios from "axios";
import { useState } from "react";


export default function UpdateGroupChatModal({fetchAgain, setFetchAgain} : {fetchAgain: boolean, setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [renameLoading, setRenameLoading] = useState<boolean>(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState() as ChatStateType;
  
  const handleRename = async () => {
    if (!groupChatName) return 
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group`,
        {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "그륩 수정 실패",
        description: "그륩 수정에 실패했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  }

  const handleSearch= async(query: string) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "유저 검색 오류!",
        description: "유저 검색 및 로드 실패",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  }

  const handleAddUser = async (addedUser: UserModel) => {
    if (selectedChat?.users.find((user) => user._id === addedUser._id)) {
      toast({
        title: "이미 추가된 유저",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return
    }

    if (selectedChat?.groupAdmin?._id !== user._id) {
      toast({
        title: "관리자만 추가할 수 있음",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/group/add`,
        {
          chatId: selectedChat._id,
          userId: addedUser._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "유저 추가 실패",
        description: "그륩 채팅 내 유저 추가 실패",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  }


  const handleRemove = async (removeUser: UserModel) => {
    if (selectedChat?.groupAdmin?._id !== removeUser._id && removeUser._id == user._id) {
      toast({
        title: "관리자만 추방할 수 있음",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return
    }    
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group/remove`,
        {
          chatId: selectedChat?._id,
          userId: removeUser._id,
        },
        config
      );

      removeUser._id === user._id ? setSelectedChat("") : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "유저 추방 실패",
        description: "그륩 채팅 내 유저 추방 실패",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  }


  return (
    <>
      <IconButton display={"flex"} icon={<ViewIcon />} onClick={onOpen} aria-label={""} />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat?.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  admin={selectedChat?.groupAdmin?._id}
                  handleFunction={() => handleRemove(user)} />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="채팅 명"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={()=>handleRename()}
              >
                채팅방 수정
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="그륩 채팅에 초대할 유저를 입력"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user : UserModel) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              방 나가기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
