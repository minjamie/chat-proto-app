import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";

export default function SignInComponent() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>();
  const [password, setPassword] = useState<string | null | undefined>();

  const handleClick = () => setShow(!show);

  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string | null | undefined>>
  ) => {
    setValue(value);
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
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        colorScheme="teal"
      >
        로그인
      </Button>
    </VStack>
  );
}
