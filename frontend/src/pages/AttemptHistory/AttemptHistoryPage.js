import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  GET_QUESTION_BY_ID,
} from "../../configs";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import QuestionPanel from "../../components/QuestionPanel/QuestionPanel";
import PeerPrepIcon from "../../assets/logo.svg";
import { SocketContext } from "../../contexts/SocketContext";
import "./AttemptHistoryPage.css";

const style = `<style>pre{white-space:pre-wrap;background:#EDF2F7;padding:10px 15px;color:#263238;line-height:1.6;font-size:13px;border-radius:3px margin-top: 0;margin-bottom:1em;overflow:auto}b,strong{font-weight:bolder}#title{font-size:16px;color:#212121;font-weight:600;margin-bottom:10px}hr{height:10px;border:0;box-shadow:0 10px 10px -10px #8c8b8b inset}</style>`;

function AttemptHistoryPage() {
  const { state } = useLocation();
  const questionId = state.questionId;
  const attempt = state.attempt;

  const navigate = useNavigate();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState();

  const transformer = {
    1: "EASY",
    2: "MEDIUM",
    3: "HARD",
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    async function fetchQuestion() {
      const res = await axios
        .get(GET_QUESTION_BY_ID + questionId)
        .catch(err => {
          console.log(err);
        });
      const { title, description, level } = res.data.body;
      setQuestionDescription(style + description);
      setQuestionTitle(title);
      setQuestionDifficulty(level);
    }
    fetchQuestion();
    // eslint-disable-next-line
  }, [])

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
            <b className="value">{transformer[questionDifficulty]}</b>
          </div>
        </div>
        <div className="finish-button" onClick={handleExit}>
          <b className="text">EXIT</b>
        </div>
      </div>
      <div className="room-box">
        <div className="question-panel">
          <QuestionPanel
            description={questionDescription}
            title={questionTitle}
            difficulty={questionDifficulty}
          />
        </div>
        <div className="solution-panel">
          <CodeBlock type={"ATTEMPT HISTORY"} code={attempt}/>
        </div>
      </div>
    </div>
  );
}

export default AttemptHistoryPage;
