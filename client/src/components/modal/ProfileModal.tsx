import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";

export default function ProfileModal({user, children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>{
      children ? <span onClick={onOpen}>{children}</span> : <IconButton icon={<ViewIcon />} onClick={onOpen}></IconButton>
    }
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >{user.nickname}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={user.pic}
              alt={user.name}
            ></Image>
            <Text fontSize={{ base: "28px", md: "30px" }}>Email: {user.email }</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue">닫기</Button>
            <Button variant="ghost">액션</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
