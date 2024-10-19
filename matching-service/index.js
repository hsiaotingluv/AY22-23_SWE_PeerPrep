import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ormCreatePendingMatch as createPendingMatch,
  ormDeletePendingMatch as deletePendingMatch,
  ormFindPendingMatch as findPendingMatch,
} from "./model/match-orm.js";
import EventEmitter from "events";

const app = express();
const corsOptions = {
  origin: "http:localhost/3000",
  methods: ["GET", "POST"],
  credentials: true,
};
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const eventEmitter = new EventEmitter();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions)); // config cors so that front-end can use
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

io.on("connection", socket => {
  const matchListener = async (user, difficulty) => {
    let pendingMatch = await findPendingMatch(difficulty);
    const hasMatch = !!pendingMatch;

    if (hasMatch) {
      handleMatchSuccessEvent(user, pendingMatch);
    } else {
      socket.emit("fetch-question", async resp => {
        const { title, description, id } = resp;
        pendingMatch = await createPendingMatch(
          user,
          socket.id,
          difficulty,
          id,
          description,
          title
        );
        waitForMatch(pendingMatch);
      });
    }
  };

  const joinRoomListener = roomId => {
    console.log(`${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  };

  const handleMatchSuccessEvent = (matchedUser, pendingMatch) => {
    const { user, clientId, difficulty, questionId, description, title } =
      pendingMatch;
    const question = { questionId, difficulty, description, title };
    eventEmitter.emit("matchFound", clientId);
    io.to([socket.id, clientId]).emit(
      "matchSuccess",
      `${socket.id}${clientId}`,
      user,
      matchedUser,
      question
    );
    deletePendingMatch(pendingMatch);
  };

  const handleMatchFailEvent = pendingMatch => {
    socket.emit("matchFail");
    socket.off("joinRoom", joinRoomListener);
    deletePendingMatch(pendingMatch);
  };

  const waitForMatch = pendingMatch => {
    const timeout = setTimeout(
      handleMatchFailEvent.bind(this, pendingMatch),
      30 * 1000
    );
    eventEmitter.on("matchFound", clientId => {
      if (clientId === socket.id) {
        clearTimeout(timeout);
      }
    });
  };

  const handleCodingEvent = data => {
    socket.broadcast.to(data.room).emit("codeReceiveEvent", data);
  };

  const leaveRoomListener = roomId => {
    console.log(`${socket.id} left room ${roomId}`);
    socket.leave(roomId);
  };

  const messageListener = data => {
    console.log(`${socket.id} sending message to room ${data.roomId}`);
    socket.to(data.roomId).emit("receive_message", data);
  };

  const reconnectSessionHandler = username => {
    console.log("logic to reconnect user to session");
  };

  socket.on("match", matchListener);
  socket.on("joinRoom", joinRoomListener);
  socket.on("leaveRoom", leaveRoomListener);
  socket.on("codingEvent", handleCodingEvent);
  socket.on("send_message", messageListener);
  socket.on("reconnect-session", reconnectSessionHandler);
});

httpServer.listen(process.env.PORT || 8001, () => {
  console.log("listening on port 8001");
});