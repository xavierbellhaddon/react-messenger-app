import {
  Button,
  FormControl,
  Input,
  InputLabel,
  withStyles,
  Modal,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import Message from "./Message";
import firebase from "firebase";
import { db, auth } from "./firebase.js";
import FlipMove from "react-flip-move";
import { makeStyles } from "@material-ui/core/styles";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
})
)


function App() {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(true);
  

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

  // useEffect(() => {
  //   setUsername(prompt("Please enter your name"));
  // }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

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

      <Modal open={open} onClose={() => setOpen(false)}>
        <div  style={modalStyle}className={classes.paper}>
          <p>POOP</p>
          <form className="app__signup">
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* <Button onClick={signUp}>Sign Up</Button> */}
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

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
