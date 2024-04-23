import { ChatState } from "@/context/chatProvider";
import { ChatStateType } from "@/models/context/ChatStateType";
import UserModel from "@/models/userModel";
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import UserBadgeItem from "@components/user/UserBadgeItem";
import UserListItem from "@components/user/UserListItem";
import axios from "axios";
import { ReactNode, useState } from "react";


export default function GroupChatModal({ children } : {children : ReactNode}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState() as ChatStateType;

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) return;
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
        title: "검색 실패",
        description: "유저 검색 결과 조회 실패",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  function handleGroup(userToAdd :UserModel) {
   if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "이미 추가된 유저",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "모든 필드를 입력(채팅 명과 초대할 유저 선택)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();      
      toast({
        title: "새로운 그륩 채팅 생성 완료",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "생성 실패",
        description: "그륩 채팅 생성 실패",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }


  function handleDelete(deleteUser: UserModel) {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== deleteUser._id)
    )
  }
console.log(children)
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >그륩 채팅 만들기</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex" flexDir="column" alignItems="center"
          >
            <FormControl>
              <Input placeholder="채팅 명" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder="유저 추가 시 닉네임명이나 이메일 검색" mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user: UserModel) => (
                <UserBadgeItem
                  key={user._id}
                  admin={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user: UserModel) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)} />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              채팅 생성
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
