import React, { useState } from "react";
import { TransitionablePortal, Message } from "semantic-ui-react";

export default () => {
  const [notifiVisible, setNotifiVisible] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");

  const handleNotification = message => {
    setNotifyMessage(message);
    setNotifiVisible(true);
    setTimeout(() => {
      setNotifiVisible(false);
    }, 3000);
  };

  const renderNotification = () => {
    return (
      <TransitionablePortal
        open={notifiVisible}
        transition={{ animation: "fade up", duration: 500 }}
      >
        <Message
          positive
          style={{
            position: "fixed",
            bottom: "3%",
            top: "auto",
            right: "5%",
            left: "5%",
            width: "90%",
            zIndex: 1000
          }}
        >
          <Message.Header>{notifyMessage}</Message.Header>
        </Message>
      </TransitionablePortal>
    );
  };

  return {
    handleNotification,
    Notification: renderNotification()
  };
};
