import { Input } from "@chakra-ui/input";
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
  const [nickname, setNickname] = useState<string | null | undefined>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();


  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string | null | undefined>>
  ) => {
    setValue(value);
  };

  const submitHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/sign-in",
        { nickname },
        config
      ); 

      console.log(data)
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
        description: "유요하지 않은 입력으로 로그인 실패",
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
        <FormLabel>nickname</FormLabel>
        <Input
          placeholder="nickname 입력해주세요"
          autoComplete="off"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e.target.value, setNickname)
          }
        ></Input>
        <FormErrorMessage>유효하지 않은 nickname</FormErrorMessage>
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
