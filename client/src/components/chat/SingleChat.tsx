import { getSender, getSenderFull } from "@/common/chatLogics";
import { ChatState } from "@/context/chatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import animationData from "@common/typing.json";
import ProfileModal from "@components/modal/ProfileModal";
import UpdateGroupChatModal from "@components/modal/UpdateGroupChatModal";
import axios from "axios";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import "./SingleChat.css";
export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIstyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [selectedChatCompare, setSelectedChatCompare] = useState(null)
  const [newMessageReceived, setNewMessageReceived] = useState()
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const ENDPOINT = "http://localhost:4000";


  useEffect(() => {
    const newSocket = io(ENDPOINT);
    newSocket.emit("setup", user);
    newSocket.on("connected", () => setSocketConnected(true));
    newSocket.on("typing", () => setIsTyping(true));
    newSocket.on("stop typing", () => setIsTyping(false));
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        if (!selectedChatCompare) {
          if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
              setFetchAgain(!fetchAgain);
            }
        } else {
          setMessages([...messages, newMessageReceived])
        }
      })
    }
  })

  useEffect(() => {


    if (selectedChatCompare && newMessageReceived) {
      if (selectedChatCompare._id !== newMessageReceived.chat._id) {
        debugger;
      }
    }

  })

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      if (e.nativeEvent.isComposing) return;
        try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data)
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "메시지 발송 실패",
          description: "메시지 전송에 실패했습니다.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const fetchMessages = async () => {
  
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data)
      setLoading(false);
      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      console.log(error)
      toast({
        title: "메시지 조회 실패",
        description: "메시지 조회에 실패했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages()
    setSelectedChatCompare(selectedChat)
  }, [selectedChat])
        console.log(notification, "=-=-==-=-=-=-=-")
  
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
        if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

  };

  return (
    <>
      {selectedChat ? (
        <>
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
              onClick={() => setSelectedChat("")}
              aria-label={""}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
                <div className="messages"><ScrollableChat messages={messages} /></div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3} id="first-name" >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="메시지 입력"
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            유저를 클릭해서 채팅을 시작
          </Text>
        </Box>
      )}
    </>
  );
}
