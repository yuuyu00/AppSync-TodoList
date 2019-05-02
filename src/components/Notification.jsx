import React from "react";
import { TransitionablePortal, Message } from "semantic-ui-react";

export default ({ notifiVisible, notifyMessage }) => {
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
          zIndex: 1000
        }}
      >
        <Message.Header>{notifyMessage}</Message.Header>
      </Message>
    </TransitionablePortal>
  );
};
