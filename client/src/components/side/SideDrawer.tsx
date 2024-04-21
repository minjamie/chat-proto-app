import { ChatState } from "@/context/chatProvider";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import ChatLoading from "@components/chat/ChatLoading";
import ProfileModal from "@components/modal/ProfileModal";
import UserListItem from "@components/user/UserListItem";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);

  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "검색어 입력",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
      return
    }
    try {
      setLoading(true)
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
        description: "검색 로드 중 에러 발생",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

    const accessChat = async (userId:string) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats?.find((chat) => chat._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "채팅을 불러오지 못함",
        description: "채팅 생성 및 조회 실패",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="검색 채팅 유저" hasArrow placement="bottom-end">
        <Button variant={"ghost"} onClick={onOpen}>
            <Text display="flex" px="4">
            유저 검색
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"}>데일리 스터디</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon />
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={user.nickname} src={user.pic}></Avatar>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>프로필</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logOutHandler}>로그아웃</MenuItem>
          </MenuList>
        </Menu>
      </div>
      </Box>
      
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>유저 검색</DrawerHeader>
            <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="닉네임 또는 이메일로 검색"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
