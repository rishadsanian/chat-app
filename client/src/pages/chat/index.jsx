import styles from "./styles.module.css";
import MessagesReceived from "./messages";
import SendMessage from "./send-message";
import RoomAndUsers from "./room-and-users";

const Chat = ({ username, room, socket }) => {
  return (
    <div className={styles.chatContainer}>
      {/* Add this */}
      <RoomAndUsers socket={socket} username={username} room={room} />

      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
