import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import db from "../firebase";
import firebase from "firebase/app";

export default function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const { chatname } = route.params;

  useEffect(() => {
    let unsubscribeFromNewSnapshots = db
      .collection("Chats")
      .doc(chatname)
      .onSnapshot((snapshot) => {
        let newMessages = snapshot.data().messages.map((singleMessage) =>{
            singleMessage.createdAt = singleMessage.createdAt.seconds * 1000; // converting firebase nanoseconds to miliseconds for unix
            return singleMessage; //needs to return message to work
        }) 
        console.log("New Snapshot!");
        setMessages(newMessages);
      });

    return function cleanupBeforeUnmounting() {
      unsubscribeFromNewSnapshots();
    };
  }, []);

  const onSend = useCallback((messages = []) => {
    db.collection("Chats")
      .doc(chatname)
      .update({
        // arrayUnion appends the message to the existing array
        messages: firebase.firestore.FieldValue.arrayUnion(messages[0]),
      });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        // current "blue bubble" user
        _id: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        avatar: "https://www.thesprucepets.com/thmb/uc2gXpMNpSegoPUHMNHTC5BGQtQ=/1080x1075/filters:no_upscale():max_bytes(150000):strip_icc()/19933184_104417643500613_5541725731421159424_n-5ba0548546e0fb0050edecc0.jpg",
        // ex: using require; avatar: require("../assets/photo.png”),
      }}
      inverted={false}
      showUserAvatar={true}
      renderUsernameOnMessage={true}
    />
  );
}