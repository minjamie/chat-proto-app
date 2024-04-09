import {
  VStack,
  ButtonGroup,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";

export default function Login() {
  return (
    <VStack
      as="form"
      w={{ base: "90%", md: "500px" }}
      m="auto"
      justify="center"
    >
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input
          name="id"
          placeholder="아이디를 입력해주세요"
          autoComplete="off"
        ></Input>
        <FormErrorMessage>유효하지 않은 아이디</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input
          name="password"
          placeholder="비밀번호를 입력해주세요"
          autoComplete="off"
        ></Input>
      </FormControl>
      <ButtonGroup>
        <Button colorScheme="teal">로그인</Button>
        <Button>회원가입</Button>
      </ButtonGroup>
    </VStack>
  );
}
