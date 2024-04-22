import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInComponent() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>();
  const [password, setPassword] = useState<string | null | undefined>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string | null | undefined>>
  ) => {
    setValue(value);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "모든 필드 입력",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/sign-in",
        { email, password },
        config
      ); 

      toast({
        title: "로그인 성공",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack
      as="form"
      w={{ base: "90%", md: "500px" }}
      m="auto"
      justify="center"
    >
      <FormControl isRequired>
        <FormLabel>이메일</FormLabel>
        <Input
          placeholder="이메일을 입력해주세요"
          autoComplete="off"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e.target.value, setEmail)
          }
        ></Input>
        <FormErrorMessage>유효하지 않은 아이디</FormErrorMessage>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>비밀번호</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e.target.value, setPassword)
            }
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "숨기기" : "보기"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        width="100%"
        style={{ marginTop: 15 }}
        colorScheme="teal"
        onClick={submitHandler}
        isLoading={loading}
      >
        로그인
      </Button>
    </VStack>
  );
}
