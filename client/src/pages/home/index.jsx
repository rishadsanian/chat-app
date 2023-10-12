import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();
  useEffect(() => {
    // Read username and room from localStorage
    let storedUsername = localStorage.getItem("username");
    let storedRoom = localStorage.getItem("room");
    console.log(storedUsername, storedRoom);
    // Set username and room state if available in localStorage
    if (storedUsername && storedRoom) {
      setUsername(storedUsername);
      setRoom(storedRoom);

      // Call joinRoom function after a short delay
      setTimeout(() => {
        joinRoom();
      }, 100);
    }
  }, []);

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });

      // Store username and room in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("room", room);

      navigate("/chat", { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`CHAT APP`}</h1>
        <input
          className={styles.input}
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)}
        />

        <select
          className={styles.input}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          <option value="javascript">JavaScript</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="react">React</option>
        </select>

        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
