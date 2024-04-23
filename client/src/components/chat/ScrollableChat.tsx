import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "@/common/chatLogics";
import { ChatState } from "@/context/chatProvider";
import { ChatStateType } from "@/models/context/ChatStateType";
import MessageModel from "@/models/messageModel";
import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from 'react-scrollable-feed';

export default function ScrollableChat({ messages } : { messages : MessageModel[]}) {
  const { user } = ChatState() as ChatStateType
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message: MessageModel, idx: number) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(messages, message, idx, user._id) ||
              isLastMessage(messages, idx, user._id)) && (
              <Tooltip label={message.sender.nickname} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.nickname}
                  src={message.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, message, idx, user._id),
                marginTop: isSameUser(messages, message, idx) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  )
}
