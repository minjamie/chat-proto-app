import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
import { useState } from "react";

export default function SignUpComponent() {
  const [show, setShow] = useState(false);
  const [nickname, setNickname] = useState<string | null | undefined>();
  const [email, setEmail] = useState<string | null | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | null | undefined>();
  const [password, setPassword] = useState<string | null | undefined>();
  const [pic, setPic] = useState<FileList | null>();
  const [picLoading, setPicLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
 
  const handleInputChange = (value: string, setValue: React.Dispatch<React.SetStateAction<string | null | undefined>>
  ) => {
    setValue(value);
  };

  const postDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files
    setPic(files)
  }



  return <VStack spacing="5px">
    <FormControl id="first-name" isRequired>
      <FormLabel>닉네임</FormLabel>
      <Input
        placeholder="닉네임 입력"
        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleInputChange(e.target.value, setNickname)}
      />
    </FormControl>
    <FormControl id="email" isRequired>
      <FormLabel>이메일</FormLabel>
      <Input
        type="email"
        placeholder="이메일 입력"
        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleInputChange(e.target.value, setEmail)}
      />
    </FormControl>
    <FormControl id="password" isRequired>
      <FormLabel>비밀번호</FormLabel>
      <InputGroup size="md">
        <Input
          type={show ? "text" : "password"}
          placeholder="비밀번호 입력"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value, setPassword)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm"
          onClick={handleClick}
          >
            {show ? "감추기" : "보기"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id="password" isRequired>
      <FormLabel>비밀번호 확인</FormLabel>
      <InputGroup size="md">
        <Input
          type={show ? "text" : "password"}
          placeholder="비밀번호 확인"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value, setConfirmPassword)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm"
          onClick={handleClick}
          >
            {show ? "감추기" : "보기"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id="pic">
      <FormLabel>프로필 사진</FormLabel>
      <Input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => postDetails(e)}
      />
    </FormControl>
    <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
    // onClick={submitHandler}
    // isLoading={picLoading}
    >
      회원가입
    </Button>
  </VStack>
}