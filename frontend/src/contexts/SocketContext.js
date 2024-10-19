import React, { useState, createContext } from "react";
import { io } from "socket.io-client";
import { URI_MATCHING_SVC } from "../configs";

const socket = io(URI_MATCHING_SVC);
const SocketContext = createContext(socket);

socket.on("connect", () => console.log("connected to socket"));

const SocketProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  return (
    <SocketContext.Provider
      value={{
        difficulty,
        matchedUsers,
        question,
        roomId,
        socket,
        setDifficulty,
        setMatchedUsers,
        setQuestion,
        setRoomId,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
