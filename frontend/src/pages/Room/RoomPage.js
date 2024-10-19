import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  URL_CREATE_SESSION,
  URL_UPDATE_USER_STATUS,
  URL_CREATE_HISTORY,
  GET_QUESTION_BY_ID,
} from "../../configs";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import Chat from "../../components/Chat/Chat";
import QuestionPanel from "../../components/QuestionPanel/QuestionPanel";
import PeerPrepIcon from "../../assets/logo.svg";
import "./RoomPage.css";

const style = `<style>pre{white-space:pre-wrap;background:#EDF2F7;padding:10px 15px;color:#263238;line-height:1.6;font-size:13px;border-radius:3px margin-top: 0;margin-bottom:1em;overflow:auto}b,strong{font-weight:bolder}#title{font-size:16px;color:#212121;font-weight:600;margin-bottom:10px}hr{height:10px;border:0;box-shadow:0 10px 10px -10px #8c8b8b inset}</style>`;

function RoomPage() {
  const [code, setCode] = useState("");
  const [testCases, setTestCases] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    matchedUsers,
    question,
    roomId,
    setMatchedUsers,
    setQuestion,
    setRoomId,
    socket,
  } = useContext(SocketContext);

  const transformer = {
    1: "EASY",
    2: "MEDIUM",
    3: "HARD",
  };

  useEffect(() => {
    async function init() {
      const session = (await axios.get(URL_CREATE_SESSION + user)).data;
      session ? await getExistingSession(session) : await createSession();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getExistingSession = async session => {
    const { roomId, username1, username2, questionId, attempt } = session;
    const rawQuestion = (await axios.get(GET_QUESTION_BY_ID + questionId)).data
      .body;
    const question = {
      questionId: rawQuestion.id,
      difficulty: rawQuestion.level,
      description: rawQuestion.description,
      title: rawQuestion.title,
    };
    setRoomId(roomId);
    setQuestion(question);
    setMatchedUsers({ username1, username2 });
    setCode(attempt);
    console.log("attempt retrieved: ", attempt);
    const temp = (await axios.get(GET_QUESTION_BY_ID + questionId)).data.body;
    setTestCases(temp.test_cases);
    socket.emit("joinRoom", roomId);
  };

  const createSession = async () => {
    const { username1, username2 } = matchedUsers;
    const { difficulty, questionId } = question;
    const { func_sig, test_cases } = (
      await axios.get(GET_QUESTION_BY_ID + questionId)
    ).data.body;
    const attempt =
      "function " + func_sig + " {\n  //Return your answer to stdout\n}";

    const sessionDetails = {
      username1,
      username2,
      roomId,
      questionId,
      difficulty,
      attempt,
    };
    await axios
      .post(URL_CREATE_SESSION, sessionDetails)
      .catch(err => console.log(err));

    setTestCases(test_cases);
    setCode(attempt);
  };

  const handleExit = () => {
    const { username1, username2 } = matchedUsers;
    socket.emit("leaveRoom", roomId);
    axios.patch(URL_UPDATE_USER_STATUS + user);

    let dateTime = new Date();
    dateTime = dateTime.toLocaleString("en-US", {
      // weekday: 'short', // long, short, narrow
      day: "numeric", // numeric, 2-digit
      year: "numeric", // numeric, 2-digit
      month: "short", // numeric, 2-digit, long, short, narrow
      hour: "numeric", // numeric, 2-digit
      minute: "numeric", // numeric, 2-digit
      // second: 'numeric', // numeric, 2-digit
    }); // Tue, July 21, 2020, 10:01:14 AM

    axios
      .post(`${URL_CREATE_HISTORY}/${user}`, {
        username: user,
        roomId: roomId,
        matchname: username1 === user ? username2 : username1,
        difficulty: parseInt(question?.difficulty, 10),
        questionId: question.questionId,
        dateTime: dateTime,
        attempt: code,
      })
      .then(response => response.status)
      .catch(err => console.warn(err));

    navigate("/dashboard");
  };

  return (
    <div className="container">
      <div className="room-header">
        <div className="peer-prep">
          <div className="name">PeerPrep</div>
          <img className="logo" alt="" src={PeerPrepIcon} />
        </div>
        <div className="type">
          <div className="heading">Difficulty Level</div>
          <div className="chip">
            <b className="value">{transformer[question?.difficulty]}</b>
          </div>
        </div>
        <div className="finish-button" onClick={handleExit}>
          <b className="text">FINISH</b>
        </div>
      </div>
      <div className="room-box">
        <div className="question-panel">
          <QuestionPanel
            description={style + (question?.description || "Question Missing!")}
            title={question?.title || "Error"}
            difficulty={question?.difficulty}
          />
        </div>
        <div className="solution-panel">
          <CodeBlock
            socket={socket}
            roomId={roomId}
            type={"ROOM"}
            code={code}
            setCode={setCode}
            testCases={testCases}
          />
          <Chat socket={socket} roomId={roomId} />
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
