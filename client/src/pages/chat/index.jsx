import styles from "./styles.module.css";
import MessagesReceived from "./messages";
import SendMessage from "./send-message";
import RoomAndUsers from "./room-and-users";

const Chat = ({ username, setUsername, room, setRoom, socket }) => {
  return (
    <div className={styles.chatContainer}>
      {/* Add this */}
      <RoomAndUsers username={username} setUsername={setUsername} room={room} setRoom = {setRoom} socket={socket} />

      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
