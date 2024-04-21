import { ChatState } from "@/context/chatProvider";
import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import UserListItem from "@components/user/UserListItem";
import axios from "axios";
import { useState } from "react";
import UserBadgeItem from "../user/UserBadgeItem";


export default function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatNam, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = <ReactNode />, []; > ([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleSubmit(event): void {
    throw new Error("Function not implemented.");
  }

  function handleGroup(userToAdd) {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  function handleDelete() {
    throw new Error("Function not implemented.");
  }

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
            {selectedUsers.map((user) => {
              <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete()} />;
            })}
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user?._id}
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
