import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const imageUpdateUrl = import.meta.env.VITE_UPLOAD_URL;
const imageUploadCloudName = import.meta.env.VITE_UPLOAD_CLOUD_NAME;

export default function SignUpComponent() {
  const [show, setShow] = useState(false);
  const [nickname, setNickname] = useState<string | null | undefined>();
  const [email, setEmail] = useState<string | null | undefined>();
  const [password, setPassword] = useState<string | null | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<
    string | null | undefined
  >();
  const [image, setImage] = useState<Blob | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string | null | undefined>>
  ) => {
    setValue(value);
  };

  const postDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];
    setLoading(true);
    if (!selectedImage)
      toast({
        title: "사진 선택해주세요",
        description: "사진 필수",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

    if (
      selectedImage?.type == "image/jpeg" ||
      selectedImage?.type == "image/png"
    ) {
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", imageUploadCloudName as string);

      fetch(imageUpdateUrl as string, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());
          setLoading(false);
        });
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    console.log(nickname, email, password, confirmPassword);
    if (!nickname || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "패스워드 불일치",
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
        "/api/user/sign-up",
        {
          nickname,
          email,
          password,
          image,
        },
        config
      );
      toast({
        title: "회원 가입 성공",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "서버 오류로 회원 가입 실패했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>닉네임</FormLabel>
        <Input
          placeholder="닉네임 입력"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e.target.value, setNickname)
          }
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>이메일</FormLabel>
        <Input
          type="email"
          placeholder="이메일 입력"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e.target.value, setEmail)
          }
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>비밀번호</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="비밀번호 입력"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e.target.value, setPassword)
            }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "숨기기" : "보기"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password-confirm" isRequired>
        <FormLabel>비밀번호 확인</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="비밀번호 확인"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e.target.value, setConfirmPassword)
            }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "숨기기" : "보기"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="image">
        <FormLabel>프로필 사진</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={postDetails} />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        회원가입
      </Button>
    </VStack>
  );
}
