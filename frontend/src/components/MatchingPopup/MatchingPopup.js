import "./MatchingPopup.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { GET_QUESTION_BY_TYPE } from "../../configs";

const MatchingPopup = ({ difficulty, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, setRoomId, setMatchedUsers, setQuestion } =
    useContext(SocketContext);

  const timerProps = {
    isPlaying: true,
    size: 140,
    strokeWidth: 14,
  };

  const transformer = {
    1: "EASY",
    2: "MEDIUM",
    3: "HARD",
  };

  // Create a session on match success & save all details in sessions table
  useEffect(() => {
    const fetchQuestion = async callback => {
      console.log("difficulty: ", difficulty);
      const res = await axios
        .get(GET_QUESTION_BY_TYPE + difficulty)
        .catch(err => console.log("ERROR:", err));
      console.log("fetched question: ", res.data.body);
      callback(res.data.body); // RES.DATA.BODY == QUESTION
    };

    const handleMatchSuccess = (roomId, username1, username2, question) => {
      socket.emit("joinRoom", roomId);
      setRoomId(roomId);
      setMatchedUsers({ username1, username2 });
      setQuestion(question);
      console.log("QUESTION (MATCHING POPUP) ", question);
      removeEventListeners();
      navigate("/room/" + roomId);
    };

    const handleMatchFail = () => {
      removeEventListeners();
      console.log("Unable to find a match!");
    };

    const removeEventListeners = () => {
      socket.off("fetch-question", fetchQuestion);
      socket.off("matchSuccess", handleMatchSuccess);
    };

    socket.emit("match", user, difficulty);
    socket.on("matchSuccess", handleMatchSuccess);
    socket.on("fetch-question", fetchQuestion);
    socket.on("matchFail", handleMatchFail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="matching-popup-div">
      <div className="instruction-div">
        Selected difficulty: <b>{transformer[difficulty]}</b>
      </div>
      <div className="instruction-div">
        Please wait, we’re finding a match for you...
      </div>
      <CountdownCircleTimer
        {...timerProps}
        isPlaying
        duration={30}
        onComplete={() => onClose()}
        colors={["#47d2fc", "#3EAB23", "#FFDA11", "#CA3939"]}
        colorsTime={[30, 20, 10, 0]}>
        {({ remainingTime }) => `${remainingTime}s`}
      </CountdownCircleTimer>
    </div>
  );
};

export default MatchingPopup;
