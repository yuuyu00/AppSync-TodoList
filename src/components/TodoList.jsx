import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { listTodos } from "../graphql/queries";
import { List, Menu, Checkbox } from "semantic-ui-react";

import CreateTodo from "./CreateTodo";
import DeleteTodo from "./DeleteTodo";
import UpdateTodo from "./UpdateTodo";
import useUserOptions from "../hooks/useUserOptions";
import Notification from "./Notification";

const TodoList = props => {
  const [userOptions, setUserOptions] = useState(null);
  const [activeItem, setActiveItem] = useState("TODO");
  const [notifiVisible, setNotifiVisible] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const getUserOption = useUserOptions;

  useEffect(() => {
    (async () => {
      const fetchedUserOptions = await getUserOption();
      setUserOptions(fetchedUserOptions);
    })();
  }, []);

  const handleNotification = message => {
    setNotifyMessage(message);
    setNotifiVisible(true);
    setTimeout(() => {
      setNotifiVisible(false);
    }, 3000);
  };

  const renderTodos = todoItems => {
    todoItems = todoItems.data.listTodos.items;
    return (
      <List
        style={{ paddingRight: "3%", paddingLeft: "3%", paddingTop: "15px" }}
      >
        {todoItems.map(elm => {
          return (
            <List.Item key={elm.id}>
              <List.Content floated="right">
                <span style={{ marginRight: "10px" }}>{elm.description}</span>
                <UpdateTodo
                  todo={elm}
                  userOptions={userOptions}
                  todos={todoItems}
                  handleNotification={handleNotification}
                />
                <DeleteTodo
                  id={elm.id}
                  todoname={elm.name}
                  handleNotification={handleNotification}
                />
              </List.Content>
              <List.Content floated="left">
                <Checkbox style={{ marginTop: "5px", marginBotton: "5px" }} />
              </List.Content>
              <List.Content>
                <List.Header>{elm.name}</List.Header>
                {elm.assignee.name}
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  };

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const renderMenu = () => {
    return (
      <Menu tabular>
        <Menu.Item
          name="TODO"
          active={activeItem === "TODO"}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="Member"
          active={activeItem === "Member"}
          onClick={handleItemClick}
        />
        <Menu.Menu position="right" style={{ paddingRight: "10%" }}>
          <CreateTodo
            todos={props.data.listTodos.items}
            userOptions={userOptions}
            handleNotification={handleNotification}
          />
        </Menu.Menu>
      </Menu>
    );
  };

  if (props.data.loading) return <div>Loading...</div>;

  return (
    <div>
      {renderMenu()}
      {renderTodos(props)}
      <Notification
        notifiVisible={notifiVisible}
        notifyMessage={notifyMessage}
      />
    </div>
  );
};

const query = gql(listTodos);

export default graphql(query, {
  options: props => ({ variables: { limit: 100 } })
})(TodoList);
