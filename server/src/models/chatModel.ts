import IChatDocument from "@src/dtos/chatDto";
import Chat from "@src/dtos/chatDto";
import { Schema, model } from "mongoose";

const chatModel = new Schema<IChatDocument>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = model("Chat", chatModel);
export default Chat;
