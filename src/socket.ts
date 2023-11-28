import { io } from "socket.io-client"

const URL = 'https://chatting-app-backend-ia4i.onrender.com';

export const socket = io(URL);
