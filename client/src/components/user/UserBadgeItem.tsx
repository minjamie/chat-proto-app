import UserModel from "@/models/userModel";
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

export default function UserBadgeItem({ user, handleFunction, admin } : {user:UserModel, handleFunction: MouseEventHandler<HTMLSpanElement>, admin: string}) {

  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.nickname}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>  )
}
