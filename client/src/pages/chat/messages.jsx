import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);
  const messagesEndRef = useRef(null);

  //runs whenever a socket event is received from server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    //remove event listener on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  //scroll to bottom of messages container
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messagesReceived]);

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn}>
      CHAT
      <div className={styles.messagesContainer}>
        {messagesReceived.map((msg, i) => (
          <div className={styles.message} key={i}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={styles.msgMeta}>{msg.username}</span>
              <span className={styles.msgMeta}>
                {formatDateFromTimestamp(msg.__createdtime__)}
              </span>
            </div>
            <p className={styles.msgText}>{msg.message}</p>
            <br />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;