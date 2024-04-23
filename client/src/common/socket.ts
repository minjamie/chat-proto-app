import io, { Socket } from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

export const initialSocket = (setSocketConnected, data) => {
  const socket: Socket = io(ENDPOINT)
  socket.emit("setup", data)
  socket.on("connected", () => {
    setSocketConnected(true)
  })
  return socket
}