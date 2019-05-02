import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { listTodos } from "../graphql/queries";
import history from "../history";
import {
  List,
  Menu,
  Checkbox,
  Sidebar,
  Segment,
  Button,
  Icon,
  Header,
  Dimmer,
  Loader
} from "semantic-ui-react";

import CreateTodo from "./CreateTodo";
import DeleteTodo from "./DeleteTodo";
import UpdateTodo from "./UpdateTodo";
import useCategoryOptions from "../hooks/useCategoryOptions";
import useNotification from "../hooks/useNotification";
import Category from "./Category";

const TodoList = props => {
  const [userOptions, setUserOptions] = useState(null);
  const [activeItem, setActiveItem] = useState("TODO");
  const [notifiVisible, setNotifiVisible] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [show, setShow] = useState(false);
  const getUserOption = useCategoryOptions;
  const notification = useNotification();

  useEffect(() => {
    (async () => {
      const fetchedUserOptions = await getUserOption();
      setUserOptions(fetchedUserOptions);
    })();
  }, []);

  const renderTodos = () => {
    let todoItems;
    if ("category" in props.match.params) {
      if (props.match.params.category === "Inbox") {
        todoItems = props.data.listTodos.items.filter(elm => {
          return elm.category === null;
        });
      } else {
        todoItems = props.data.listTodos.items.filter(elm => {
          return (
            elm.category !== null &&
            elm.category.name === props.match.params.category
          );
        });
      }
    } else {
      todoItems = props.data.listTodos.items;
    }

    return (
      <>
        <List
          style={{ paddingRight: "3%", paddingLeft: "3%", paddingTop: "15px" }}
        >
          <Header as="h2">{props.match.params.category || "All Todos"}</Header>
          {todoItems.map(elm => {
            const category =
              elm.category !== null ? elm.category.name : "Inbox";
            return (
              <List.Item key={elm.id}>
                <List.Content floated="right">
                  <span style={{ marginRight: "10px" }}>{elm.description}</span>
                  <UpdateTodo
                    todo={elm}
                    userOptions={userOptions}
                    todos={todoItems}
                  />
                  <DeleteTodo
                    id={elm.id}
                    todoname={elm.name}
                    handleNotification={notification.handleNotification}
                  />
                </List.Content>
                <List.Content floated="left">
                  <Checkbox style={{ marginTop: "5px", marginBotton: "5px" }} />
                </List.Content>
                <List.Content>
                  <List.Header>{elm.name}</List.Header>
                  {category}
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </>
    );
  };

  const renderSidebar = () => {
    return (
      <>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            onHide={() => setShow(false)}
            vertical
            visible={show}
            width="thin"
            style={{ bottom: "0" }}
            onClick={() => setShow(false)}
          >
            <Category />
          </Sidebar>
          <Sidebar.Pusher
            style={{ height: "100%" }}
            dimmed={show}
            onClick={() => {
              if (show) {
                setShow(false);
              }
            }}
          >
            {renderTodos(props)}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </>
    );
  };

  const renderMenu = () => {
    return (
      <Menu fixed="top" borderless style={{ backgroundColor: "#00b5ad" }}>
        <Menu.Item
          onClick={() => {
            show ? setShow(false) : setShow(true);
          }}
        >
          <Icon name="bars" style={{ color: "white" }} />
        </Menu.Item>
        <Menu.Item>
          <Icon name="checkmark" size="large" style={{ color: "white" }} />
          <span style={{ fontSize: "18px", color: "white" }}>Todo</span>
        </Menu.Item>
        <Menu.Item position="right" style={{ paddingRight: "10%" }}>
          <CreateTodo
            todos={props.data.listTodos.items}
            userOptions={userOptions}
          />
        </Menu.Item>
        <Menu.Item>
          <Button>Sign Out</Button>
        </Menu.Item>
      </Menu>
    );
  };

  if (props.data.loading) return <Loader active>Loading...</Loader>;
  return (
    <div style={{ height: "100vh", paddingTop: "30px" }}>
      {renderMenu()}
      {renderSidebar()}
      {notification.Notification}
    </div>
  );
};

const query = gql(listTodos);

export default graphql(query, {
  options: props => ({ variables: { limit: 100 } })
})(TodoList);
