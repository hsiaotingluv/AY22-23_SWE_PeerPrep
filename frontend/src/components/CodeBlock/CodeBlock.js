import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar";
import "./CodeBlock.css";
import { useAuth } from "../../contexts/AuthContext";
import { paramsToFormData, dataToOutput } from "../../adapters/Judge0Adapter";
import { URL_UPDATE_USER_ATTEMPT } from "../../configs";
import {
  REACT_APP_RAPID_API_HOST,
  REACT_APP_RAPID_API_URL,
} from "../../configs";

function CodeBlock({ socket, roomId, type, code, setCode, testCases }) {
  console.log("code block rendered");
  const [userLang, setUserLang] = useState({
    value: "javascript",
    label: "Javascript",
  });
  const [userTheme, setUserTheme] = useState({
    value: "light",
    label: "Light",
  });
  const [fontSize, setFontSize] = useState(15);
  const [result, setResult] = useState("");
  const [isResultSame, setIsResultSame] = useState("");
  const [save, setSave] = useState(true);
  const options = {
    fontSize: fontSize,
    colorDecorators: true,
  };

  const { user } = useAuth();

  useEffect(() => {
    saveCode(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const saveCode = code => {
    if (!code) return;
    if (save) {
      setSave(false);
      console.log(code, save);
      console.log("Updating code to session table", code);
      axios.patch(URL_UPDATE_USER_ATTEMPT + user, { code });
      setTimeout(() => setSave(true), 10 * 1000);
    }
  };

  const handleCodeReceive = payload => {
    const code = payload.newCode;
    setCode(code);
  };

  const onChange = e => {
    if (e === code) {
      return;
    }

    setCode(e);
    socket.emit("codingEvent", {
      room: roomId,
      newCode: e,
    });
  };

  if (type !== "ATTEMPT HISTORY") {
    socket.on("codeReceiveEvent", handleCodeReceive);
  }

  const testAndCheck = async (test, expected) => {
    setIsResultSame("Loading...");
    setResult("Loading...");

    const formData = paramsToFormData(63, code + "\n" + test, "");

    const options = {
      method: "POST",
      url: REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
      },
      data: formData,
      withCredentials: false,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token, expected);
      })
      .catch(err => {
        let error = err.response ? err.response.data : err;
        setIsResultSame("Error encountered. Try again later.");
        setResult("");
        console.log(error);
      });
  };

  const checkStatus = async (token, expected) => {
    const options = {
      method: "GET",
      url: REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      withCredentials: false,
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        console.log(response.data.stdout);
        // eslint-disable-next-line
        const stdOutResult = dataToOutput(response.data);
        // eslint-disable-next-line
        const expectedResult = JSON.stringify(eval(expected));
        console.log(stdOutResult);
        console.log(expectedResult);

        setIsResultSame(
          expectedResult === stdOutResult
            ? "Correct!"
            : "Output does not match. Try again!"
        );
        setResult(stdOutResult);

        return;
      }
    } catch (err) {
      console.log("err", err);
      setIsResultSame("Error encountered. Try again later.");
      setResult("");
    }
  };

  return (
    <div className="code-mirror">
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <Editor
        options={options}
        height={type !== "ATTEMPT HISTORY" ? "70%" : "86.2vh"}
        width="100%"
        theme={userTheme.value}
        language={userLang.value}
        defaultLanguage="javascript"
        onChange={type !== "ATTEMPT HISTORY" ? onChange : ""}
        value={code}
      />
      {testCases &&
        testCases.map((testCase, idx) => {
          return (
            <button
              className="test-button"
              key={idx}
              onClick={() => testAndCheck(testCase.test, testCase.expected)}>
              Run Test {idx + 1}
            </button>
          );
        })}
      {type !== "ATTEMPT HISTORY" ? (
        <div className="feedback-box">
          <div>
            <strong> Result: </strong>
            {isResultSame}
          </div>
          <div>
            <strong> Output: </strong>
            {result}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default CodeBlock;
