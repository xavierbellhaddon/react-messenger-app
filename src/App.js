import {
  Button,
  FormControl,
  Input,
  InputLabel,
  withStyles,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import Message from "./Message";
import firebase from "firebase";
import db from "./firebase.js";
import FlipMove from "react-flip-move";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  const StyledButton = withStyles({
    root: {
      marginTop: "10px",
    },
    label: {
      textTransform: "capitalize",
    },
  })(Button);

  useEffect(() => {
    db.collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        );
      });
  }, []);

  useEffect(() => {
    setUsername(prompt("Please enter your name"));
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    db.collection("messages").add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  const isLoggedIn = username.length > 0;

  return (
    <div className="App">
      <div className="titleContainer">
        <h1 className="app__title">
          Hey there, {isLoggedIn ? username : "stranger"}!
        </h1>
      </div>

      <form className="app__form" onSubmit={sendMessage}>
        <FormControl>
          <InputLabel>Enter a message...</InputLabel>
          <Input
            value={input}
            // color='secondary'
            onChange={(event) => setInput(event.target.value)}
          />
          <StyledButton
            type="submit"
            disabled={!input}
            variant="contained"
            color="primary"
          >
            Send Message
          </StyledButton>
        </FormControl>
      </form>

      <FlipMove>
        <div className="formContainer">
          {messages.length > 0 &&
            messages.map(({ id, message }) => (
              <Message key={id} username={username} message={message} />
            ))}
        </div>
      </FlipMove>
    </div>
  );
}

export default App;
