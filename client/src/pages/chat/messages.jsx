import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const Messages = ({ socket }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);
  console.log(messagesReceived);
  //runs whenever a socket event is receiverd from server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });
    //remove event listener on commponent unmount
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  function formatDateFromTimestamp(timestamp) {
    console.log(timestamp);
    const date = new Date(parseInt(timestamp));
    console.log(date.toLocaleString());
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn}>
      CHAT
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
    </div>
  );
};

export default Messages;
