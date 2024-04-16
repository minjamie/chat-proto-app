import { Message } from "./messageDto";
import User from "./userDto";

export default interface Chat {
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  groupAdmin: User;
}
