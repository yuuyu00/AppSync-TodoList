import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { listTodos } from "../graphql/queries";
import { Segment, Button, List, Menu } from "semantic-ui-react";

import { createTodo } from "../graphql/mutations";
import CreateTodo from "./CreateTodo";
import DeleteTodo from "./DeleteTodo";
import UpdateTodo from "./UpdateTodo";
import useUserOptions from "../hooks/useUserOptions";

const TodoList = props => {
  const [userOptions, setUserOptions] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const getUserOption = useUserOptions;

  useEffect(() => {
    (async () => {
      const fetchedUserOptions = await getUserOption();
      setUserOptions(fetchedUserOptions);
    })();
  }, []);

  const renderTodos = todoItems => {
    todoItems = todoItems.data.listTodos.items;
    return (
      <List bulleted>
        {todoItems.map(elm => {
          return (
            <List.Item key={elm.id}>
              <List.Content floated="right">
                <UpdateTodo
                  todo={elm}
                  userOptions={userOptions}
                  todos={todoItems}
                />
                <DeleteTodo id={elm.id} todoname={elm.name} />
              </List.Content>
              {elm.name}
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
      <Menu>
        <Menu.Item
          name="editorials"
          active={activeItem === "editorials"}
          onClick={handleItemClick}
        >
          Editorials
        </Menu.Item>

        <Menu.Item
          name="reviews"
          active={activeItem === "reviews"}
          onClick={handleItemClick}
        >
          Reviews
        </Menu.Item>

        <Menu.Item
          name="upcomingEvents"
          active={activeItem === "upcomingEvents"}
          onClick={handleItemClick}
        >
          Upcoming Events
        </Menu.Item>
      </Menu>
    );
  };

  if (props.data.loading) return <div>Loading...</div>;

  return (
    <>
      {renderMenu()}
      <Segment>
        {renderTodos(props)}
        <CreateTodo
          todos={props.data.listTodos.items}
          userOptions={userOptions}
        />
      </Segment>
    </>
  );
};

const query = gql(listTodos);

export default graphql(query, {
  options: props => ({ variables: { limit: 100 } })
})(TodoList);
