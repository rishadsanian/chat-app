import styles from "./styles.module.css";
import React, { useState } from "react";

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage();
    }
  }

  function sendMessage() {
    if (message !== "") {
      const __createdtime__ = Date.now();
      socket.emit("send_message", { message, username, room, __createdtime__ });
      setMessage("");
    }
  }

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default SendMessage;