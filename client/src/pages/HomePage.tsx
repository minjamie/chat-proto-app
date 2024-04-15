import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SignInComponent from "../components/sign/SignInComponent";
import SignUpComponent from "../components/sign/SignUpComponent";
export default function HomePage() {
  return <Container maxW="xl" centerContent>
    <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
     >
      <Text fontSize="4xl">데일리 스터디</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>로그인</Tab>
            <Tab>회원가입</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SignInComponent />
            </TabPanel>
            <TabPanel>
              <SignUpComponent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
  </Container>;
}
