import { default as Chat, default as IChatDocument } from "@src/dtos/chatDto";
import { Schema, model } from "mongoose";
import notiSchema from "./notiModel";

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
    isDeleted: {
      type: Schema.Types.Boolean,
      index: true,
      default: false
    },
    noti: [notiSchema],
    topNoti: { type: Number, default: null },
    joinDates: {
      type: Schema.Types.Mixed,
      default: []
    }
  },
  { timestamps: true }
);

const Chat = model("Chat", chatModel);
export default Chat;
