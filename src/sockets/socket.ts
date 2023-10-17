import { ClientToServerEvents } from "@/interfaces/sockets/ClientToServerEvents";
import { ServerToClientEvents } from "@/interfaces/sockets/ServerToClientEvents";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:3001";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
