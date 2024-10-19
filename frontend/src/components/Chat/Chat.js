import "./Chat.css";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useAuth } from '../../contexts/AuthContext';
import sendIcon from "../../assets/send.png"

//Source Referenced: https://github.com/machadop1407/react-socketio-chat-app
function Chat({ socket, roomId }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const { user } = useAuth();


  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        roomId: roomId,
        author: user,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours().toString() +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2,'0'),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div className="message" id={user === messageContent.author ? "you" : "other"}>
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="padding">
        <div className="message-box">
          <textarea 
            className="input" 
            placeholder="Message"
            variant="outlined"
            resize="none"
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
            onKeyPress={(event) => {
              if (!event.ctrlKey) {
                event.key === "Enter" && sendMessage();
              } else if (event.ctrlKey && event.key === "Enter") {
                setCurrentMessage(currentMessage + "\r\n")
              }
            }}
          />
          <button className="button">
            <b className="button-text" onClick={sendMessage}><img src={sendIcon} height={"30px"} width={"30px"} alt="send button" /></b>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;