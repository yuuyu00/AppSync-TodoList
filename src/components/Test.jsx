import React, { useState } from "react";
import {
  Button,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar
} from "semantic-ui-react";

export default () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          console.log(show);
          show ? setShow(false) : setShow(true);
        }}
      >
        Show sidebar
      </Button>
      <Button onClick={() => setShow(false)}>Close sidebar</Button>

      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          onHide={() => setShow(false)}
          vertical
          visible={show}
          width="thin"
          onClick={() => setShow(false)}
        >
          <Menu.Item as="a">Home</Menu.Item>
          <Menu.Item as="a">Games</Menu.Item>
          <Menu.Item as="a">Channels</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic>
            <Header as="h3">Application Content</Header>
            <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};
